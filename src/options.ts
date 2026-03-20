// Default whitelist
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

async function loadWhitelist() {
  const data: any = await chrome.storage.sync.get({ whitelist: DEFAULT_WHITELIST });
  const whitelist: string[] = data.whitelist || DEFAULT_WHITELIST;
  
  const container = document.getElementById("whitelistContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  whitelist.forEach((domain: string, index: number) => {
    const div = document.createElement("div");
    div.className = "whitelist-item";
    div.innerHTML = `<input type="checkbox" id="domain-${index}" checked><label for="domain-${index}">${domain}</label>`;
    container.appendChild(div);
  });
}

async function addDomain() {
  const input = document.getElementById("newDomain") as HTMLInputElement | null;
  if (!input) return;
  
  const domain = input.value.trim().toLowerCase();
  if (!domain) {
    showOptionsStatus("请输入域名", false);
    return;
  }
  
  if (!/^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}$|^localhost$|^127\.0\.0\.1$/.test(domain)) {
    showOptionsStatus("域名格式不正确", false);
    return;
  }
  
  const data: any = await chrome.storage.sync.get({ whitelist: DEFAULT_WHITELIST });
  const whitelist: string[] = data.whitelist || DEFAULT_WHITELIST;
  
  if ((whitelist as any).includes(domain)) {
    showOptionsStatus("此域名已存在", false);
    return;
  }
  
  whitelist.push(domain);
  await chrome.storage.sync.set({ whitelist });
  input.value = "";
  loadWhitelist();
  showOptionsStatus("域名已添加", true);
}

async function saveSettings() {
  const container = document.getElementById("whitelistContainer");
  if (!container) return;
  
  const whitelist: string[] = [];
  container.querySelectorAll(".whitelist-item").forEach((item) => {
    const checkbox = item.querySelector("input[type='checkbox']") as HTMLInputElement | null;
    const label = item.querySelector("label");
    if (checkbox && checkbox.checked && label && label.textContent) {
      whitelist.push(label.textContent.trim());
    }
  });
  
  if (whitelist.length === 0) {
    showOptionsStatus("白名单不能为空", false);
    return;
  }
  
  await chrome.storage.sync.set({ whitelist });
  showOptionsStatus("✓ 设置已保存", true);
}

async function resetToDefault() {
  if (confirm("确定要恢复默认白名单吗？")) {
    await chrome.storage.sync.set({ whitelist: DEFAULT_WHITELIST });
    loadWhitelist();
    showOptionsStatus("✓ 已恢复默认设置", true);
  }
}

function showOptionsStatus(message: string, isSuccess: boolean) {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `status-message ${isSuccess ? "success" : "error"}`;
  setTimeout(() => { statusEl.className = "status-message"; }, 3000);
}

// 滚动到指定部分
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// 全选或全不选
async function toggleAllWhitelist(checked: boolean) {
  const container = document.getElementById("whitelistContainer");
  if (!container) return;

  const checkboxes = container.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
  checkboxes.forEach(checkbox => {
    checkbox.checked = checked;
  });

  await saveSettings();
  showOptionsStatus(checked ? "✓ 已启用所有网站" : "✓ 已禁用所有网站", true);
}

document.addEventListener("DOMContentLoaded", () => {
  loadWhitelist();
  const input = document.getElementById("newDomain") as HTMLInputElement | null;
  if (input) input.addEventListener("keypress", (e) => { if (e.key === "Enter") addDomain(); });
});
