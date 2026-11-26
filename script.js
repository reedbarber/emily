(function () {
  'use strict';

  var BASE = 'https://reedbarber.org/wp-content/uploads/2016/09/';
  var PHOTOS = [
    ['2015-03-19_16-42-53.jpg', 960],
    ['2013-11-10_08-14-20.jpg', 1024],
    ['2013-11-30_15-40-07.jpg', 1024],
    ['2013-12-21_18-00-39.jpg', 1024],
    ['2014-04-20_12-00-24.jpg', 1024],
    ['/images/pic5.jpg', 1024],
    ['2015-05-03_19-47-47.jpg', 640],
    ['2015-06-06_18-01-30.jpg', 768],
    ['2015-06-07_19-27-41.jpg', 1024],
    ['2015-06-08_12-24-45.jpg', 960],
    ['2015-06-14_17-27-11.jpg', 1024],
    ['2015-06-20_12-47-38.jpg', 1024],
    ['2015-06-24_15-06-29.jpg', 1024],
    ['emily2-1_cccopy.jpg', 1024],
    ['emilyann-lastschool.jpg', 718],
    ['emilysnow.jpg', 653]
  ].map(function (p, i) {
    return { src: BASE + p[0] + '?w=' + p[1], alt: 'Emily Ann Barber, photo ' + (i + 1) + ' of 16' };
  });

  /* ---------- Day / night ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var label = toggle.querySelector('.label');
  var KEY = 'emily-memorial-theme';

  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var night = theme === 'night';
    toggle.setAttribute('aria-pressed', String(night));
    toggle.setAttribute('aria-label', night ? 'Switch to day background' : 'Switch to night background');
    label.textContent = night ? 'Night' : 'Day';
  }

  var initial = saved() ||
    (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
  applyTheme(initial);

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    applyTheme(next);
    save(next);
  });

  /* ---------- Gallery ---------- */
  var gallery = document.getElementById('gallery');
  PHOTOS.forEach(function (p, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'photo';
    btn.setAttribute('aria-label', 'Open photo ' + (i + 1));
    var img = document.createElement('img');
    img.src = p.src; img.alt = p.alt; img.loading = 'lazy'; img.decoding = 'async';
    btn.appendChild(img);
    btn.addEventListener('click', function () { open(i); });
    gallery.appendChild(btn);
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('.lb-img');
  var lbCount = lb.querySelector('.lb-count');
  var current = 0, lastFocus = null;

  function show(i) {
    current = (i + PHOTOS.length) % PHOTOS.length;
    lbImg.src = PHOTOS[current].src;
    lbImg.alt = PHOTOS[current].alt;
    lbCount.textContent = (current + 1) + ' / ' + PHOTOS.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  var startX = null;
  lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
