chrome.runtime.onInstalled.addListener(() => {
  console.log("Furigana Injector extension installed.");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getDictPath") {
    // Get the actual extension URL
    const dictUrl = chrome.runtime.getURL("lib/dict/");
    console.log("Background: Sending dict path:", dictUrl);
    sendResponse({ dictUrl });
  }
});
