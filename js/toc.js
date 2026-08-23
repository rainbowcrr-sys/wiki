// js/toc.js
(function () {
  var sidebar = document.getElementById('tocSidebar');
  var toggleBtn = document.getElementById('tocToggle');
  var toggleIcon = document.getElementById('tocToggleIcon');
  if (!sidebar) return;

  var CLASS_HIDDEN = 'toc-is-hidden';
  var collapsed = localStorage.getItem('tocCollapsed') === 'true';

  function apply() {
    if (collapsed) {
      sidebar.classList.add(CLASS_HIDDEN);
      if (toggleIcon) toggleIcon.textContent = 'chevron_left';
    } else {
      sidebar.classList.remove(CLASS_HIDDEN);
      if (toggleIcon) toggleIcon.textContent = 'chevron_right';
    }
  }
  apply();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      collapsed = !collapsed;
      localStorage.setItem('tocCollapsed', collapsed ? 'true' : 'false');
      apply();
    });
  }

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
      var depth = parseInt(h.tagName.charAt(1), 10) - 1;
      var indent = depth > 1 ? ' ml-' + (depth * 3) : '';
      html += '<li class="' + indent + '"><a href="#' + h.id + '" class="toc-link block px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">' + h.textContent + '</a></li>';
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
})();
