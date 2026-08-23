// js/toc.js
(function () {
  var sidebar = document.getElementById('tocSidebar');
  var toggleBtn = document.getElementById('tocToggle');
  var toggleIcon = document.getElementById('tocToggleIcon');
  if (!sidebar) return;

  // 生成 TOC
  window.generateTOC = function () {
    var nav = document.getElementById('tocNav');
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

    if ('IntersectionObserver' in window) {
      var links = {};
      nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var a = links[entry.target.id];
          if (!a) return;
          if (entry.isIntersecting) {
            nav.querySelectorAll('a').forEach(function (x) { x.classList.remove('text-brand','font-medium','bg-indigo-50','dark:bg-indigo-900/20'); });
            a.classList.add('text-brand','font-medium','bg-indigo-50','dark:bg-indigo-900/20');
          }
        });
      }, { rootMargin: '-80px 0px -80% 0px' });
      headings.forEach(function (h) { observer.observe(h); });
    }
  };

  // 显隐控制：用内联 style + 数据属性，绕过 Tailwind hidden 冲突
  function setOpen(open) {
    sidebar.dataset.open = open ? 'true' : 'false';
    if (open) {
      sidebar.style.display = 'block';
      if (toggleIcon) toggleIcon.textContent = 'chevron_right';
    } else {
      sidebar.style.display = 'none';
      if (toggleIcon) toggleIcon.textContent = 'chevron_left';
    }
    try { localStorage.setItem('tocOpen', open ? 'true' : 'false'); } catch(e){}
  }

  // 初始状态：桌面端默认开，移动端默认关
  var isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  var saved = null;
  try { saved = localStorage.getItem('tocOpen'); } catch(e){}
  var initialOpen = saved !== null ? saved === 'true' : isDesktop;
  setOpen(initialOpen);

  // 窗口尺寸变化时：只在用户没手动设置过时才跟随断点
  var mq = window.matchMedia('(min-width: 1024px)');
  mq.addListener && mq.addListener(function (e) {
    try { if (localStorage.getItem('tocOpen') === null) setOpen(e.matches); } catch(err){}
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      setOpen(sidebar.dataset.open !== 'true');
    });
  }
})();
