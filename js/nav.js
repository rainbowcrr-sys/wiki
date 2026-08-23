fetch('manifest.json').then(r => r.json()).then(data => {
  const grid = document.getElementById('categoryGrid');
  const latest = document.getElementById('latestList');
  if(!grid) return;
  grid.innerHTML = data.categories.map(c => {
    const arts = data.articles.filter(a => a.cat === c.slug);
    const links = arts.map(a => `<li><a class="text-brand hover:underline" href="article.html?a=${a.cat}/${a.slug}">${a.title}</a></li>`).join('');
    return `
      <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-5 hover:shadow transition">
        <span class="material-symbols-outlined text-3xl text-brand">${c.icon}</span>
        <h3 class="font-semibold mt-2">${c.title}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400">${c.desc}</p>
        <ul class="mt-3 text-sm space-y-1">${links || '<li class="text-slate-400">Coming soon</li>'}</ul>
      </div>`;
  }).join('');

  if(latest){
    const recents = [...data.articles].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
    latest.innerHTML = recents.map(a => {
      const cat = data.categories.find(c=>c.slug===a.cat);
      return `<li><a class="text-brand hover:underline" href="article.html?a=${a.cat}/${a.slug}">${a.title}</a> <span class="text-slate-400 text-xs">· ${cat?cat.title:''}</span></li>`;
    }).join('');
  }
});
