const input = document.getElementById('searchInput');
const box = document.getElementById('searchResults');
let fuse = null, docs = [];
fetch('manifest.json').then(r=>r.json()).then(data=>{
  docs = data.articles.map(a=>({...a, url:'article.html?a='+a.cat+'/'+a.slug}));
  fuse = new Fuse(docs, { keys:['title','cat'], threshold:0.4 });
});
if(input){
  input.addEventListener('input', ()=>{
    const q = input.value.trim();
    if(!q){ box.classList.add('hidden'); return; }
    const hits = fuse.search(q).slice(0,8).map(r=>r.item);
    box.innerHTML = hits.length ? hits.map(h=>`<a class="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" href="${h.url}">${h.title}</a>`).join('') : '<div class="px-3 py-2 text-slate-400">No results</div>';
    box.classList.remove('hidden');
  });
}
