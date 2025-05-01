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
    
      console.log(selectedText)
    
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
    <svg width="235" height="76" viewBox="0 0 235 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M78.456 23.68H89.208V27.84H78.456V23.68ZM78.84 36H73.656V13.6H90.584V17.76H78.84V36ZM93.7415 36V12.256H98.7335V36H93.7415ZM113.927 36V32.64L113.607 31.904V25.888C113.607 24.8213 113.276 23.9893 112.615 23.392C111.975 22.7947 110.983 22.496 109.639 22.496C108.721 22.496 107.815 22.6453 106.919 22.944C106.044 23.2213 105.297 23.6053 104.679 24.096L102.887 20.608C103.825 19.9467 104.956 19.4347 106.279 19.072C107.601 18.7093 108.945 18.528 110.311 18.528C112.935 18.528 114.972 19.1467 116.423 20.384C117.873 21.6213 118.599 23.552 118.599 26.176V36H113.927ZM108.679 36.256C107.335 36.256 106.183 36.032 105.223 35.584C104.263 35.1147 103.527 34.4853 103.015 33.696C102.503 32.9067 102.247 32.0213 102.247 31.04C102.247 30.016 102.492 29.12 102.983 28.352C103.495 27.584 104.295 26.9867 105.383 26.56C106.471 26.112 107.889 25.888 109.639 25.888H114.215V28.8H110.183C109.009 28.8 108.199 28.992 107.751 29.376C107.324 29.76 107.111 30.24 107.111 30.816C107.111 31.456 107.356 31.968 107.847 32.352C108.359 32.7147 109.052 32.896 109.927 32.896C110.759 32.896 111.505 32.704 112.167 32.32C112.828 31.9147 113.308 31.328 113.607 30.56L114.375 32.864C114.012 33.9733 113.351 34.816 112.391 35.392C111.431 35.968 110.193 36.256 108.679 36.256ZM128.909 36.256C127.437 36.256 126.018 36.0853 124.653 35.744C123.309 35.3813 122.242 34.9333 121.453 34.4L123.117 30.816C123.906 31.3067 124.834 31.712 125.901 32.032C126.989 32.3307 128.055 32.48 129.101 32.48C130.253 32.48 131.063 32.3413 131.533 32.064C132.023 31.7867 132.269 31.4027 132.269 30.912C132.269 30.5067 132.077 30.208 131.693 30.016C131.33 29.8027 130.839 29.6427 130.22 29.536C129.602 29.4293 128.919 29.3227 128.173 29.216C127.447 29.1093 126.711 28.9707 125.965 28.8C125.218 28.608 124.535 28.3307 123.917 27.968C123.298 27.6053 122.797 27.1147 122.413 26.496C122.05 25.8773 121.868 25.0773 121.868 24.096C121.868 23.008 122.178 22.048 122.797 21.216C123.437 20.384 124.354 19.7333 125.549 19.264C126.743 18.7733 128.173 18.528 129.837 18.528C131.01 18.528 132.205 18.656 133.421 18.912C134.637 19.168 135.65 19.5413 136.461 20.032L134.797 23.584C133.965 23.0933 133.122 22.7627 132.269 22.592C131.437 22.4 130.626 22.304 129.837 22.304C128.727 22.304 127.917 22.4533 127.405 22.752C126.893 23.0507 126.637 23.4347 126.637 23.904C126.637 24.3307 126.818 24.6507 127.181 24.864C127.565 25.0773 128.066 25.248 128.685 25.376C129.303 25.504 129.975 25.6213 130.701 25.728C131.447 25.8133 132.194 25.952 132.941 26.144C133.687 26.336 134.359 26.6133 134.957 26.976C135.575 27.3173 136.077 27.7973 136.461 28.416C136.845 29.0133 137.037 29.8027 137.037 30.784C137.037 31.8507 136.717 32.8 136.077 33.632C135.437 34.4427 134.509 35.0827 133.293 35.552C132.098 36.0213 130.637 36.256 128.909 36.256ZM150.581 18.528C151.946 18.528 153.162 18.8053 154.229 19.36C155.317 19.8933 156.17 20.7253 156.789 21.856C157.407 22.9653 157.717 24.3947 157.717 26.144V36H152.725V26.912C152.725 25.5253 152.415 24.5013 151.797 23.84C151.199 23.1787 150.346 22.848 149.237 22.848C148.447 22.848 147.733 23.0187 147.093 23.36C146.474 23.68 145.983 24.1813 145.621 24.864C145.279 25.5467 145.109 26.4213 145.109 27.488V36H140.117V12.256H145.109V23.552L143.989 22.112C144.607 20.96 145.493 20.0747 146.645 19.456C147.797 18.8373 149.109 18.528 150.581 18.528ZM170.687 36.256C168.831 36.256 167.177 35.8827 165.727 35.136C164.276 34.368 163.135 33.312 162.303 31.968C161.492 30.624 161.087 29.0987 161.087 27.392C161.087 25.664 161.492 24.1387 162.303 22.816C163.135 21.472 164.276 20.4267 165.727 19.68C167.177 18.912 168.831 18.528 170.687 18.528C172.5 18.528 174.079 18.912 175.423 19.68C176.767 20.4267 177.759 21.504 178.399 22.912L174.527 24.992C174.079 24.1813 173.513 23.584 172.831 23.2C172.169 22.816 171.444 22.624 170.655 22.624C169.801 22.624 169.033 22.816 168.351 23.2C167.668 23.584 167.124 24.128 166.719 24.832C166.335 25.536 166.143 26.3893 166.143 27.392C166.143 28.3947 166.335 29.248 166.719 29.952C167.124 30.656 167.668 31.2 168.351 31.584C169.033 31.968 169.801 32.16 170.655 32.16C171.444 32.16 172.169 31.9787 172.831 31.616C173.513 31.232 174.079 30.624 174.527 29.792L178.399 31.904C177.759 33.2907 176.767 34.368 175.423 35.136C174.079 35.8827 172.5 36.256 170.687 36.256ZM191.833 36V32.64L191.513 31.904V25.888C191.513 24.8213 191.182 23.9893 190.521 23.392C189.881 22.7947 188.889 22.496 187.545 22.496C186.627 22.496 185.721 22.6453 184.825 22.944C183.95 23.2213 183.203 23.6053 182.585 24.096L180.793 20.608C181.731 19.9467 182.862 19.4347 184.185 19.072C185.507 18.7093 186.851 18.528 188.217 18.528C190.841 18.528 192.878 19.1467 194.329 20.384C195.779 21.6213 196.505 23.552 196.505 26.176V36H191.833ZM186.585 36.256C185.241 36.256 184.089 36.032 183.129 35.584C182.169 35.1147 181.433 34.4853 180.921 33.696C180.409 32.9067 180.153 32.0213 180.153 31.04C180.153 30.016 180.398 29.12 180.889 28.352C181.401 27.584 182.201 26.9867 183.289 26.56C184.377 26.112 185.795 25.888 187.545 25.888H192.121V28.8H188.089C186.915 28.8 186.105 28.992 185.657 29.376C185.23 29.76 185.017 30.24 185.017 30.816C185.017 31.456 185.262 31.968 185.753 32.352C186.265 32.7147 186.958 32.896 187.833 32.896C188.665 32.896 189.411 32.704 190.073 32.32C190.734 31.9147 191.214 31.328 191.513 30.56L192.281 32.864C191.918 33.9733 191.257 34.816 190.297 35.392C189.337 35.968 188.099 36.256 186.585 36.256ZM201.023 36V18.784H205.791V23.648L205.119 22.24C205.631 21.024 206.452 20.1067 207.583 19.488C208.713 18.848 210.089 18.528 211.711 18.528V23.136C211.497 23.1147 211.305 23.104 211.135 23.104C210.964 23.0827 210.783 23.072 210.591 23.072C209.225 23.072 208.116 23.4667 207.263 24.256C206.431 25.024 206.015 26.2293 206.015 27.872V36H201.023ZM221.946 36.256C220.325 36.256 218.863 35.8933 217.562 35.168C216.261 34.4213 215.226 33.3867 214.458 32.064C213.711 30.7413 213.338 29.184 213.338 27.392C213.338 25.5787 213.711 24.0107 214.458 22.688C215.226 21.3653 216.261 20.3413 217.562 19.616C218.863 18.8907 220.325 18.528 221.946 18.528C223.397 18.528 224.666 18.848 225.754 19.488C226.842 20.128 227.685 21.0987 228.282 22.4C228.879 23.7013 229.178 25.3653 229.178 27.392C229.178 29.3973 228.89 31.0613 228.314 32.384C227.738 33.6853 226.906 34.656 225.818 35.296C224.751 35.936 223.461 36.256 221.946 36.256ZM222.81 32.16C223.621 32.16 224.357 31.968 225.018 31.584C225.679 31.2 226.202 30.656 226.586 29.952C226.991 29.2267 227.194 28.3733 227.194 27.392C227.194 26.3893 226.991 25.536 226.586 24.832C226.202 24.128 225.679 23.584 225.018 23.2C224.357 22.816 223.621 22.624 222.81 22.624C221.978 22.624 221.231 22.816 220.57 23.2C219.909 23.584 219.375 24.128 218.97 24.832C218.586 25.536 218.394 26.3893 218.394 27.392C218.394 28.3733 218.586 29.2267 218.97 29.952C219.375 30.656 219.909 31.2 220.57 31.584C221.231 31.968 221.978 32.16 222.81 32.16ZM227.322 36V32.48L227.418 27.36L227.098 22.272V12.256H232.09V36H227.322Z" fill="#2F2F2F"/>
<path d="M73.656 64V41.6H78.84V59.776H90.072V64H73.656ZM101.067 64.256C99.1041 64.256 97.3761 63.872 95.8828 63.104C94.4108 62.336 93.2694 61.2907 92.4588 59.968C91.6481 58.624 91.2428 57.0987 91.2428 55.392C91.2428 53.664 91.6374 52.1387 92.4268 50.816C93.2374 49.472 94.3361 48.4267 95.7228 47.68C97.1094 46.912 98.6774 46.528 100.427 46.528C102.112 46.528 103.627 46.8907 104.971 47.616C106.336 48.32 107.413 49.344 108.203 50.688C108.992 52.0107 109.387 53.6 109.387 55.456C109.387 55.648 109.376 55.872 109.355 56.128C109.333 56.3627 109.312 56.5867 109.291 56.8H95.3068V53.888H106.667L104.747 54.752C104.747 53.856 104.565 53.0773 104.203 52.416C103.84 51.7547 103.339 51.2427 102.699 50.88C102.059 50.496 101.312 50.304 100.459 50.304C99.6054 50.304 98.8481 50.496 98.1868 50.88C97.5468 51.2427 97.0454 51.7653 96.6828 52.448C96.3201 53.1093 96.1388 53.8987 96.1388 54.816V55.584C96.1388 56.5227 96.3414 57.3547 96.7468 58.08C97.1734 58.784 97.7601 59.328 98.5068 59.712C99.2748 60.0747 100.171 60.256 101.195 60.256C102.112 60.256 102.912 60.1173 103.595 59.84C104.299 59.5627 104.939 59.1467 105.515 58.592L108.171 61.472C107.381 62.368 106.389 63.0613 105.195 63.552C104 64.0213 102.624 64.256 101.067 64.256ZM122.802 64V60.64L122.482 59.904V53.888C122.482 52.8213 122.151 51.9893 121.49 51.392C120.85 50.7947 119.858 50.496 118.514 50.496C117.596 50.496 116.69 50.6453 115.794 50.944C114.919 51.2213 114.172 51.6053 113.554 52.096L111.762 48.608C112.7 47.9467 113.831 47.4347 115.154 47.072C116.476 46.7093 117.82 46.528 119.186 46.528C121.81 46.528 123.847 47.1467 125.298 48.384C126.748 49.6213 127.474 51.552 127.474 54.176V64H122.802ZM117.554 64.256C116.21 64.256 115.058 64.032 114.098 63.584C113.138 63.1147 112.402 62.4853 111.89 61.696C111.378 60.9067 111.122 60.0213 111.122 59.04C111.122 58.016 111.367 57.12 111.858 56.352C112.37 55.584 113.17 54.9867 114.258 54.56C115.346 54.112 116.764 53.888 118.514 53.888H123.09V56.8H119.058C117.884 56.8 117.074 56.992 116.626 57.376C116.199 57.76 115.986 58.24 115.986 58.816C115.986 59.456 116.231 59.968 116.722 60.352C117.234 60.7147 117.927 60.896 118.802 60.896C119.634 60.896 120.38 60.704 121.042 60.32C121.703 59.9147 122.183 59.328 122.482 58.56L123.25 60.864C122.887 61.9733 122.226 62.816 121.266 63.392C120.306 63.968 119.068 64.256 117.554 64.256ZM131.992 64V46.784H136.76V51.648L136.088 50.24C136.6 49.024 137.421 48.1067 138.552 47.488C139.682 46.848 141.058 46.528 142.68 46.528V51.136C142.466 51.1147 142.274 51.104 142.104 51.104C141.933 51.0827 141.752 51.072 141.56 51.072C140.194 51.072 139.085 51.4667 138.232 52.256C137.4 53.024 136.984 54.2293 136.984 55.872V64H131.992ZM156.143 46.528C157.508 46.528 158.724 46.8053 159.791 47.36C160.879 47.8933 161.732 48.7253 162.351 49.856C162.97 50.9653 163.279 52.3947 163.279 54.144V64H158.287V54.912C158.287 53.5253 157.978 52.5013 157.359 51.84C156.762 51.1787 155.908 50.848 154.799 50.848C154.01 50.848 153.295 51.0187 152.655 51.36C152.036 51.68 151.546 52.1813 151.183 52.864C150.842 53.5467 150.671 54.4213 150.671 55.488V64H145.679V46.784H150.447V51.552L149.551 50.112C150.17 48.96 151.055 48.0747 152.207 47.456C153.359 46.8373 154.671 46.528 156.143 46.528ZM176.473 64.256C174.51 64.256 172.782 63.872 171.289 63.104C169.817 62.336 168.676 61.2907 167.865 59.968C167.054 58.624 166.649 57.0987 166.649 55.392C166.649 53.664 167.044 52.1387 167.833 50.816C168.644 49.472 169.742 48.4267 171.129 47.68C172.516 46.912 174.084 46.528 175.833 46.528C177.518 46.528 179.033 46.8907 180.377 47.616C181.742 48.32 182.82 49.344 183.609 50.688C184.398 52.0107 184.793 53.6 184.793 55.456C184.793 55.648 184.782 55.872 184.761 56.128C184.74 56.3627 184.718 56.5867 184.697 56.8H170.713V53.888H182.073L180.153 54.752C180.153 53.856 179.972 53.0773 179.609 52.416C179.246 51.7547 178.745 51.2427 178.105 50.88C177.465 50.496 176.718 50.304 175.865 50.304C175.012 50.304 174.254 50.496 173.593 50.88C172.953 51.2427 172.452 51.7653 172.089 52.448C171.726 53.1093 171.545 53.8987 171.545 54.816V55.584C171.545 56.5227 171.748 57.3547 172.153 58.08C172.58 58.784 173.166 59.328 173.913 59.712C174.681 60.0747 175.577 60.256 176.601 60.256C177.518 60.256 178.318 60.1173 179.001 59.84C179.705 59.5627 180.345 59.1467 180.921 58.592L183.577 61.472C182.788 62.368 181.796 63.0613 180.601 63.552C179.406 64.0213 178.03 64.256 176.473 64.256ZM188.117 64V46.784H192.885V51.648L192.213 50.24C192.725 49.024 193.546 48.1067 194.677 47.488C195.807 46.848 197.183 46.528 198.805 46.528V51.136C198.591 51.1147 198.399 51.104 198.229 51.104C198.058 51.0827 197.877 51.072 197.685 51.072C196.319 51.072 195.21 51.4667 194.357 52.256C193.525 53.024 193.109 54.2293 193.109 55.872V64H188.117Z" fill="#2F2F2F"/>
<g clip-path="url(#clip0_20_15)">
<path d="M38 49.875V52.25C38 52.25 38 55.8125 41.5625 55.8125C45.125 55.8125 45.125 52.25 45.125 52.25V49.875M38 49.875C38 49.875 37.9992 48.6875 36.8121 47.5C35.625 46.3125 34.148 44.2588 33.3134 42.7984C32.4789 41.3379 32.0471 39.682 32.0621 38C32.0621 33.25 35.6246 28.5 41.5621 28.5C47.4996 28.5 51.0621 33.25 51.0621 38C51.0772 39.682 50.6454 41.3379 49.8108 42.7984C48.9763 44.2588 47.4992 46.3125 46.3121 47.5C45.125 48.6875 45.125 49.875 45.125 49.875M38 49.875H45.125" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.3125 20.1875H55.8125C58.4359 20.1875 60.5625 22.3141 60.5625 24.9375V58.1875C60.5625 60.8109 58.4359 62.9375 55.8125 62.9375H27.3125C24.6891 62.9375 22.5625 60.8109 22.5625 58.1875V24.9375C22.5625 22.3141 24.6891 20.1875 27.3125 20.1875Z" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.1875 55.8125C17.5641 55.8125 15.4375 53.6859 15.4375 51.0625V20.1875C15.4375 16.625 19 13.0625 22.5625 13.0625H48.6875C51.3109 13.0625 53.4375 15.1891 53.4375 17.8125" stroke="#4B4FBA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_20_15">
<rect width="76" height="76" fill="white"/>
</clipPath>
</defs>
</svg>

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

  function handleSelection() {
    const selection = window.getSelection();
    
    // Ensure we have a valid selection
    if (!selection || selection.rangeCount === 0) {
      hideIcon();
      lastSelection = null;
      return;
    }

    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      try {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        
        // Get the bounding rect that encompasses all selected elements
        let boundingRect = range.getBoundingClientRect();
        
        // If we have multiple client rects, calculate the overall bounding box
        if (rects.length > 1) {
          let top = Infinity;
          let left = Infinity;
          let right = -Infinity;
          let bottom = -Infinity;
          
          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            top = Math.min(top, rect.top);
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
            bottom = Math.max(bottom, rect.bottom);
          }
          
          boundingRect = {
            top,
            left,
            right,
            bottom,
            width: right - left,
            height: bottom - top
          };
        }

        // Store selection with full context
        lastSelection = {
          text: selectedText,
          rect: boundingRect,
          html: range.cloneContents().textContent, // Get clean text content
          range: {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset
          }
        };

        // Calculate icon position
        const iconWidth = 180;
        const iconHeight = 32;
        const margin = 10;
        
        // Position relative to viewport
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        
        // Calculate initial position (centered above selection)
        let left = Math.max(
          margin,
          Math.min(
            viewportWidth - iconWidth - margin,
            boundingRect.left + (boundingRect.width / 2) - (iconWidth / 2)
          )
        );
        
        let top = boundingRect.top - iconHeight - margin;
        
        // If icon would be off-screen at the top, place it below the selection
        if (top < margin) {
          top = boundingRect.bottom + margin;
        }

        // Show icon with animation
        icon.style.display = "flex";
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.9) translateY(10px)";
        icon.style.top = `${Math.max(margin, top)}px`;
        icon.style.left = `${left}px`;
        
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

        // Animate icon appearance
        requestAnimationFrame(() => {
          icon.style.opacity = "1";
          icon.style.transform = "scale(1) translateY(0)";
        });

      } catch (error) {
        console.error("Error processing selection:", error);
        hideIcon();
      }
    } else {
      hideIcon();
    }
  }

  function hideIcon() {
    if (icon.style.display !== "none") {
      icon.style.opacity = "0";
      icon.style.transform = "scale(0.9) translateY(10px)";
      setTimeout(() => {
        icon.style.display = "none";
      }, 200);
    }
    lastSelection = null;
  }

  // Debounce the selection handler to improve performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedHandleSelection = debounce(handleSelection, 150);

  // Event Listeners
  document.addEventListener("mouseup", debouncedHandleSelection, { passive: true });
  document.addEventListener("selectionchange", debouncedHandleSelection, { passive: true });
  document.addEventListener("keyup", debouncedHandleSelection, { passive: true });

  // Handle clicks outside the popup
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && e.target !== icon) {
      popup.style.display = "none";
    }
  }, { passive: true });

  // Prevent text selection when clicking the icon
  document.addEventListener("mousedown", (e) => {
    if (e.target === icon || icon.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Handle window resize
  window.addEventListener("resize", debounce(() => {
    if (lastSelection) {
      handleSelection();
    }
  }, 100), { passive: true });

  // Handle scroll events on any element
  document.addEventListener("scroll", debounce(() => {
    if (lastSelection) {
      handleSelection();
    }
  }, 100), { passive: true, capture: true });
}
