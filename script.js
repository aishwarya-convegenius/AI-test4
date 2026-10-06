/* ==========================================================================
   Swift AI Academy — slide engine
   Shared by every activity (build.sh puts it at the top of each script.js).
   - Shows one slide at a time; the page itself never scrolls.
   - Scales each slide (through the root font size) until it fits the screen.
   - Owns the footer: progress dashes, Back, and the one amber primary button.
   Activity code talks to it through the global `Deck` object.
   ========================================================================== */
(function (window, document) {
  'use strict';

  var ICONS = {
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    open: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    stop: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
    mega: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    split: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.2-2.9L3 3"/><path d="m15 9 6-6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    tagi: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 1-1h11l-2 4 2 4H5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    'check-sq': '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    sort: '<path d="M3 6h18M6 12h12M10 18h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3.3L14 9V3"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'
  };

  function ic(name) {
    return '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + (ICONS[name] || '') + '</svg></span>';
  }

  // Turn every <span data-i="name"></span> into an inline icon.
  function hydrate(root) {
    var els = (root || document).querySelectorAll('[data-i]:not([data-ready])');
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      el.classList.add('ic');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-ready', '');
      el.innerHTML = '<svg viewBox="0 0 24 24">' + (ICONS[el.getAttribute('data-i')] || '') + '</svg>';
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = ic('check') + '<span>' + esc(msg) + '</span>';
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  // Copy text, with a fallback for browsers without the Clipboard API.
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
      document.body.removeChild(ta);
      if (done) done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { if (done) done(); }, fallback);
    } else {
      fallback();
    }
  }

  // Nothing is saved or sent anywhere, so learners keep their work as a file.
  function download(filename, text) {
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var Deck = {
    slides: [],
    index: -1,
    hooks: {},

    init: function (hooks) {
      var self = this;
      this.hooks = hooks || {};
      this.app = document.querySelector('.app');
      this.slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
      this.primaryBtn = document.getElementById('primary');
      this.backBtn = document.getElementById('back');
      this.progress = document.getElementById('progress');
      this.lastWidth = window.innerWidth;
      this.slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
      hydrate(document);

      this.primaryBtn.addEventListener('click', function () { self.primary(); });
      this.backBtn.addEventListener('click', function () { self.back(); });
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest('[data-go]') : null;
        if (t) self.go(t.getAttribute('data-go'));
      });
      window.addEventListener('resize', debounce(function () { self.onResize(); }, 120));
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { self.fit(); });
      }
      this.go(0, true);
    },

    find: function (target) {
      if (typeof target === 'number') return target;
      for (var k = 0; k < this.slides.length; k++) {
        if (this.slides[k].id === target) return k;
      }
      return -1;
    },

    current: function () { return this.slides[this.index]; },

    hook: function () {
      var s = this.current();
      return s ? this.hooks[s.id] : null;
    },

    go: function (target, first) {
      var i = this.find(target);
      if (i < 0 || i >= this.slides.length) return;
      var prev = this.current();
      var prevHook = this.hook();
      if (prev && prevHook && prevHook.leave) prevHook.leave(this, prev);
      if (prev) {
        prev.classList.remove('show');
        prev.setAttribute('aria-hidden', 'true');
      }

      this.index = i;
      var s = this.current();
      this.setPrimary(s.getAttribute('data-next') || 'Continue', {
        hidden: s.getAttribute('data-primary') === 'off',
        icon: s.getAttribute('data-icon') || 'arrow-right'
      });
      this.setBack(i > 0 && s.getAttribute('data-back') !== 'off');
      this.drawDashes();

      var h = this.hook();
      if (h && h.enter) h.enter(this, s);
      hydrate(s);
      this.fit();
      s.classList.add('show');
      s.removeAttribute('aria-hidden');

      if (!first) {
        var head = s.querySelector('h1, h2');
        if (head) {
          head.setAttribute('tabindex', '-1');
          // the layer frees the new screen for focus a moment later: focus its heading then
          var focusHead = function () { if (Deck.current() === s) { try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); } } };
          focusHead(); setTimeout(focusHead, 120);
        }
      }
    },

    next: function () { this.go(this.index + 1); },

    back: function () {
      var h = this.hook();
      if (h && h.back && h.back(this) === false) return;
      var to = this.current().getAttribute('data-back-to');
      this.go(to ? this.find(to) : this.index - 1);
    },

    primary: function () {
      if (this.primaryBtn.disabled || this.primaryBtn.hidden) return;
      var h = this.hook();
      if (h && h.primary && h.primary(this) === false) return;
      this.next();
    },

    setPrimary: function (label, opts) {
      opts = opts || {};
      var b = this.primaryBtn;
      var iconName = opts.icon === undefined ? 'arrow-right' : opts.icon;
      b.hidden = !!opts.hidden;
      b.disabled = !!opts.disabled;
      b.innerHTML = '<span>' + esc(label) + '</span>' + (iconName ? ic(iconName) : '');
    },

    enablePrimary: function (on) { this.primaryBtn.disabled = !on; },

    setBack: function (show) { this.backBtn.hidden = !show; },

    drawDashes: function () {
      var html = '<div class="dashes" aria-hidden="true">';
      for (var k = 0; k < this.slides.length; k++) {
        html += '<i class="' + (k < this.index ? 'done' : (k === this.index ? 'cur' : '')) + '"></i>';
      }
      html += '</div><span class="count">' + (this.index + 1) + ' / ' + this.slides.length + '</span>';
      this.progress.innerHTML = html;
      this.progress.setAttribute('aria-label', 'Screen ' + (this.index + 1) + ' of ' + this.slides.length);
    },

    // Replace the dashes with custom progress (used by the quiz screens).
    setProgress: function (html, label) {
      this.progress.innerHTML = html;
      if (label) this.progress.setAttribute('aria-label', label);
    },

    overflows: function (card) {
      return card.scrollHeight > card.clientHeight + 1 ||
        card.scrollWidth > card.clientWidth + 1 ||
        this.app.scrollHeight > this.app.clientHeight + 1;
    },

    // Shrink the whole frame a little at a time until the slide fits.
    // Only on very small screens does the card itself get a scrollbar.
    fit: function () {
      var s = this.current();
      if (!s) return;
      var card = s.querySelector('.card') || s.firstElementChild;
      if (!card) return;
      var root = document.documentElement;
      var w = window.innerWidth;
      var h = window.innerHeight;
      var size = w <= 760 ? 15 : Math.max(13, Math.min(17, h / 50));
      var guard = 0;
      card.classList.remove('scroll');
      root.style.fontSize = size + 'px';
      while (this.overflows(card) && size > 12 && guard++ < 30) {
        size -= 0.5;
        root.style.fontSize = size + 'px';
      }
      if (this.overflows(card)) card.classList.add('scroll');
    },

    onResize: function () {
      var a = document.activeElement;
      var typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
      // A phone keyboard opening changes only the height: do not rescale mid-typing.
      if (typing && window.innerWidth === this.lastWidth) return;
      this.lastWidth = window.innerWidth;
      this.fit();
    }
  };

  window.Deck = Deck;
  window.SAA = {
    ic: ic,
    esc: esc,
    hydrate: hydrate,
    shuffle: shuffle,
    toast: toast,
    copyText: copyText,
    download: download
  };
})(window, document);
/* ==========================================================================
   Your Own Task, Framed and Refined (AAI-E-MC1-S02-LAB02)
   Nothing here is saved or sent anywhere. The learner downloads their
   answers as a text file at the end, as evidence for the facilitator.
   ========================================================================== */
(function () {
  'use strict';
  var ic = SAA.ic, esc = SAA.esc;

  var MOVES = [
    { name: 'Narrow', when: 'The answer covers too much.', say: 'Only tell me about ___.' },
    { name: 'Expand', when: 'The answer is too short.', say: 'Tell me more about ___.' },
    { name: 'Change register', when: 'The tone or words are wrong.', say: 'Say this simply for ___.' },
    { name: 'Check it', when: 'The answer sounds too sure.', say: 'What might be wrong here?' },
    { name: 'Combine', when: 'You have two good answers.', say: 'Combine the best of both.' }
  ];

  function $(id) { return document.getElementById(id); }
  function val(id) { var el = $(id); return el ? el.value.trim() : ''; }

  // Moves 4 and 5, as on the Prompt Card's Fix side: tap-to-reveal cards (saa-kit reveal).
  // Moves 1 to 3 are shown with the dial kit in index.html.
  $('move-list').innerHTML = '<div class="saa-cards">' + MOVES.slice(3).map(function (m, j) {
    var i = j + 3;
    var when = m.when.charAt(0).toLowerCase() + m.when.slice(1);
    return '<button class="saa-card" type="button"><span class="saa-front"><span class="mv-top"><img class="mv-ic" src="assets/icons/icon-move-' + (i + 1) + '.webp" alt="" aria-hidden="true">' + (i + 1) + '. ' + esc(m.name) + '</span></span>' +
      '<span class="saa-back"><b>' + esc(m.name) + '.</b> Use it when ' + esc(when) + ' Say: “' + esc(m.say) + '”</span></button>';
  }).join('') + '</div>';

  // Step 1: idea chips fill in the task.
  var ideas = $('ideas');
  ideas.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-idea]');
    if (!chip) return;
    ideas.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
    $('task-name').value = chip.getAttribute('data-idea');
  });

  // Step 2: four parts build one request, shown on the Frame and Run slides.
  var parts = ['b-role', 'b-context', 'b-task', 'b-format'];
  function requestText() {
    var v = parts.map(function (id) { return val(id) || '___'; });
    return 'You are ' + v[0] + '. For ' + v[1] + ', ' + v[2] + '. Format it as ' + v[3] + '.';
  }
  function slot(id) {
    var v = val(id), part = id.slice(2);
    return v ? '<span class="slot request-slot" data-part="' + part + '">' + esc(v) + '</span>' : '<span class="blank request-slot" data-part="' + part + '">___</span>';
  }
  function drawPreview() {
    var html = 'You are ' + slot('b-role') + '. For ' + slot('b-context') + ', ' + slot('b-task') +
      '. Format it as ' + slot('b-format') + '.';
    document.querySelectorAll('[data-preview]').forEach(function (p) { p.innerHTML = html; });
  }
  parts.forEach(function (id) { $(id).addEventListener('input', drawPreview); });
  drawPreview();

  $('copy-request').addEventListener('click', function () {
    var btn = this;
    // never copy a request that still has blanks
    if (!parts.every(function (id) { return val(id).length >= 2; })) {
      var m = $('copy-msg'); m.textContent = 'Some parts are still empty. Tap Back and fill in all 4 parts first.';
      m.classList.remove('ga-shake'); void m.offsetWidth; m.classList.add('ga-shake');
      return;
    }
    $('copy-msg').textContent = '';
    SAA.copyText(requestText(), function () {
      btn.classList.add('done');
      btn.innerHTML = ic('check') + 'Copied';
      SAA.toast('Request copied');
      setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = ic('copy') + 'Copy request'; }, 1600);
    });
  });

  // Step 3: move chips for each round. Picking one suggests what to ask.
  var chosen = { r1: '', r2: '' };
  var autoTask = '';
  document.querySelectorAll('[data-moves]').forEach(function (group) {
    var round = group.getAttribute('data-moves');
    group.innerHTML = MOVES.map(function (m, i) {
      return '<button type="button" class="chip" aria-pressed="false" data-move="' + i + '"><img class="chip-ic" src="assets/icons/icon-move-' + (i + 1) + '.webp" alt="" aria-hidden="true">' + esc(m.name) + '</button>';
    }).join('');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-move]');
      if (!chip) return;
      var m = MOVES[parseInt(chip.getAttribute('data-move'), 10)];
      chosen[round] = m.name;
      group.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      $(round + '-ask').setAttribute('placeholder', 'Example: ' + m.say);
    });
  });

  // "See example" pop-ups: a made-up chat that shows the copy and paste round trip (Step 2)
  // and one refining round with the Narrow move (round 1). Pictures only, no answers to any check.
  var EXAMPLES = {
    run: { src: 'assets/tool-chat-frame-roundtrip.webp', w: 800, h: 560, label: 'Example: run your request',
      alt: 'Example chat in an AI tool such as ChatGPT, Gemini or Claude. Step 1: paste your request in the message box at the bottom. Step 2: copy the first answer with the Copy button under it.' },
    r1: { src: 'assets/tool-chat-frame-narrow.webp', w: 800, h: 500, label: 'Example: one refining round',
      alt: 'Example refining round. The earlier answer covers timing, uniform and tools. The learner uses the Narrow move and asks: Only tell me about the timing part. The new answer: Practical starts at 9:00. Be at the lab by 8:50.' }
  };
  var exPop = document.createElement('div');
  exPop.className = 'ex-pop';
  exPop.hidden = true;
  exPop.innerHTML = '<div class="ex-pop-box" role="dialog" aria-modal="true"><figure class="ex-fig"><img alt=""></figure>' +
    '<button type="button" class="btn btn-ghost btn-sm ex-pop-close">' + ic('x') + 'Close</button></div>';
  document.body.appendChild(exPop);
  var exOpener = null;
  function openEx(key, opener) {
    var ex = EXAMPLES[key];
    if (!ex) return;
    var img = exPop.querySelector('img');
    img.src = ex.src; img.alt = ex.alt; img.width = ex.w; img.height = ex.h;
    exPop.querySelector('.ex-fig').style.setProperty('--ar', ex.w / ex.h);
    exPop.querySelector('[role="dialog"]').setAttribute('aria-label', ex.label);
    exOpener = opener;
    exPop.hidden = false;
    exPop.querySelector('.ex-pop-close').focus();
  }
  function closeEx() { if (exPop.hidden) return; exPop.hidden = true; if (exOpener) { try { exOpener.focus(); } catch (e) {} } }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-see-example]');
    if (b) { openEx(b.getAttribute('data-see-example'), b); return; }
    if (!exPop.hidden && (e.target === exPop || e.target.closest('.ex-pop-close'))) closeEx();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeEx(); });

  // Evidence checklist: shows which parts are done, with a link back to any gaps.
  function evidence() {
    return [
      { text: 'Your task and your framed request', ok: !!val('task-name') && parts.every(function (id) { return !!val(id); }), go: val('task-name') ? 'frame' : 'pick' },
      { text: "The AI's first answer", ok: !!val('out-first'), go: 'run' },
      { text: 'Two rounds of refining: your move, what you asked, and the new answer', ok: !!(chosen.r1 && val('r1-ask') && val('r1-out') && chosen.r2 && val('r2-ask') && val('r2-out')), go: (chosen.r1 && val('r1-ask') && val('r1-out')) ? 'r2' : 'r1' },
      { text: 'Where you stopped, and why', ok: !!val('stop-point'), go: 'stop' },
      { text: 'What the AI did, and what you did', ok: !!(val('ai-part') && val('my-part')), go: 'reflect' }
    ];
  }
  function drawEvidence() {
    $('evidence-list').innerHTML = evidence().map(function (item) {
      return '<li><span class="dot-ic sm ' + (item.ok ? 'ok' : '') + '">' + ic(item.ok ? 'check' : 'pen') + '</span>' +
        '<span class="li-text">' + esc(item.text) + '</span>' +
        (item.ok ? '' : '<button type="button" class="btn-link" data-go="' + item.go + '">Add</button>') + '</li>';
    }).join('');
  }

  function buildFile() {
    function or(v) { return v || '(not answered)'; }
    return [
      'Your Own Task, Framed and Refined: my answers',
      'Swift AI Academy · AAI-E-MC1-S02-LAB02',
      '',
      'My task: ' + or(val('task-name')),
      '',
      'Framed request: ' + (parts.some(function (id) { return val(id); }) ? requestText() : '(not answered)'),
      "AI's first answer: " + or(val('out-first')),
      '',
      'Round 1',
      'Move used: ' + or(chosen.r1),
      'What I asked: ' + or(val('r1-ask')),
      'New answer: ' + or(val('r1-out')),
      '',
      'Round 2',
      'Move used: ' + or(chosen.r2),
      'What I asked: ' + or(val('r2-ask')),
      'New answer: ' + or(val('r2-out')),
      '',
      'Where I stopped, and why: ' + or(val('stop-point')),
      '',
      'What the AI helped with: ' + or(val('ai-part')),
      'What I did myself: ' + or(val('my-part'))
    ].join('\n');
  }
  function openItems() { return evidence().filter(function (i) { return !i.ok; }).length; }
  function save() {
    SAA.download('your-own-task-framed-and-refined-answers.txt', buildFile());
    var open = openItems();
    $('done-status').textContent = open ? 'Your answers are downloaded, but ' + open + (open > 1 ? ' parts are' : ' part is') + ' still empty.' : 'Your answers are downloaded.';
    $('done-status').className = 'status saa-vo-skip ' + (open ? 'bad' : 'ok');
    $('done-lede').textContent = open ? 'Go back, fill in every part and download again. Then share your file with your facilitator.' : 'You framed a real task, refined it and knew when to stop. Share your file with your facilitator.';
  }
  // the status line says it is downloaded; a toast would cover the rule line
  $('download-again').addEventListener('click', save);
  // Start over: a clean reload clears every answer
  $('start-over').addEventListener('click', function () { window.__g8Leaving = true; location.reload(); });
  var warned = false;

  /* ---------- gates: Continue waits for the work on each typing screen ----------
     Each gate line carries data-saa-locked until its task is done, so the shared kit dims
     Continue the same way as on the kit screens; this script blocks the click itself. Pressing it early shows what is still needed. */
  var MIN_PASTE = 15;
  function words(v) { return v.split(/\s+/).filter(function (w) { return /\w/.test(w); }).length; }
  var GATES = {
    pick: function () { return words(val('task-name')) >= 3 ? '' : 'Type your task first. Use at least 3 words.'; },
    frame: function () { return parts.every(function (id) { return val(id).length >= 2; }) ? '' : 'Fill in all 4 parts first.'; },
    run: function () { return val('out-first').length >= MIN_PASTE ? '' : "Paste the AI's first answer in the box."; },
    r1: function () { return roundMsg('r1'); },
    r2: function () { return roundMsg('r2'); },
    stop: function () { return words(val('stop-point')) >= 4 ? '' : 'Type where you stopped and why first.'; },
    reflect: function () { return words(val('ai-part')) >= 3 && words(val('my-part')) >= 3 ? '' : 'Type a short answer in both boxes first.'; }
  };
  function roundMsg(r) {
    if (!chosen[r]) return 'Tap the move you used first.';
    if (words(val(r + '-ask')) < 3) return 'Type what you asked the AI first.';
    if (val(r + '-out').length < MIN_PASTE) return 'Paste the new answer first.';
    return '';
  }
  Object.keys(GATES).forEach(function (id) {
    var g = document.createElement('p');
    g.className = 'ga-gate saa-k-why';
    g.setAttribute('data-saa-locked', ''); g.setAttribute('data-gate', id); g.setAttribute('aria-live', 'polite');
    $(id).querySelector('.card').appendChild(g);
  });
  var gates = Array.prototype.slice.call(document.querySelectorAll('.ga-gate'));
  function refreshGates() {
    gates.forEach(function (g) {
      var d = !GATES[g.getAttribute('data-gate')]();
      if (d !== g.classList.contains('is-done')) {
        g.classList.toggle('is-done', d);
        if (d) { g.removeAttribute('data-saa-locked'); } else { g.setAttribute('data-saa-locked', ''); }
        if (d) { g.textContent = ''; try { g.dispatchEvent(new CustomEvent('saa:done', { bubbles: true })); } catch (e) {} }
      }
    });
  }
  document.addEventListener('input', refreshGates);
  document.addEventListener('click', function () { setTimeout(refreshGates, 0); });
  // registered before saa-kit.js loads
  document.addEventListener('click', function (e) {
    if (!(e.target.closest && e.target.closest('#primary'))) return;
    var s = Deck.current(), g = s && s.querySelector('.ga-gate');
    if (!g) return;
    var m = GATES[g.getAttribute('data-gate')]();
    if (!m) { refreshGates(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    refreshGates();
    g.textContent = m;
    g.classList.remove('ga-shake'); void g.offsetWidth; g.classList.add('ga-shake');
    var f = /Tap the move/.test(m) ? s.querySelector('[data-moves] .chip')
      : [].filter.call(s.querySelectorAll('input, textarea'), function (x) { return !x.value.trim() || (x.tagName === 'TEXTAREA' ? x.value.trim().length < MIN_PASTE : x.value.trim().length < 2); })[0];
    if (f) { try { f.focus({ preventScroll: false }); } catch (x) { f.focus(); } }
    Deck.fit();
  }, true);

  // typed or pasted work is lost on a refresh: ask first
  window.addEventListener('beforeunload', function (e) {
    if (window.__g8Leaving) return;
    var typed = [].some.call(document.querySelectorAll('.slide input, .slide textarea'), function (x) { return x.value.trim(); });
    if (typed) { e.preventDefault(); e.returnValue = ''; }
  });

  Deck.init({
    frame: {
      // Carry the task from Step 1 into the Task part, so it is not typed twice.
      // A changed task from Step 1 also replaces a Task that was filled in this way and not edited since.
      enter: function () {
        if (val('task-name') && (!val('b-task') || val('b-task') === autoTask)) {
          $('b-task').value = autoTask = val('task-name');
          drawPreview();
          refreshGates();
        }
      }
    },
    evidence: {
      enter: function () { warned = false; $('evidence-warn').hidden = true; drawEvidence(); },
      primary: function () {
        // unfinished work: say so once, then the learner may still download
        if (openItems() && !warned) {
          warned = true; $('evidence-warn').hidden = false;
          var wt = $('evidence-warn').lastElementChild; wt.textContent = wt.textContent;   /* new text: the layer reads it */
          Deck.setPrimary('Download anyway', { icon: 'download' });
          Deck.fit();
          return false;
        }
        save();
      }
    }
  });
  refreshGates();
})();
