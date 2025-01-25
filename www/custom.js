// Access Capacitor and its plugins from the global window object
const { Capacitor } = window;

// Safely destructure plugins if they exist
const { Plugins } = Capacitor || {};
const { SplashScreen, App, InAppBrowser } = Plugins || {};

// Flag to prevent multiple browser instances
let isBrowserOpen = false;

// Show splash on startup
document.addEventListener('DOMContentLoaded', async () => {
  if (SplashScreen) {
    console.log('App started, showing SplashScreen...');
    try {
      await SplashScreen.show({ autoHide: false });
    } catch (error) {
      console.error('Error showing SplashScreen:', error);
    }
  }

  // Set up the "Open InAppBrowser" button
  const openBrowserBtn = document.getElementById('openBrowserBtn');
  if (openBrowserBtn) {
    openBrowserBtn.addEventListener('click', async () => {
      if (isBrowserOpen) {
        console.log('InAppBrowser is already open.');
        return;
      }

      console.log('Open InAppBrowser button clicked.');
      isBrowserOpen = true;

      // Check if Capacitor and the isNativePlatform method exist
      const isNative =
        Capacitor &&
        typeof Capacitor.isNativePlatform === 'function' &&
        Capacitor.isNativePlatform();

      if (isNative && InAppBrowser) {
        console.log('Native platform detected, preparing InAppBrowser...');
        try {
          InAppBrowser.addListener('browserPageLoaded', async () => {
            console.log('Browser page loaded, injecting button...');

            // Remove listener after injection to prevent multiple injections
            InAppBrowser.removeAllListeners('browserPageLoaded');

            try {
              await InAppBrowser.executeScript({
                code: `
                  (function() {
                    if (!document.getElementById('deepLinkTestButton')) {
                      var button = document.createElement('button');
                      button.id = 'deepLinkTestButton';
                      button.innerText = 'Open Deep Link';
                      button.style.position = 'fixed';
                      button.style.bottom = '20px';
                      button.style.left = '50%';
                      button.style.transform = 'translateX(-50%)';
                      button.style.zIndex = '1000';
                      button.style.padding = '10px 20px';
                      button.style.backgroundColor = '#007bff';
                      button.style.color = '#fff';
                      button.style.border = 'none';
                      button.style.borderRadius = '4px';
                      button.style.fontSize = '16px';
                      button.style.boxShadow = '0 5px 10px rgba(0,0,0,0.3)';
                      button.onclick = function() {
                        var currentUrl = window.location.href;
                        window.location.href = 'myapp://test_deep_link?url=' + encodeURIComponent(currentUrl);
                      };
                      document.body.appendChild(button);
                    }
                  })();
                `,
              });
              console.log('Button injected successfully.');
            } catch (scriptError) {
              console.error('Error injecting script:', scriptError);
            }
          });

          await InAppBrowser.openWebView({
            url: 'https://google.com',
            toolbarColor: '#628d1a',
            title: 'Test Browser',
            activeNativeNavigationForWebview: true,
            toolbarType: 'navigation',
            backgroundColor: 'black',
          });
          console.log('InAppBrowser opened successfully.');
        } catch (error) {
          console.error('Error opening InAppBrowser:', error);
          isBrowserOpen = false;
        }
      } else {
        // Fallback for web or if InAppBrowser plugin isn't available
        console.log('Not a native platform or InAppBrowser plugin not available, opening new window...');
        window.open('https://google.com', '_blank');
        isBrowserOpen = false;
      }
    });
  }
});

// Hide splash when minimized
if (App && SplashScreen) {
  App.addListener('appStateChange', (state) => {
    if (!state.isActive) {
      console.log('App minimized, hiding SplashScreen...');
      SplashScreen.hide();
    }
  });
}

// Listen for deep link events
if (App) {
  App.addListener('appUrlOpen', async (data) => {
    console.log('App opened with URL:', data.url);
    // Parse and handle the URL as needed
    // Example: Navigate to a specific page or perform an action

    // Close the InAppBrowser if it's open
    if (isBrowserOpen && typeof InAppBrowser.close === 'function') {
      try {
        await InAppBrowser.close();
        console.log('InAppBrowser closed after deep link.');
      } catch (closeError) {
        console.error('Error closing InAppBrowser:', closeError);
      }
      isBrowserOpen = false;
    }

    // Log the success message
    console.log('Deep link was successful.');
  });
}