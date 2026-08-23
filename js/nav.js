// js/nav.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('explore-container');
  const searchInput = document.querySelector('.search-input');

  // 如果没有容器或搜索框，说明是文章页，直接退出
  if (!container || !searchInput) return;

  // 读取 manifest.json
  fetch('manifest.json')
    .then(res => res.json())
    .then(data => {
      const articles = data.articles;

      // 1. 生成分类卡片
      const categories = {};
      articles.forEach(article => {
        if (!categories[article.cat]) {
          categories[article.cat] = [];
        }
        categories[article.cat].push(article);
      });

      let html = '';
      for (const cat in categories) {
        const displayName = cat.replace('-', ' / ').toUpperCase();
        html += `
          <div class="card">
            <div class="card-header">
              <span class="material-symbols-outlined">${getIcon(cat)}</span>
              <h2>${displayName}</h2>
            </div>
            <ul class="card-list">
        `;
        categories[cat].forEach(article => {
          html += `<li><a href="articles/${article.cat}/${article.slug}.html">${article.title}</a></li>`;
        });
        html += `</ul></div>`;
      }
      container.innerHTML = html;

      // 2. 生成侧边栏 TOC (仅在文章页)
      if (document.body.classList.contains('article-page')) {
        generateTOC();
      }

      // 3. 搜索功能
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(q) ? 'block' : 'none';
        });
      });
    })
    .catch(err => console.error("Failed to load manifest:", err));
});

// 辅助函数：根据分类名返回图标名
function getIcon(category) {
  const map = {
    'programming': 'code',
    'ai-ml': 'psychology',
    'linux-devops': 'terminal',
    'tools': 'build'
  };
  return map[category] || 'article';
}

// 生成右侧目录 TOC
function generateTOC() {
  const tocContainer = document.getElementById('toc-container');
  if (!tocContainer) return;

  const headings = document.querySelectorAll('h1, h2, h3');
  if (headings.length === 0) {
    tocContainer.innerHTML = '<p class="text-sm text-gray-500">No sections found.';
    return;
  }

  let tocHtml = '<div class="toc-title">On this page</div><ul>';
  headings.forEach(heading => {
    // 跳过 id 为空或特定不想显示的标题
    if (!heading.id) heading.id = heading.textContent.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    tocHtml += `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;
  });
  tocHtml += '</ul>';
  tocContainer.innerHTML = tocHtml;
}
