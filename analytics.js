// Google Analytics (GA4) for Iron Games. Every page loads this file.
// Set GA_MEASUREMENT_ID to the Measurement ID from analytics.google.com
// (Admin > Data streams > your web stream). It looks like G-XXXXXXXXXX.
window.GA_MEASUREMENT_ID = 'G-92R7H8KF4R';

(function(){
  var id = window.GA_MEASUREMENT_ID;
  // Do nothing until a real ID is set, and never track local file:// previews.
  if (!id || /XXXX/.test(id) || location.protocol === 'file:') return;
  var optedOut = false;
  try { optedOut = localStorage.getItem('iron_games_analytics_opt_out') === '1'; } catch (e) {}
  window['ga-disable-' + id] = optedOut;
  if (optedOut) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  // Iron Games does not use advertising or remarketing. Keep those storage and
  // personalization signals disabled while retaining basic internal analytics.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  gtag('set', 'allow_google_signals', false);
  gtag('set', 'allow_ad_personalization_signals', false);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
})();

// trackEvent('game_start', {game: 'Ironcraft'}) from any page; a no-op when analytics is off.
window.trackEvent = function(name, params){
  if (!window.gtag) return;
  try { window.gtag('event', name, params || {}); } catch (e) {}
};

// Used by the privacy page so a family can disable analytics in this browser.
window.setIronGamesAnalytics = function(enabled){
  var id = window.GA_MEASUREMENT_ID;
  try {
    if (enabled) localStorage.removeItem('iron_games_analytics_opt_out');
    else localStorage.setItem('iron_games_analytics_opt_out', '1');
  } catch (e) {}
  if (id) window['ga-disable-' + id] = !enabled;
};
