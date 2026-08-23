// js/toc.js
(function () {
  var panel, openBtn, closeBtn, nav, overlay;

  function getEls() {
    panel = document.getElementById('tocPanel');
    openBtn = document.getElementById('tocOpenBtn');
    closeBtn = document.getElementById('tocCloseBtn');
    nav = document.getElementById('tocNav');
    overlay = document.getElementById('tocOverlay');
  }

  // 等 DOM 就绪后再取元素、绑事件（防止元素未渲染导致监听绑不上）
  function init() {
    getEls();
    if (!panel) return;

    buildTOC();

    // 用 addEventListener 且 passive:false 确保 click 一定生效
    if (openBtn) openBtn.addEventListener('click', function (e) { e.preventDefault(); openPanel(); }, { passive: false });
    if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); closePanel(); }, { passive: false });
    if (overlay) overlay.addEventListener('click', function () { closePanel(); }, { passive: false });

    // 桌面端：默认展开面板（移除 translate-x-full，加 translate-x-0）
    if (window.innerWidth >= 1024) {
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
      if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
    } else {
      // 移动端：默认收起
      panel.classList.add('translate-x-full');
      panel.classList.remove('translate-x-0');
    }
  }

  function openPanel() {
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all'; }
    try { localStorage.setItem('tocOpen', 'true'); } catch (e) {}
  }

  function closePanel() {
    if (window.innerWidth >= 1024) {
      // 桌面端也允许关闭：加回 translate-x-full
      panel.classList.add('translate-x-full');
      panel.classList.remove('translate-x-0');
    } else {
      panel.classList.add('translate-x-full');
      panel.classList.remove('translate-x-0');
    }
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
    try { localStorage.setItem('tocOpen', 'false'); } catch (e) {}
  }

  function buildTOC() {
    if (!nav) return;
    var headings = document.querySelectorAll('#articleBody h2');
    if (headings.length === 0) {
      nav.innerHTML = '<p class="text-slate-400 text-xs px-2">No sections</p>';
      return;
    }
    headings.forEach(function (h, i) { if (!h.id) h.id = 'heading-' + i; });

    var ul = document.createElement('ul');
    ul.className = 'space-y-1';
    headings.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'toc-link block px-2 py-1.5 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition';
      a.textContent = h.textContent;
      a.addEventListener('click', function () {
        if (window.innerWidth < 1024) closePanel();
      }, { passive: false });
      li.appendChild(a);
      ul.appendChild(li);
    });
    nav.innerHTML = '';
    nav.appendChild(ul);

    if ('IntersectionObserver' in window) {
      var links = {};
      nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var a = links[entry.target.id];
          if (!a) return;
          if (entry.isIntersecting) {
            nav.querySelectorAll('a').forEach(function (x) { x.classList.remove('text-brand','font-medium','bg-indigo-50','dark:bg-indigo-900/20'); });
            a.classList.add('text-brand','font-medium','bg-indigo-50','dark:bg-indigo-900/20');
          }
        });
      }, { rootMargin: '-80px 0px -80% 0px' });
      headings.forEach(function (h) { io.observe(h); });
    }
  }

  // 暴露给 article.html 的 fetch 回调
  window.generateTOC = buildTOC;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
