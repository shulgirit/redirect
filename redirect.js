const DetectionMethod = {
    "ip-only" : "ip-only",
    "timezone-then-ip" : "timezone-then-ip",
  }

  var redirectIsrael = () => {
    // How it works:
    // (1) We detect your timezone to estimate if you're in Russia
    // (2) If we think you may be, we make an IP address geolocation API request to confirm
    // (3) If you are in indeed in Russia, we redirect you to a pro-Ukraine website
  
    var currentScript = document.currentScript;
    if (!currentScript) return;
  
    // Find the redirection URL
    // var REDIRECT_URL =
    //   currentScript.getAttribute("data-redirect-url") ??
    //   `https://redirectrussia.org/${
    //     currentScript.getAttribute("data-hide-domain") === "hide"
    //       ? "?from=unknown"
    //       : `?from=${document.domain}`
    //   }`;
    var REDIRECT_URL = 'https://seaofspa.com/he'
  
    var redirect = () => {
      // try {
      //   // Dispatch a custom event
      //   // To listen to this event, you can add the following JavaScript:
      //   // document.addEventListener("redirect-russia", (event) => { /* */ }, false);
      //   var event = new Event("redirect-russia");
      //   document.dispatchEvent(event);
  
      //   // Set in session storage so we don't have to compute again
      // } catch (error) {
      //   // Ignore errors in storage or events
      // }
      window.sessionStorage.setItem("israel-redirect", "1");

      window.location.assign(REDIRECT_URL);
    };
  
    // Cache redirection status in session storage to avoid expensive computation
    try {
      var shouldRedirect = window.sessionStorage.getItem("israel-redirect");
      // If we already computed to redirect you, do it immediately
      if (shouldRedirect === "1") return 
      // If we already skipped you, no need to redo the detection
      else if (shouldRedirect === "0") return;
    } catch (error) {
      // Ignore storage access errors
    }
  
    // Find the preferred method of location detection
    var detectionMethod =
      currentScript.getAttribute("data-detection") ??
      DetectionMethod["timezone-then-ip"];
  
    // If we find an unsupported method, throw an error
    if (
      detectionMethod !== DetectionMethod["ip-only"] &&
      detectionMethod !== DetectionMethod["timezone-then-ip"]
    )
      throw new Error("Redirect Russia: Unsupported location detection method");
  
    // By default, we assume that you're in Russia
    var mayBeRussian = true;

    // If the timezone-then-ip detection method is set
    if (detectionMethod === DetectionMethod["timezone-then-ip"]) {

      // Find the current timezone
      var currentTimezone= undefined;
      try {

        currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        // Ignore errors if `Intl` is unavailable or we're unable to find the timezone
      }

      if (
        // If we're unable to find the timezone, you may be in Russia
        
        // If you're in a Russian timezone, you may be in Russia
        currentTimezone
      )
        mayBeIsraeli = currentTimezone.includes("Jerusalem");
    }
  
    if (!mayBeIsraeli) return;

    var geolocationEndpoint =
      currentScript.getAttribute("data-geolocation-api") ??
      "https://api.country.is";

    var countryCode = undefined; // Uppercase country code, e.g., "UA" or "DE"
    // Make IP geolocation request
    fetch(geolocationEndpoint)
      .then((response) => {
        if (!response.ok) throw new Error("Response not OK");
        return response.json();
      })
      .then((json) => {
        countryCode = json.country.toLowerCase();

      })

      // Ignore errors if we're unable to fetch
      .catch(() => undefined)
      .then(() => {
        if (countryCode === "il") return redirect();
  
        try {
          // Set in session storage so we don't have to compute again
          window.sessionStorage.setItem("israel-redirect", "0");
        } catch (error) {
          // Ignore storage access errors
        }
      });
  };
  
  void redirectIsrael();