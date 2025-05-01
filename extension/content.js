// Check if script has already run
if (window.contentScriptLoaded) {
  console.log("Content script already loaded, skipping...");
} else {
  window.contentScriptLoaded = true;
  console.log("Content script loaded!");

  // Create popup icon container
  const icon = document.createElement("div");
  icon.className = "popup-icon";
  icon.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 10000;
    background: white;
    border-radius: 14px;
    padding: 6px 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    height: 32px;
    text-align: center;
    pointer-events: auto;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 500;
    font-size: 13.5px;
    color: #4B4FBA;
    border: 1px solid rgba(75, 79, 186, 0.1);
    min-width: fit-content;
    max-width: max-content;
  `;

  // Add SVG logo with wordmark
  const logoSvg = `
<svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_18_2)">
<path d="M32 42V44C32 44 32 47 35 47C38 47 38 44 38 44V42M32 42C32 42 31.9994 41 30.9997 40C30 39 28.7562 37.2706 28.0534 36.0407C27.3506 34.8109 26.987 33.4164 26.9997 32C26.9997 28 29.9997 24 34.9997 24C39.9997 24 42.9997 28 42.9997 32C43.0124 33.4164 42.6487 34.8109 41.9459 36.0407C41.2432 37.2706 39.9994 39 38.9997 40C38 41 38 42 38 42M32 42H38" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23 17H47C49.2091 17 51 18.7909 51 21V49C51 51.2091 49.2091 53 47 53H23C20.7909 53 19 51.2091 19 49V21C19 18.7909 20.7909 17 23 17Z" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 47C14.7909 47 13 45.2091 13 43V17C13 14 16 11 19 11H41C43.2091 11 45 12.7909 45 15" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_18_2">
<rect width="64" height="64" fill="white"/>
</clipPath>
</defs>
</svg>
  `;

  // Create logo element
  const logoContainer = document.createElement("div");
  logoContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-bottom: -1px;
  `;
  logoContainer.innerHTML = logoSvg;

  // Create text element with wordmark
  const textElement = document.createElement("span");
  textElement.textContent = "Flashcard";
  textElement.style.cssText = `
    font-size: 13.5px;
    white-space: nowrap;
    letter-spacing: -0.1px;
    line-height: 1;
    margin-top: 1px;
    font-weight: 600;
    color: #4B4FBA;
  `;

  // Add elements to icon container
  icon.appendChild(logoContainer);
  icon.appendChild(textElement);

  document.body.appendChild(icon);

  // Add click event listener to the icon
  icon.addEventListener('click', () => {
    const selectedText = window.getSelection().toString().trim();
    showPopup(selectedText);
  });

  // Create popup window
  const popup = document.createElement("div");
  popup.className = "popup-window";
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
    border: 2px solid #4b4fba;
    pointer-events: auto;
    font-family: 'Montserrat', sans-serif;
  `;
  document.body.appendChild(popup);

  let lastSelection = null;

  function showPopup(htmlCode) {
    popup.innerHTML = `
      <div style="font-family: 'Montserrat', sans-serif; padding: 15px;">
        <h1 style="color: #1f2937; font-size: 28px; text-align: center; margin-bottom: 20px; font-weight: 700;">Create New Card</h1>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Card Front Side:</label>
          <input type="text" id="cardName" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; font-family: 'Montserrat', sans-serif;" placeholder="Enter front side of card">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Card Back Side:</label>
          <textarea id="cardDescription" style="width: 100%; min-height: 100px; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; font-family: 'Montserrat', sans-serif; resize: vertical;" placeholder="Enter backside of card">${htmlCode}</textarea>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Card Hint:</label>
          <input type="text" id="cardHint" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; font-family: 'Montserrat', sans-serif;" placeholder="Enter card hint">
        </div>

        <div style="display: flex; justify-content: space-between; gap: 10px; margin-top: 20px;">
          <button id="saveCard" style="flex: 1; padding: 10px 16px; background-color: #4b4fba; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Save Card</button>
          <button id="closePopup" style="flex: 1; padding: 10px 16px; background-color: #374151; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Close</button>
        </div>
      </div>
    `;

    // Add hover effects
    const saveButton = document.getElementById("saveCard");
    const closeButton = document.getElementById("closePopup");

    saveButton.onmouseover = () =>
      (saveButton.style.backgroundColor = "#3f43a6");
    saveButton.onmouseout = () =>
      (saveButton.style.backgroundColor = "#4b4fba");

    closeButton.onmouseover = () =>
      (closeButton.style.backgroundColor = "#1f2937");
    closeButton.onmouseout = () =>
      (closeButton.style.backgroundColor = "#374151");

    document.getElementById("saveCard").onclick = function (e) {
      e.stopPropagation();
      const cardName = document.getElementById("cardName").value;
      const cardDescription = document.getElementById("cardDescription").value;
      const cardHint = document.getElementById("cardHint").value;

      if (cardName && cardDescription) {
        console.log("Saving card:", {
          name: cardName,
          description: cardDescription,
          hint: cardHint,
        });

        // Show login section
        showLoginPopup(cardName, cardDescription, cardHint);
      } else {
        alert("Please fill in all required fields!");
      }
    };

    document.getElementById("closePopup").onclick = function (e) {
      e.stopPropagation();
      popup.style.display = "none";
    };

    popup.style.display = "block";
  }

  async function handleLogout() {
    try {
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        console.log('No token found, already logged out');
        return;
      }

      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear stored credentials
      localStorage.removeItem('idToken');
      localStorage.removeItem('username');
      
      console.log('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local storage even if server logout fails
      localStorage.removeItem('idToken');
      localStorage.removeItem('username');
    }
  }

  function showLoginPopup(cardName, cardDescription, cardHint) {
    // Check if user is already logged in
    const idToken = localStorage.getItem('idToken');
    const savedUsername = localStorage.getItem('username');

    if (idToken && savedUsername) {
      // User is logged in, show save card interface
      popup.innerHTML = `
        <div style="font-family: 'Montserrat', sans-serif; padding: 15px;">
          <h2 style="font-size: 24px; font-weight: 700; color: rgba(0, 0, 0, 0.87); margin-bottom: 16px; text-align: center; line-height: 30px;">Save Card</h2>
          
          <div style="margin-bottom: 20px;">
            <div style="margin-bottom: 8px;">
              <label style="display: block; margin-bottom: 4px; color: #374151; font-weight: 500;">Front:</label>
              <div style="padding: 8px; background: #f3f4f6; border-radius: 4px; color: #1f2937;">${cardName}</div>
            </div>
            <div style="margin-bottom: 8px;">
              <label style="display: block; margin-bottom: 4px; color: #374151; font-weight: 500;">Back:</label>
              <div style="padding: 8px; background: #f3f4f6; border-radius: 4px; color: #1f2937;">${cardDescription}</div>
            </div>
            ${cardHint ? `
              <div style="margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 4px; color: #374151; font-weight: 500;">Hint:</label>
                <div style="padding: 8px; background: #f3f4f6; border-radius: 4px; color: #1f2937;">${cardHint}</div>
              </div>
            ` : ''}
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button id="saveCard" style="flex: 1; padding: 10px 16px; background-color: #4b4fba; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Save Card</button>
            <button id="logoutButton" style="flex: 1; padding: 10px 16px; background-color: #374151; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Logout</button>
          </div>
        </div>
      `;

      document.getElementById("saveCard").onclick = async function (e) {
        e.stopPropagation();
        try {
          await saveCard(cardName, cardDescription, cardHint, idToken);
        } catch (error) {
          console.error('Error saving card:', error);
        }
      };

      document.getElementById("logoutButton").onclick = async function (e) {
        e.stopPropagation();
        await handleLogout();
        showLoginPopup(cardName, cardDescription, cardHint);
      };

      popup.style.display = "block";
      return;
    }

    popup.innerHTML = `
      <div style="font-family: 'Montserrat', sans-serif; padding: 15px;">
        <h2 style="font-size: 24px; font-weight: 700; color: rgba(0, 0, 0, 0.87); margin-bottom: 16px; text-align: center; line-height: 30px;">Sign in to save your card</h2>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="margin-bottom: 6px; color: #374151; font-size: 14px; font-weight: 500; display: block;">Username</label>
            <input id="username" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; font-family: 'Montserrat', sans-serif;" type="text" placeholder="Enter your username" value="${savedUsername || ''}">
          </div>

          <div>
            <label style="margin-bottom: 6px; color: #374151; font-size: 14px; font-weight: 500; display: block;">Password</label>
            <input id="password" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; font-family: 'Montserrat', sans-serif;" type="password" placeholder="Enter your password">
          </div>

          <div id="repeatPasswordGroup" style="display: none;">
            <label style="margin-bottom: 6px; color: #374151; font-size: 14px; font-weight: 500; display: block;">Repeat Password</label>
            <input id="repeatPassword" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; font-family: 'Montserrat', sans-serif;" type="password" placeholder="Repeat your password">
          </div>

          <button id="signInButton" style="padding: 10px 16px; background-color: #4b4fba; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: 'Montserrat', sans-serif; margin-top: 8px;">Sign In</button>

          <div style="text-align: center; margin-top: 12px; font-size: 14px; color: #6b7280;">
            <span>Don't have an account?</span>
            <a id="signupLink" style="color: #4b4fba; text-decoration: none; font-weight: 500; cursor: pointer;">Sign Up</a>
          </div>
        </div>
      </div>
    `;

    const signInButton = document.getElementById("signInButton");
    const signupLink = document.getElementById("signupLink");
    const repeatPasswordGroup = document.getElementById("repeatPasswordGroup");

    let isSignUpMode = false;

    signInButton.onmouseover = () => {
      signInButton.style.backgroundColor = "#3f43a6";
      signInButton.style.transform = "translateY(-1px)";
    };
    signInButton.onmouseout = () => {
      signInButton.style.backgroundColor = "#4b4fba";
      signInButton.style.transform = "translateY(0)";
    };

    signupLink.onmouseover = () =>
      (signupLink.style.textDecoration = "underline");
    signupLink.onmouseout = () => (signupLink.style.textDecoration = "none");

    signupLink.onclick = function (e) {
      e.preventDefault();
      isSignUpMode = !isSignUpMode;
      if (isSignUpMode) {
        repeatPasswordGroup.style.display = "block";
        signInButton.textContent = "Sign Up";
        signupLink.textContent = "Sign In";
      } else {
        repeatPasswordGroup.style.display = "none";
        signInButton.textContent = "Sign In";
        signupLink.textContent = "Sign Up";
      }
    };

    signInButton.onclick = async function (e) {
      e.stopPropagation();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        alert("Please enter your username and password");
        return;
      }

      try {
        let response;
        if (isSignUpMode) {
          const repeatPassword = document.getElementById("repeatPassword").value;
          if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
          }

          response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: username,
              password: password,
              confirmPassword: repeatPassword
            })
          });
        } else {
          response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: username,
              password: password
            })
          });
        }

        if (!response.ok) {
          throw new Error(isSignUpMode ? 'Registration failed' : 'Login failed');
        }

        const data = await response.json();
        
        // Save login info
        localStorage.setItem('idToken', data.idToken);
        localStorage.setItem('username', username);

        // Save the card
        await saveCard(cardName, cardDescription, cardHint, data.idToken);
        
        alert(isSignUpMode ? "Account created and card saved successfully!" : "Card saved successfully!");
        popup.style.display = "none";
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    };

    popup.style.display = "block";
  }

  async function saveCard(cardName, cardDescription, cardHint, token) {
    try {
      if (!cardName || !cardDescription) {
        throw new Error('Front and back sides are required');
      }

      const response = await fetch('http://localhost:3000/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          front: cardName,
          back: cardDescription,
          hint: cardHint || '',
          tags: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save card');
      }

      const data = await response.json();
      console.log('Card saved successfully:', data);
      
      // Show success message
      popup.innerHTML = `
        <div style="font-family: 'Montserrat', sans-serif; padding: 15px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: 700; color: #4b4fba; margin-bottom: 16px;">Card Saved Successfully!</h2>
          <p style="color: #374151; margin-bottom: 20px;">Your flashcard has been saved to your collection.</p>
          <button id="closePopup" style="padding: 10px 16px; background-color: #4b4fba; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Close</button>
        </div>
      `;

      document.getElementById("closePopup").onclick = function (e) {
        e.stopPropagation();
        popup.style.display = "none";
      };

      return data;
    } catch (error) {
      console.error('Error saving card:', error);
      // Show error message
      popup.innerHTML = `
        <div style="font-family: 'Montserrat', sans-serif; padding: 15px; text-align: center;">
          <h2 style="font-size: 24px; font-weight: 700; color: #dc2626; margin-bottom: 16px;">Error Saving Card</h2>
          <p style="color: #374151; margin-bottom: 20px;">${error.message}</p>
          <button id="closePopup" style="padding: 10px 16px; background-color: #dc2626; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 500; font-family: 'Montserrat', sans-serif; transition: background-color 0.2s ease;">Close</button>
        </div>
      `;

      document.getElementById("closePopup").onclick = function (e) {
        e.stopPropagation();
        popup.style.display = "none";
      };

      throw error;
    }
  }

  icon.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (!lastSelection) return;

    // Visual feedback when icon is clicked
    icon.style.transform = "scale(0.95)";
    icon.style.backgroundColor = "#f5f5ff";

    // Add a ripple effect
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      background: rgba(75, 79, 186, 0.15);
      border-radius: 20px;
      pointer-events: none;
    `;
    icon.appendChild(ripple);

    // Animate ripple
    let size = 0;
    const maxSize = Math.max(icon.offsetWidth, icon.offsetHeight) * 1.5;
    const rippleAnimation = setInterval(() => {
      size += 8;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.opacity = 1 - size / maxSize;

      if (size > maxSize) {
        clearInterval(rippleAnimation);
        icon.removeChild(ripple);

        // Reset icon appearance
        setTimeout(() => {
          icon.style.transform = "scale(1)";
          icon.style.backgroundColor = "white";
        }, 150);

        // Show popup after visual feedback
        const htmlCode = lastSelection.text;
        if (htmlCode) showPopup(htmlCode);
      }
    }, 10);
  };

  function handleSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        lastSelection = {
          text: selectedText,
          rect: rect,
        };

        // Calculate position (centered above the selection)
        const iconWidth = 180; // Approximate width of the button with text
        const left = Math.max(
          5,
          Math.min(
            document.documentElement.clientWidth - iconWidth - 5,
            rect.left + rect.width / 2 - iconWidth / 2,
          ),
        );

        // Show icon with animation
        icon.style.display = "flex";
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.9) translateY(10px)";
        icon.style.top = `${Math.max(5, rect.top - 45)}px`;
        icon.style.left = `${left}px`;

        // Animate icon appearance
        setTimeout(() => {
          icon.style.opacity = "1";
          icon.style.transform = "scale(1) translateY(0)";
        }, 10);

        // Add hover effects
        icon.onmouseover = () => {
          icon.style.transform = "scale(1.05)";
          icon.style.boxShadow = "0 4px 12px rgba(75, 79, 186, 0.2)";
          icon.style.backgroundColor = "#f8f8ff";
        };

        icon.onmouseout = () => {
          icon.style.transform = "scale(1)";
          icon.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          icon.style.backgroundColor = "white";
        };
      } catch (error) {
        console.error("Error processing selection:", error);
      }
    } else {
      // Hide icon with animation
      if (icon.style.display !== "none") {
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.9) translateY(10px)";
        setTimeout(() => {
          icon.style.display = "none";
        }, 200);
      }
      lastSelection = null;
    }
  }

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSelectedText" && lastSelection) {
      sendResponse({ selectedText: lastSelection.text });
    }
    return true;
  });

  document.addEventListener(
    "mousedown",
    function (e) {
      if (e.target === icon) e.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener("mouseup", handleSelection, { passive: true });
  document.addEventListener("selectionchange", handleSelection, {
    passive: true,
  });

  document.addEventListener(
    "click",
    function (e) {
      if (!popup.contains(e.target) && e.target !== icon) {
        popup.style.display = "none";
      }
    },
    { passive: true },
  );
}
