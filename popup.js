document.getElementById("searchBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const input = document.getElementById("searchInput").value;
  const strict = document.getElementById("strictMode").checked;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [input, !strict],
    func: (query, loose) => {
      window.dispatchEvent(new CustomEvent("commentSearch", {
        detail: { query, loose }
      }));
    }
  });
});

document.getElementById("nextBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.dispatchEvent(new CustomEvent("jumpToMatch", { detail: "next" }))
  });
});

document.getElementById("prevBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.dispatchEvent(new CustomEvent("jumpToMatch", { detail: "prev" }))
  });
});
