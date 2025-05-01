// Check if script has already run
if (window.contentScriptLoaded) {
  console.log("Content script already loaded, skipping...");
} else {
  window.contentScriptLoaded = true;
  console.log("Content script loaded!");

  // Create popup icon
  const icon = document.createElement("div");
  icon.className = "popup-icon";
  icon.innerHTML = "🔍";
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
    transition: all 0.2s ease;
  `;
  document.body.appendChild(icon);

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

  function showLoginPopup(cardName, cardDescription, cardHint) {
    popup.innerHTML = `
      <div style="font-family: 'Montserrat', sans-serif; padding: 15px;">
        <h2 style="font-size: 24px; font-weight: 700; color: rgba(0, 0, 0, 0.87); margin-bottom: 16px; text-align: center; line-height: 30px;">Sign in to save your card</h2>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="margin-bottom: 6px; color: #374151; font-size: 14px; font-weight: 500; display: block;">Username</label>
            <input id="username" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; font-family: 'Montserrat', sans-serif;" type="text" placeholder="Enter your username">
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
        // Switch to sign up mode
        repeatPasswordGroup.style.display = "block";
        signInButton.textContent = "Sign Up";
        signupLink.textContent = "Sign In";
      } else {
        // Switch to sign in mode
        repeatPasswordGroup.style.display = "none";
        signInButton.textContent = "Sign In";
        signupLink.textContent = "Sign Up";
      }
    };

    signInButton.onclick = function (e) {
      e.stopPropagation();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        alert("Please enter your username and password");
        return;
      }

      if (isSignUpMode) {
        const repeatPassword = document.getElementById("repeatPassword").value;

        if (password !== repeatPassword) {
          alert("Passwords do not match");
          return;
        }

        // Handle sign up logic
        console.log("Signing up and saving card:", {
          name: cardName,
          description: cardDescription,
          hint: cardHint,
          user: username,
        });

        alert("Account created and card saved successfully!");
      } else {
        // Handle sign in logic
        console.log("Signing in and saving card:", {
          name: cardName,
          description: cardDescription,
          hint: cardHint,
          user: username,
        });

        alert("Card saved successfully!");
      }

      popup.style.display = "none";
    };

    popup.style.display = "block";
  }

  icon.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();

    if (!lastSelection) return;

    // Visual feedback when icon is clicked
    icon.style.transform = "scale(0.85)";

    // Add a ripple effect
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      background: rgba(75, 79, 186, 0.3);
      border-radius: 50%;
      pointer-events: none;
    `;
    icon.appendChild(ripple);

    // Animate ripple
    let size = 0;
    const rippleAnimation = setInterval(() => {
      size += 4;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.opacity = 1 - size / 60;

      if (size > 60) {
        clearInterval(rippleAnimation);
        icon.removeChild(ripple);

        // Reset icon appearance
        setTimeout(() => {
          icon.style.transform = "scale(1)";
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

        // Show icon with animation
        icon.style.display = "block";
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.8)";
        icon.style.top = `${rect.top - 40}px`;
        icon.style.left = `${rect.left + rect.width / 2 - 15}px`;

        // Animate icon appearance
        setTimeout(() => {
          icon.style.opacity = "1";
          icon.style.transform = "scale(1)";
        }, 10);

        icon.onmouseover = () => (icon.style.transform = "scale(1.2)");
        icon.onmouseout = () => (icon.style.transform = "scale(1)");
      } catch (error) {
        console.error("Error processing selection:", error);
      }
    } else {
      // Hide icon with animation
      if (icon.style.display !== "none") {
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.8)";
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
