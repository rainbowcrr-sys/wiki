fetch('manifest.json')
  .then(r => r.json())
  .then(data => {
    const articles = data.articles || [];
    const grid = document.getElementById('categoryGrid');
    const latest = document.getElementById('latestList');
    if(!grid) return;

    // 分类元数据（图标+描述）内嵌，不依赖 manifest 里的 categories 字段
    const catMeta = {
      'programming':  { title: 'Programming',   icon: 'code',        desc: 'Python, Rust, Go and language internals' },
      'ai-ml':        { title: 'AI & ML',       icon: 'psychology',  desc: 'Paper summaries and model notes' },
      'linux-devops': { title: 'Linux / DevOps', icon: 'terminal',    desc: 'Shell, Docker, systemd, CI/CD' },
      'tools':        { title: 'Tools',         icon: 'build',       desc: 'Git configs, editor setups, dotfiles' }
    };

    // 按分类分组
    const groups = {};
    articles.forEach(a => { (groups[a.cat] = groups[a.cat] || []).push(a); });

    grid.innerHTML = Object.keys(groups).map(cat => {
      const m = catMeta[cat] || { title: cat, icon: 'article', desc: '' };
      const links = groups[cat].map(a =>
        `<li><a class="text-brand hover:underline" href="article.html?a=${a.cat}/${a.slug}">${a.title}</a></li>`
      ).join('');
      return `
        <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-5 hover:shadow transition">
          <span class="material-symbols-outlined text-3xl text-brand">${m.icon}</span>
          <h3 class="font-semibold mt-2">${m.title}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">${m.desc}</p>
          <ul class="mt-3 text-sm space-y-1">${links || '<li class="text-slate-400">Coming soon</li>'}</ul>
        </div>`;
    }).join('');

    if(latest){
      const recents = [].concat(articles).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
      latest.innerHTML = recents.map(a => {
        const m = catMeta[a.cat] || { title: a.cat };
        return `<li><a class="text-brand hover:underline" href="article.html?a=${a.cat}/${a.slug}">${a.title}</a> <span class="text-slate-400 text-xs">· ${m.title}</span></li>`;
      }).join('');
    }
  })
  .catch(err => console.error('Failed to load manifest:', err));
