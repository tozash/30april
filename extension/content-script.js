/* global chrome */
const ICON_URL = chrome.runtime.getURL('flashcard-icon.svg');
let currentButton = null;

/** Remove any existing floating button */
function removeButton() {
  if (currentButton) {
    currentButton.remove();
    currentButton = null;
  }
}

/** Show floating button under the current selection */
function showButton(selectedText, rect) {
  removeButton();

  const btn = document.createElement('img');
  btn.src = ICON_URL;
  btn.alt = 'Add flashcard';
  btn.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 4}px;
    left: ${rect.left}px;
    width: 24px; height: 24px;
    z-index: 2147483647;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0,0,0,.3);
  `;

  btn.addEventListener('click', () => {
    removeButton();
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP',
      payload: selectedText,
    });
  });

  document.body.appendChild(btn);
  currentButton = btn;
}

/** Listen for selection events */
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : '';

  if (!text) {
    removeButton();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect) showButton(text, rect);
});
