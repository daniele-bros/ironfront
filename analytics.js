// Google Analytics (GA4) for Iron Games. Every page loads this file.
// Set GA_MEASUREMENT_ID to the Measurement ID from analytics.google.com
// (Admin > Data streams > your web stream). It looks like G-XXXXXXXXXX.
window.GA_MEASUREMENT_ID = 'G-92R7H8KF4R';

(function(){
  var id = window.GA_MEASUREMENT_ID;
  // Do nothing until a real ID is set, and never track local file:// previews.
  if (!id || /XXXX/.test(id) || location.protocol === 'file:') return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', id);
})();

// trackEvent('game_start', {game: 'Ironcraft'}) from any page; a no-op when analytics is off.
window.trackEvent = function(name, params){
  if (!window.gtag) return;
  try { window.gtag('event', name, params || {}); } catch (e) {}
};
