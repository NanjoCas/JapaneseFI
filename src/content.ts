import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const kuroshiro = new Kuroshiro();
let initialized = false;

const DEFAULT_WHITELIST = [
  // Social Media
  "x.com", "twitter.com", "facebook.com", "instagram.com", "reddit.com",
  "mastodon.social", "threads.net", "bluesky.social",
  // Search Engines
  "google.com", "google.co.jp", "yahoo.co.jp", "yahoo.com", "bing.com", "duckduckgo.com",
  // Video/Media Platforms
  "youtube.com", "youtu.be", "vimeo.com", "dailymotion.com",
  // Japanese Websites
  "wikipedia.org", "nikki.com", "blogs.yahoo.co.jp", "livedoor.com",
  "livedoor.jp", "ameblo.jp", "fc2.com", "seesaa.net", "hatenablog.com",
  // News & Media
  "asahi.com", "yomiuri.co.jp", "mainichi.jp", "nikkei.com", "jiji.com",
  "kyodo.co.jp", "cnn.com", "bbc.com", "nytimes.com",
  // Forums & Communities
  "2channel.net", "5channel.net", "nico.ms", "nicovideo.jp",
  "kakaku.com", "stackoverflow.com",
  // Media & Creative
  "pixiv.net", "deviantart.com", "flickr.com", "weibo.com",
  // Miscellaneous
  "localhost", "127.0.0.1"
];

async function getWhitelist(): Promise<string[]> {
  try {
    const data: any = await chrome.storage.sync.get({ whitelist: DEFAULT_WHITELIST });
    return (data.whitelist as string[]) || DEFAULT_WHITELIST;
  } catch (e) {
    return DEFAULT_WHITELIST;
  }
}

async function isWhitelisted(): Promise<boolean> {
  try {
    const hostname = new URL(window.location.href).hostname;
    const whitelist = await getWhitelist();
    return whitelist.some(domain => hostname === domain || hostname.endsWith("." + domain));
  } catch (e) {
    return false;
  }
}

async function injectStyles() {
  // 检查样式是否已注入
  if (document.getElementById("furigana-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "furigana-styles";
  style.textContent = `
    /* 基础 ruby 标签样式 - 保持上方注音 */
    ruby {
      display: ruby;
      font-feature-settings: "ruby" 1;
    }

    ruby rt {
      font-size: 0.5em !important;
      color: #888 !important;
      font-weight: normal !important;
      letter-spacing: -0.08em;
      line-height: 1;
      display: ruby-text;
    }

    ruby rb {
      font-size: 1em;
      line-height: 1;
      display: ruby-base;
    }

    ruby rp {
      display: none;
    }

    /* span 容器自适应大小 */
    span:has(ruby) {
      display: inline;
      width: auto;
      height: auto;
      padding: 0;
      margin: 0;
      line-height: inherit;
    }

    /* 段落和文章行距 */
    p:has(ruby) {
      line-height: 2 !important;
      min-height: auto !important;
      word-spacing: normal !important;
    }

    h1:has(ruby), h2:has(ruby), h3:has(ruby), 
    h4:has(ruby), h5:has(ruby), h6:has(ruby) {
      line-height: 1.95 !important;
    }

    article:has(ruby) {
      line-height: 1.95 !important;
    }

    div[role="article"]:has(ruby) {
      line-height: 2 !important;
    }

    /* 链接中的 ruby */
    a ruby {
      display: ruby;
    }

    a:has(ruby) {
      display: inline;
    }

    /* 标题文本容器 */
    #video-title-container:has(ruby),
    [id*="title"]:has(ruby),
    span[title]:has(ruby) {
      line-height: 1.95 !important;
    }

    /* yt-formatted-string 的特殊处理（YouTube 特定） */
    yt-formatted-string:has(ruby),
    .yt-core-attributed-string:has(ruby) {
      line-height: 1.95 !important;
    }

    /* 避免在按钮等紧凑元素中出现大注音 */
    button ruby rt,
    input ruby rt,
    label ruby rt {
      font-size: 0.6em !important;
    }

    button ruby,
    input ruby,
    label ruby {
      line-height: 1.2 !important;
      margin: 0 !important;
      padding: 0 !important;
      display: ruby;
    }

    button span:has(ruby),
    input span:has(ruby),
    label span:has(ruby) {
      display: inline;
      line-height: inherit;
    }

    /* 评论区和回复 */
    [class*="comment"]:has(ruby),
    [class*="reply"]:has(ruby) {
      line-height: 1.95 !important;
    }

    /* 文本容器基础增加行距 */
    *:has(ruby) {
      word-break: break-word;
    }
  `;
  document.head.appendChild(style);
}

async function init() {
  if (!initialized) {
    try {
      console.log("Furigana: Initializing analyzer...");
      const baseUrl = chrome.runtime.getURL("lib/dict/");
      console.log("Furigana: Dict URL resolved to:", baseUrl);
      const analyzer = new KuromojiAnalyzer({ dictPath: baseUrl });
      console.log("Furigana: Analyzer created, initializing...");
      await kuroshiro.init(analyzer);
      
      // 注入样式
      await injectStyles();
      
      initialized = true;
      console.log("Furigana: ✓ Initialized successfully!");
    } catch (e) {
      console.error("Furigana: ✗ Init failed:", e);
      initialized = false;
    }
  }
}

// 日文汉字范围（排除中文）
const JAPANESE_KANJI_REGEX = /[\u4E00-\u9FFF]/;
const HIRAGANA_REGEX = /[\u3040-\u309F]/;
const KATAKANA_REGEX = /[\u30A0-\u30FF]/;
const HAS_JAPANESE = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;

// 检查文本是否需要处理
function needsProcessing(text: string): boolean {
  // 快速检查：必须包含日文字符
  if (!HAS_JAPANESE.test(text)) return false;
  
  // 包含汉字且包含平假名或片假名
  return JAPANESE_KANJI_REGEX.test(text) && 
         (HIRAGANA_REGEX.test(text) || KATAKANA_REGEX.test(text));
}

async function injectFurigana() {
  await init();
  if (!initialized) return;

  const excludedTags = ["SCRIPT", "STYLE", "RUBY", "RT", "RP", "TEXTAREA", "INPUT", "NOSCRIPT"];
  const targetSelectors = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p",
    "article",
    "div[role='article']",
  ];

  const processed = new WeakSet<Node>();
  let processedCount = 0;
  const MAX_PER_RUN = 50; // 每次运行最多处理 50 个节点，避免卡顿

  for (const selector of targetSelectors) {
    if (processedCount >= MAX_PER_RUN) break;
    
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    
    for (const el of elements) {
      if (processedCount >= MAX_PER_RUN) break;
      if (processed.has(el)) continue;
      
      const walker = document.createTreeWalker(
        el as Node,
        NodeFilter.SHOW_TEXT,
        (node: Node) => {
          const parent = node.parentElement;
          if (parent && excludedTags.includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent?.querySelector("ruby")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      );

      let node;
      const nodesToProcess: [Node, string][] = [];

      while ((node = walker.nextNode()) && processedCount < MAX_PER_RUN) {
        if (processed.has(node)) continue;

        const text = node.textContent || "";
        if (!text.trim() || text.length > 500) continue; // 跳过太长的文本

        if (needsProcessing(text)) {
          nodesToProcess.push([node, text]);
        }
      }

      // 批量处理：使用 Promise.all 并行转换
      const conversions = nodesToProcess.map(([node, text]) =>
        kuroshiro.convert(text, { to: "hiragana", mode: "furigana" })
          .then((result: string) => ({ node, text, result }))
          .catch(() => null as any)
      );

      const results = await Promise.all(conversions);

      // 逆序应用 DOM 更改
      for (let i = results.length - 1; i >= 0; i--) {
        const item = results[i];
        if (!item || item.result === item.text) continue;

        try {
          const span = document.createElement("span");
          span.innerHTML = item.result;
          item.node.parentNode?.replaceChild(span, item.node);
          processed.add(item.node);
          processedCount++;
        } catch (err) {
          // Skip errors
        }
      }
    }
  }
}

(async () => {
  try {
    if (await isWhitelisted()) {
      console.log("Furigana: Site is whitelisted, activating...");
      let timer: NodeJS.Timeout | null = null;
      let isProcessing = false;
      
      const observer = new MutationObserver(() => {
        if (isProcessing) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(async () => {
          isProcessing = true;
          await injectFurigana();
          isProcessing = false;
        }, 500); // 缩短去抖动延迟到 500ms，更快响应
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        characterData: false
      });
      
      setTimeout(() => injectFurigana(), 100); // 首次运行改为 100ms
    } else {
      console.log("Furigana: Site is not whitelisted, skipping activation");
    }
  } catch (e) {
    console.error("Furigana: Failed to check whitelist:", e);
  }
})();
