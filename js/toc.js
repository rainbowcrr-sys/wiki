// js/toc.js
(function () {
  var panel = document.getElementById('tocPanel');
  var openBtn = document.getElementById('tocOpenBtn');
  var closeBtn = document.getElementById('tocCloseBtn');
  var nav = document.getElementById('tocNav');
  if (!panel || !openBtn) return;

  // 生成 TOC 列表
  function buildTOC() {
    if (!nav) return;
    var headings = document.querySelectorAll('#articleBody h2');
    if (headings.length === 0) {
      nav.innerHTML = '<p class="text-slate-400 text-xs">No sections</p>';
      return;
    }
    headings.forEach(function (h, i) { if (!h.id) h.id = 'heading-' + i; });
    var html = '<ul class="space-y-1">';
    headings.forEach(function (h) {
      html += '<li><a href="#' + h.id + '" class="toc-link block px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">' + h.textContent + '</a></li>';
    });
    html += '</ul>';
    nav.innerHTML = html;

    // 点击链接后（手机端）自动收起面板
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth < 1024) setOpen(false); });
    });

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

  function setOpen(open) {
    panel.dataset.open = open ? 'true' : 'false';
    try { localStorage.setItem('tocOpen', open ? 'true' : 'false'); } catch (e) {}
  }

  function toggle() { setOpen(panel.dataset.open !== 'true'); }

  // 初始状态：桌面端默认开，移动端默认关
  var isDesktop = window.innerWidth >= 1024;
  var saved = null;
  try { saved = localStorage.getItem('tocOpen'); } catch (e) {}
  setOpen(saved !== null ? saved === 'true' : isDesktop);

  openBtn.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });

  // 暴露给 article.html 的 fetch 回调
  window.generateTOC = buildTOC;
})();
