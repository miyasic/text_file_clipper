chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if(window.confirm(`コピーしますか？¥n${data.filepath}`)) {
    setTimeout(() => navigator.clipboard.writeText(data.content), 300);
    if (data.message === 'downloadComplete') {
      sendResponse({ result: 'success' });
    }
    return true;
  }
  return false;
});

