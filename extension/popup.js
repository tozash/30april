// State management
const state = {
    cardName: "",
    cardDescription: "",
    cardHint: "",
    showLogin: false,
    username: "",
    password: "",
    repeatPassword: "",
    isSignUpMode: false,
    selectedText: "",
    isLoggedIn: false, // Track login status
  };
  
  // DOM Elements
  const noSelectionMessage = document.getElementById("noSelectionMessage");
  const cardForm = document.getElementById("cardForm");
  const cardNameInput = document.getElementById("cardName");
  const cardDescriptionInput = document.getElementById("cardDescription");
  const cardHintInput = document.getElementById("cardHint");
  const saveButton = document.getElementById("saveButton");
  const closeButton = document.getElementById("closeButton");
  const loginSection = document.getElementById("loginSection");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const repeatPasswordGroup = document.getElementById("repeatPasswordGroup");
  const repeatPasswordInput = document.getElementById("repeatPassword");
  const signInButton = document.getElementById("signInButton");
  const signupLink = document.getElementById("signupLink");
  
  // Check login status and selected text when popup opens
  document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in (this would be replaced with your actual auth check)
    checkLoginStatus();
  
    // Get the active tab and check for any selected text
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getSelectedText" },
          (response) => {
            if (response && response.selectedText) {
              state.selectedText = response.selectedText;
              cardDescriptionInput.value = response.selectedText;
              state.cardDescription = response.selectedText;
  
              // Show card form if text is selected
              showCardForm();
            } else {
              // No text selected, show appropriate message or login form
              if (state.isLoggedIn) {
                // User is logged in but no text selected
                showNoSelectionMessage();
              } else {
                // User is not logged in
                showLoginForm();
              }
            }
          },
        );
      }
    });
  });
  
  // Function to check if user is logged in
  function checkLoginStatus() {
    // TODO: Implement Google Auth token verification
    // This function will be updated to check for a valid Google Auth token
    // and set the isLoggedIn state accordingly
  
    // Placeholder for Google Auth implementation:
    // 1. Check if auth token exists in chrome.storage
    // 2. Verify token validity
    // 3. Set isLoggedIn state based on token validity
  
    // For now, we'll assume the user is not logged in
    state.isLoggedIn = false;
  
    // Return the login status for use in other functions
    return state.isLoggedIn;
  }
  
  // Function to show the card form
  function showCardForm() {
    noSelectionMessage.classList.add("hidden");
    loginSection.classList.add("hidden");
    cardForm.classList.remove("hidden");
  }
  
  // Function to show the "no selection" message
  function showNoSelectionMessage() {
    noSelectionMessage.classList.remove("hidden");
    loginSection.classList.add("hidden");
    cardForm.classList.add("hidden");
  }
  
  // Function to show the login form
  function showLoginForm() {
    noSelectionMessage.classList.add("hidden");
    loginSection.classList.remove("hidden");
    cardForm.classList.add("hidden");
  }
  
  // Event Listeners
  cardNameInput.addEventListener("input", (event) => {
    state.cardName = event.target.value;
  });
  
  cardDescriptionInput.addEventListener("input", (event) => {
    state.cardDescription = event.target.value;
  });
  
  cardHintInput.addEventListener("input", (event) => {
    state.cardHint = event.target.value;
  });
  
  saveButton.addEventListener("click", () => {
    if (!state.cardName || !state.cardDescription) {
      alert("Please fill in the card front and back sides");
      return;
    }
  
    if (!state.isLoggedIn) {
      // Show login section if not logged in
      showLoginForm();
    } else {
      // User is logged in, save the card directly
      saveCard();
    }
  });
  
  closeButton.addEventListener("click", () => {
    // Close the popup
    window.close();
  });
  
  usernameInput.addEventListener("input", (event) => {
    state.username = event.target.value;
  });
  
  passwordInput.addEventListener("input", (event) => {
    state.password = event.target.value;
  });
  
  repeatPasswordInput.addEventListener("input", (event) => {
    state.repeatPassword = event.target.value;
  });
  
  signInButton.addEventListener("click", () => {
    if (!state.username || !state.password) {
      alert("Please enter your username and password");
      return;
    }
  
    if (state.isSignUpMode) {
      // Additional validation for sign up
      if (state.password !== state.repeatPassword) {
        alert("Passwords do not match");
        return;
      }
  
      // TODO: Implement Google Auth sign up
      // This section will be updated to use Google Auth for account creation
      console.log("Signing up:", {
        user: state.username,
      });
  
      // Placeholder for Google Auth sign up implementation:
      // 1. Call Google Auth API to create account
      // 2. Store auth token in chrome.storage
      // 3. Handle success/failure responses
  
      // Temporary success message
      alert("Account created successfully!");
  
      // Set logged in state (will be set based on Google Auth response in the future)
      state.isLoggedIn = true;
  
      // If there's selected text, show the card form
      if (state.selectedText) {
        showCardForm();
      } else {
        showNoSelectionMessage();
      }
    } else {
      // TODO: Implement Google Auth sign in
      // This section will be updated to use Google Auth for authentication
      console.log("Signing in:", {
        user: state.username,
      });
  
      // Placeholder for Google Auth sign in implementation:
      // 1. Call Google Auth API to authenticate
      // 2. Store auth token in chrome.storage
      // 3. Handle success/failure responses
  
      // Temporary success message
      alert("Signed in successfully!");
  
      // Set logged in state (will be set based on Google Auth response in the future)
      state.isLoggedIn = true;
  
      // If there's selected text, show the card form
      if (state.selectedText) {
        showCardForm();
      } else {
        showNoSelectionMessage();
      }
    }
  });
  
  // Toggle between sign in and sign up modes
  signupLink.addEventListener("click", (event) => {
    event.preventDefault();
  
    state.isSignUpMode = !state.isSignUpMode;
  
    if (state.isSignUpMode) {
      // Switch to sign up mode
      repeatPasswordGroup.classList.remove("hidden");
      signInButton.textContent = "Sign Up";
      signupLink.textContent = "Sign In";
    } else {
      // Switch to sign in mode
      repeatPasswordGroup.classList.add("hidden");
      signInButton.textContent = "Sign In";
      signupLink.textContent = "Sign Up";
    }
  });
  
  // Function to save the card
  function saveCard() {
    // Check if user is authenticated before saving
    if (!checkLoginStatus()) {
      // User is not logged in, show login form
      showLoginForm();
      return;
    }
  
    console.log("Saving card:", {
      name: state.cardName,
      description: state.cardDescription,
      hint: state.cardHint,
    });
  
    // TODO: Implement card saving with Google Auth token
    // This section will be updated to include the auth token with the request
    // to authenticate the user on the server
  
    // Placeholder for authenticated card saving:
    // 1. Get auth token from chrome.storage
    // 2. Include token in request to backend
    // 3. Handle success/failure responses
  
    // Temporary success message
    alert("Card saved successfully!");
  
    // Close the popup after successful save
    setTimeout(() => {
      window.close();
    }, 1500);
  }
  