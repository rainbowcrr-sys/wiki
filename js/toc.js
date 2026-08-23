function generateTOC() {
  const nav = document.getElementById('tocNav');
  if (!nav) return;
  const headings = document.querySelectorAll('#articleBody h1, #articleBody h2, #articleBody h3');
  if (headings.length === 0) {
    nav.innerHTML = '<p class="text-slate-400 text-xs">No headings</p>';
    return;
  }

  // 为每个标题添加 id（如果没有）
  headings.forEach((h, i) => {
    if (!h.id) h.id = 'heading-' + i;
  });

  // 构建 TOC 列表
  const list = document.createElement('ul');
  list.className = 'space-y-1';
  headings.forEach(h => {
    const li = document.createElement('li');
    const depth = parseInt(h.tagName.charAt(1)) - 1;
    li.className = depth > 1 ? 'ml-' + (depth * 3) : '';
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.className = 'block px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition';
    li.appendChild(a);
    list.appendChild(li);
  });
  nav.appendChild(list);

  // 滚动时高亮当前标题
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(a => {
          a.classList.remove('text-brand', 'font-medium', 'bg-indigo-50', 'dark:bg-indigo-900/20');
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.classList.add('text-brand', 'font-medium', 'bg-indigo-50', 'dark:bg-indigo-900/20');
          }
        });
      }
    });
  }, { rootMargin: '-80px 0px -80% 0px' });
  headings.forEach(h => observer.observe(h));
}

// 侧边栏折叠功能
(function() {
  const sidebar = document.getElementById('tocSidebar');
  const toggleBtn = document.getElementById('tocToggle');
  const toggleIcon = document.getElementById('tocToggleIcon');
  const saved = localStorage.getItem('tocCollapsed');
  let collapsed = saved ? saved === 'true' : false;

  function applyState() {
    if (collapsed) {
      sidebar.classList.add('hidden');
      toggleIcon.textContent = 'chevron_left';
    } else {
      sidebar.classList.remove('hidden');
      toggleIcon.textContent = 'chevron_right';
    }
  }
  applyState();
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      collapsed = !collapsed;
      localStorage.setItem('tocCollapsed', collapsed);
      applyState();
    });
  }
})();
