/* Cookie consent and Google Analytics 4 preparation.
   Nothing here does anything until a Measurement ID is put in /site-config.js (or GA_MEASUREMENT_ID is set at build time).
   Without an ID: no banner, no analytics script, no cookies. With an ID: Google Consent Mode (Basic) with everything denied by default,
   the analytics script loads only after "Accept all" or a saved Analytics choice, and only the events below are ever sent. */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {}, ID = String(C.gaMeasurementId || '').trim(), ON = /^G-[A-Z0-9]{6,}$/i.test(ID), KEY = 'keshcut_consent_v1';
  var EVENTS = { page_view: 1, whatsapp_booking_click: 1, whatsapp_question_click: 1, view_service: 1, view_product: 1 };
  var PARAMS = { link_location: 1, service_name: 1, product_name: 1, page_title: 1, page_location: 1 };
  var state = null, loaded = false, banner = null, prefs = null;
  window.track = function () {};
  if (!ON) return;

  function read() { try { var v = JSON.parse(localStorage.getItem(KEY)); return v && typeof v.analytics === 'boolean' ? v : null; } catch (e) { return null; } }
  function save(a) { state = { analytics: a, ts: Date.now() }; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} apply(); }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  function loadGA() {
    if (loaded) return; loaded = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID); document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    gtag('event', 'page_view', { page_title: document.title, page_location: location.origin + location.pathname });
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim(); if (!/^_ga/.test(n)) return;
      var parts = location.hostname.split('.'), hosts = ['', location.hostname]; for (var i = 1; i < parts.length - 1; i++) hosts.push('.' + parts.slice(i).join('.'));
      hosts.forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : ''); });
    });
  }
  function apply() {
    if (state && state.analytics) { window['ga-disable-' + ID] = false; gtag('consent', 'update', { analytics_storage: 'granted' }); loadGA(); }
    else { window['ga-disable-' + ID] = true; gtag('consent', 'update', { analytics_storage: 'denied' }); if (loaded) clearCookies(); }
  }
  /* only whitelisted events and parameters can leave the page; values are short plain text */
  window.track = function (name, p) {
    if (!(state && state.analytics && loaded) || !EVENTS[name]) return;
    var q = {}; for (var k in (p || {})) if (PARAMS[k] && typeof p[k] === 'string') q[k] = p[k].slice(0, 100);
    gtag('event', name, q);
  };

  function dlg(id, html) {
    var d = document.createElement('dialog'); d.id = id; d.className = 'lg'; d.setAttribute('aria-labelledby', id + '-t'); d.innerHTML = '<div class="lg-card">' + html + '</div>';
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); document.body.appendChild(d); return d;
  }
  function openPrefs() {
    if (!prefs) {
      prefs = dlg('prefs', '<div class="lg-head"><h2 id="prefs-t">Cookie settings</h2><button type="button" class="lg-x" aria-label="Close">&times;</button></div><div class="lg-body">' +
        '<label class="pref"><input type="checkbox" checked disabled><div><b>Essential</b><span>Always on. Remembers this choice in your browser. No tracking.</span></div></label>' +
        '<label class="pref"><input type="checkbox" id="pa"><div><b>Analytics</b><span>Google Analytics 4 counts visits and clicks on WhatsApp buttons. It never receives your name, phone number, messages or booking details. Off unless you turn it on. <a href="#cookies">Cookie policy</a></span></div></label>' +
        '<button type="button" class="btn" id="ps">Save preferences</button></div>');
      prefs.querySelector('.lg-x').onclick = function () { prefs.close(); };
      prefs.querySelector('#ps').onclick = function () { save(prefs.querySelector('#pa').checked); closeBanner(); prefs.close(); };
      prefs.addEventListener('click', function (e) { var a = e.target.closest('a[href^="#"]'); if (a) prefs.close(); });
    }
    prefs.querySelector('#pa').checked = !!(state && state.analytics); prefs.showModal ? prefs.showModal() : prefs.setAttribute('open', '');
  }
  function closeBanner() { if (banner) { banner.remove(); banner = null; } }
  function showBanner() {
    banner = document.createElement('div'); banner.id = 'cc'; banner.setAttribute('role', 'region'); banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = '<p><strong>Cookies and analytics.</strong> Essential storage is always on. Analytics stays off unless you accept. <a href="#cookies">Cookie policy</a></p>' +
      '<div class="cc-b"><button type="button" class="btn" data-a="all">Accept all</button><button type="button" class="btn" data-a="none">Reject optional</button><button type="button" class="btn ghost" data-a="custom">Customize</button></div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return; var a = b.dataset.a;
      if (a === 'custom') openPrefs(); else { save(a === 'all'); closeBanner(); }
    });
    document.body.appendChild(banner);
  }

  state = read(); apply();
  if (!state) showBanner();
  var btn = document.getElementById('cookie-settings'); if (btn) { btn.hidden = false; btn.onclick = openPrefs; }
})();
