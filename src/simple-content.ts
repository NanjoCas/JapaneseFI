// Simplified content script that avoids complex path issues
// This version is designed for testing and uses a simpler approach

console.log("Furigana Simple: Content script loaded");

async function initializeKuroshiro() {
  try {
    console.log("Furigana Simple: Loading kuroshiro...");
    
    // Dynamic import to avoid bundling issues
    const Kuroshiro = (window as any).Kuroshiro || (await import("kuroshiro")).default;
    const KuromojiAnalyzer = (window as any).KuromojiAnalyzer || (await import("kuroshiro-analyzer-kuromoji")).default;
    
    const kuroshiro = new Kuroshiro();
    const dictPath = chrome.runtime.getURL("lib/dict/");
    
    console.log("Furigana Simple: Dict path:", dictPath);
    console.log("Furigana Simple: Initializing analyzer with path:", dictPath);
    
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath }));
    console.log("Furigana Simple: Kuroshiro initialized!");
    
    return kuroshiro;
  } catch (error) {
    console.error("Furigana Simple: Failed to initialize:", error);
    throw error;
  }
}

async function procesPage(kuroshiro: any) {
  console.log("Furigana Simple: Processing page...");
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  let processed = 0;
  
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (!text || text.length < 1) continue;
    
    // Skip if it's in a script, style, or already processed
    const parent = node.parentElement;
    if (parent && ["SCRIPT", "STYLE", "RUBY", "RT", "RP", "TEXTAREA", "INPUT"].includes(parent.tagName)) {
      continue;
    }

    if (/[一-龠]/.test(text)) {
      try {
        const result = await kuroshiro.convert(text, { to: "hiragana", mode: "furigana" });
        if (result !== text) {
          const span = document.createElement("span");
          span.innerHTML = result;
          node.parentNode?.replaceChild(span, node);
          processed++;
        }
      } catch (err) {
        // Silently skip conversion errors
      }
    }
  }
  
  console.log(`Furigana Simple: Processed ${processed} text nodes with kanji`);
}

// Main execution
(async () => {
  try {
    const kuroshiro = await initializeKuroshiro();
    await procesPage(kuroshiro);
    
    // Watch for dynamic content (social media infinite scroll)
    let timer: any;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => procesPage(kuroshiro), 800);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Furigana Simple: Ready!");
  } catch (error) {
    console.error("Furigana Simple: Initialization failed, giving up.", error);
  }
})();