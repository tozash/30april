// Check if script has already run
if (window.contentScriptLoaded) {
  console.log('Content script already loaded, skipping...');
} else {
  window.contentScriptLoaded = true;
  console.log('Content script loaded!');

  // Create popup icon
  const icon = document.createElement('div');
  icon.className = 'popup-icon';
  icon.innerHTML = '🔍';
  icon.style.cssText = `
    position: fixed;
    cursor: pointer;
    z-index: 10000;
    background: white;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    display: none;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    pointer-events: auto;
  `;
  document.body.appendChild(icon);

  // Create popup window
  const popup = document.createElement('div');
  popup.className = 'popup-window';
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    display: none;
    width: 500px;
    max-height: 80vh;
    overflow: auto;
    border: 2px solid #007bff;
    pointer-events: auto;
  `;
  document.body.appendChild(popup);

  let lastSelection = null;

  function showPopup(htmlCode) {
    popup.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 15px;">
        <h2 style="color: #007bff; margin-bottom: 20px; text-align: center;">Create New Card</h2>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Card Name:</label>
          <input type="text" id="cardName" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" placeholder="Enter card name">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Card Description:</label>
          <textarea id="cardDescription" style="width: 100%; height: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" placeholder="Enter card description">${htmlCode}</textarea>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">Card Hint:</label>
          <input type="text" id="cardHint" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" placeholder="Enter card hint">
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <button id="saveCard" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Save Card</button>
          <button id="closePopup" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    
    document.getElementById('saveCard').onclick = function(e) {
      e.stopPropagation();
      const cardName = document.getElementById('cardName').value;
      const cardDescription = document.getElementById('cardDescription').value;
      const cardHint = document.getElementById('cardHint').value;
      
      if (cardName && cardDescription) {
        console.log('Saving card:', { name: cardName, description: cardDescription, hint: cardHint });
        alert('Card saved successfully!');
        popup.style.display = 'none';
      } else {
        alert('Please fill in all required fields!');
      }
    };
    
    document.getElementById('closePopup').onclick = function(e) {
      e.stopPropagation();
      popup.style.display = 'none';
    };
    
    popup.style.display = 'block';
  }

  icon.onclick = function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (!lastSelection) return;

    const htmlCode = lastSelection.html;
    if (htmlCode) showPopup(htmlCode);
  };

  function handleSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        const selectedHTML = range.cloneContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(selectedHTML);
        
        lastSelection = {
          text: selectedText,
          html: tempDiv.innerHTML,
          rect: rect
        };
        
        icon.style.display = 'block';
        icon.style.top = `${rect.top - 40}px`;
        icon.style.left = `${rect.left + (rect.width / 2) - 15}px`;
        
        icon.style.transition = 'transform 0.2s';
        icon.onmouseover = () => icon.style.transform = 'scale(1.2)';
        icon.onmouseout = () => icon.style.transform = 'scale(1)';
      } catch (error) {
        console.error('Error processing selection:', error);
      }
    } else {
      icon.style.display = 'none';
      lastSelection = null;
    }
  }

  document.addEventListener('mousedown', function(e) {
    if (e.target === icon) e.preventDefault();
  }, { passive: false });

  document.addEventListener('mouseup', handleSelection, { passive: true });
  document.addEventListener('selectionchange', handleSelection, { passive: true });

  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && e.target !== icon) {
      popup.style.display = 'none';
    }
  }, { passive: true });
} 