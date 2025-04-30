/* global chrome */
chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type !== 'OPEN_FLASHCARD_POPUP') return;
  
    const back = encodeURIComponent(msg.text);
    const url = chrome.runtime.getURL(`popup.html?back=${back}`);
  
    // 400×600 px popup window
    chrome.windows.create({
      url,
      type: 'popup',
      width: 400,
      height: 600,
    });
  });
  