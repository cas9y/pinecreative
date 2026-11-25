/* PineCreative cookie consent popup
   Shows once after page load; remembers the visitor's choice in localStorage.
   Read the choice elsewhere with: localStorage.getItem('pc_cookie_consent')  // "accepted" | "rejected" | null */
(function () {
  /* ===== Target URLs — fill these in ===== */
  var ACCEPT_URL = '';   // where "Accept all" goes after saving the choice (blank = just close the popup)
  var REJECT_URL = '';   // where "Reject" goes after saving the choice (blank = just close the popup)
  var POLICY_URL = '';   // the "Privacy Policy" link in the popup text
  /* ======================================= */

  var KEY = 'pc_cookie_consent';
  try { if (localStorage.getItem(KEY)) return; } catch (e) { /* storage blocked: still show */ }

  var css = '' +
    '.cc-overlay{position:fixed;inset:0;background:rgba(15,46,37,.35);backdrop-filter:blur(2px);z-index:998;opacity:0;transition:opacity .35s ease}' +
    '.cc-overlay.show{opacity:1}' +
    '.cc-box{position:fixed;left:50%;top:50%;z-index:999;width:min(440px,calc(100% - 32px));text-align:center;' +
      'background:#fffdf8;color:#14211d;border-radius:20px;padding:28px;font-family:"Inter",system-ui,sans-serif;' +
      'box-shadow:0 30px 60px -20px rgba(15,46,37,.5);border:1px solid rgba(20,33,29,.08);' +
      'opacity:0;transform:translate(-50%,-50%) scale(.94);transition:opacity .35s ease,transform .35s ease}' +
    '.cc-box.show{opacity:1;transform:translate(-50%,-50%) scale(1)}' +
    '.cc-icon{width:52px;height:52px;border-radius:14px;background:#ffe3d4;color:#ff7a3d;display:grid;place-items:center;font-size:26px;margin:0 auto 14px}' +
    '.cc-box h3{font-family:"Fraunces",Georgia,serif;font-size:22px;letter-spacing:-.02em;margin:0 0 8px}' +
    '.cc-box p{font-size:14.5px;line-height:1.6;color:#5b6b65;margin:0 0 20px}' +
    '.cc-box p a{color:#ff7a3d;font-weight:600;text-decoration:none}' +
    '.cc-box p a:hover{text-decoration:underline}' +
    '.cc-actions{display:flex;gap:10px}' +
    '.cc-btn{flex:1;font:inherit;font-size:14.5px;font-weight:600;padding:12px 16px;border-radius:999px;cursor:pointer;transition:background .2s,color .2s,transform .2s}' +
    '.cc-btn:hover{transform:translateY(-1px)}' +
    '.cc-accept{background:#ff7a3d;color:#fff;border:1.5px solid #ff7a3d}' +
    '.cc-accept:hover{background:#ec6526;border-color:#ec6526}' +
    '.cc-reject{background:transparent;color:#0f2e25;border:1.5px solid #0f2e25}' +
    '.cc-reject:hover{background:#0f2e25;color:#f6f1e7}' +
    '@media (max-width:480px){.cc-box{padding:22px}}' +
    '@media (prefers-reduced-motion:reduce){.cc-box,.cc-overlay{transition:none}}';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.className = 'cc-overlay';

    var box = document.createElement('div');
    box.className = 'cc-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'cc-title');
    box.setAttribute('aria-describedby', 'cc-desc');
    box.innerHTML =
      '<div class="cc-icon" aria-hidden="true">🍪</div>' +
      '<h3 id="cc-title">We value your privacy</h3>' +
      '<p id="cc-desc">We use cookies to improve your experience, analyse site traffic and personalise content. ' +
      'You can accept or reject non-essential cookies. Read our <a class="cc-policy" href="' + POLICY_URL + '">Privacy Policy</a>.</p>' +
      '<div class="cc-actions">' +
        '<button type="button" class="cc-btn cc-reject">Reject</button>' +
        '<button type="button" class="cc-btn cc-accept">Accept all</button>' +
      '</div>';

    // No dimmed backdrop on the privacy page, so visitors can read the policy before choosing
    var onPrivacyPage = /privacy\.html$/i.test(location.pathname);
    if (!onPrivacyPage) document.body.appendChild(overlay);
    document.body.appendChild(box);

    requestAnimationFrame(function () {
      overlay.classList.add('show');
      box.classList.add('show');
      box.querySelector('.cc-accept').focus();
    });

    function choose(value, url) {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      document.dispatchEvent(new CustomEvent('cookieconsent', { detail: value }));
      if (url) { window.location.href = url; return; }
      overlay.classList.remove('show');
      box.classList.remove('show');
      setTimeout(function () { overlay.remove(); box.remove(); }, 400);
    }

    box.querySelector('.cc-accept').addEventListener('click', function () { choose('accepted', ACCEPT_URL); });
    box.querySelector('.cc-reject').addEventListener('click', function () { choose('rejected', REJECT_URL); });
    // While POLICY_URL is blank, clicking the link does nothing (instead of reloading the page)
    box.querySelector('.cc-policy').addEventListener('click', function (e) { if (!POLICY_URL) e.preventDefault(); });
  }

  // Show shortly after the page has finished loading
  function start() { setTimeout(build, 1200); }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
