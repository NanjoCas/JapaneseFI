// 获取当前网页域名
async function getCurrentDomain(): Promise<string> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return "-";
  try {
    return new URL(tab.url).hostname;
  } catch {
    return "-";
  }
}

// 显示状态信息
function showPopupStatus(message: string, type: "success" | "info" = "info", duration: number = 3000) {
  const statusEl = document.getElementById("statusMessage") as HTMLDivElement;
  statusEl.textContent = message;
  statusEl.className = `status-message show ${type}`;
  
  if (duration > 0) {
    setTimeout(() => {
      statusEl.classList.remove("show");
    }, duration);
  }
}

// 检查域名是否已在白名单中
async function isDomainWhitelisted(domain: string): Promise<boolean> {
  try {
    const data: any = await chrome.storage.sync.get({ whitelist: [] });
    const whitelist = data.whitelist || [];
    return whitelist.includes(domain) || whitelist.some((d: string) => domain.endsWith("." + d));
  } catch {
    return false;
  }
}

// 添加域名到白名单
async function addToWhitelist(domain: string) {
  try {
    const data: any = await chrome.storage.sync.get({ whitelist: [] });
    const whitelist = data.whitelist || [];
    
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
      await chrome.storage.sync.set({ whitelist });
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error adding to whitelist:", e);
    return false;
  }
}

// 刷新当前网页
async function refreshPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
  }
}

// 重置所有whitelisted sites并刷新
async function resetAllSettings() {
  try {
    await chrome.storage.sync.set({ whitelist: [] });
    refreshPage();
  } catch (e) {
    console.error("Error resetting:", e);
    showPopupStatus("重置失败", "info");
  }
}

// 初始化 UI
async function initUI() {
  const domain = await getCurrentDomain();
  const domainDisplay = document.getElementById("domainDisplay") as HTMLElement;
  domainDisplay.textContent = domain;

  const whitelistBtn = document.getElementById("whitelistBtn") as HTMLButtonElement;
  const isWhitelisted = await isDomainWhitelisted(domain);
  
  if (isWhitelisted) {
    whitelistBtn.classList.add("added");
    whitelistBtn.textContent = "✓ 已添加至白名单";
    whitelistBtn.disabled = true;
  }
}

// 事件监听
document.getElementById("whitelistBtn")?.addEventListener("click", async () => {
  const domain = await getCurrentDomain();
  if (domain === "-") {
    showPopupStatus("无法获取网页信息", "info");
    return;
  }

  const btn = document.getElementById("whitelistBtn") as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = "⏳ 处理中...";

  const added = await addToWhitelist(domain);
  
  if (added) {
    btn.classList.add("added");
    btn.textContent = "✓ 已添加至白名单";
    showPopupStatus(`✓ 已将 ${domain} 添加至白名单`, "success");
    
    // 刷新页面以应用注音
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }, 1000);
  } else {
    btn.disabled = false;
    btn.textContent = "➕ 添加至白名单";
    showPopupStatus("此域名已在白名单中", "info");
  }
});

document.getElementById("refreshBtn")?.addEventListener("click", async () => {
  const btn = document.getElementById("refreshBtn") as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = "⏳ 刷新中...";
  
  refreshPage();
  
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "🔄 刷新网页";
  }, 1500);
});

document.getElementById("resetBtn")?.addEventListener("click", async () => {
  const confirmed = confirm("确定要清空所有白名单并重置吗？此操作无法撤销。");
  if (!confirmed) return;

  const btn = document.getElementById("resetBtn") as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = "⏳ 重置中...";

  await resetAllSettings();
  showPopupStatus("✓ 已重置所有设置", "success");
});

document.getElementById("settingsBtn")?.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// 页面加载时初始化
initUI();
