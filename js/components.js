// js/components.js
(function(){
  // ---------- <code-block> : 带复制按钮的代码块 ----------
  class CodeBlock extends HTMLElement {
    connectedCallback(){
      const lang = this.getAttribute('lang') || '';
      const code = this.textContent.trim();
      this.innerHTML = `
        <div class="code-block" data-lang="${lang}">
          <div class="code-block-header">
            <span class="code-lang">${lang}</span>
            <button class="code-copy" type="button">Copy</button>
          </div>
          <pre><code>${escapeHtml(code)}</code></pre>
        </div>`;
      this.querySelector('.code-copy').addEventListener('click', ()=>{
        navigator.clipboard.writeText(code).then(()=>{
          const btn = this.querySelector('.code-copy');
          btn.textContent = 'Copied!';
          setTimeout(()=> btn.textContent='Copy', 1500);
        });
      });
    }
  }
  customElements.define('code-block', CodeBlock);

  // ---------- <formula> / 行内 <formula-inline> ----------
  class Formula extends HTMLElement {
    connectedCallback(){
      const tex = this.textContent.trim();
      const display = this.hasAttribute('inline') ? false : true;
      const div = document.createElement('span');
      div.className = display ? 'formula-block' : 'formula-inline';
      this.replaceWith(div);
      if (window.renderMathInElement && window.katex){
        try {
          if (display) katex.render(tex, div, {displayMode:true, throwOnError:false});
          else katex.render(tex, div, {displayMode:false, throwOnError:false});
        } catch(e){ div.textContent = tex; }
      } else {
        div.textContent = '$$'+tex+'$$';
      }
    }
  }
  customElements.define('formula', Formula);

  // ---------- <icon-show> : 展示单个 Material Symbol 图标 ----------
  class IconShow extends HTMLElement {
    connectedCallback(){
      const name = this.getAttribute('name') || 'article';
      const label = this.getAttribute('label') || name;
      const size = this.getAttribute('size') || '48';
      this.innerHTML = `
        <span class="icon-show" title="${label}">
          <span class="material-symbols-outlined" style="font-size:${size}px">${name}</span>
          <span class="icon-show-label">${label}</span>
        </span>`;
    }
  }
  customElements.define('icon-show', IconShow);

  // ---------- <icon-grid> : 网格批量展示图标 ----------
  class IconGrid extends HTMLElement {
    connectedCallback(){
      let icons = [];
      try { icons = JSON.parse(this.getAttribute('icons') || '[]'); } catch(e){}
      if (!icons.length) {
        // 默认一批常用图标
        icons = ['code','psychology','terminal','build','web','database','cloud','school','science','rocket_launch','lightbulb','favorite'];
      }
      const html = icons.map(n => `
        <span class="icon-tile" title="${n}">
          <span class="material-symbols-outlined">${n}</span>
          <span class="icon-tile-name">${n}</span>
        </span>`).join('');
      this.innerHTML = `<div class="icon-grid">${html}</div>`;
    }
  }
  customElements.define('icon-grid', IconGrid);

  // ---------- <chart-block> : Chart.js 图表 ----------
  class ChartBlock extends HTMLElement {
    connectedCallback(){
      let cfg;
      try { cfg = JSON.parse(this.getAttribute('config') || '{}'); } catch(e){ cfg = {}; }
      const canvas = document.createElement('canvas');
      this.appendChild(canvas);
      if (window.Chart){
        new Chart(canvas.getContext('2d'), cfg);
      } else {
        this.innerHTML = '<p class="text-slate-400 text-sm">Chart.js not loaded.</p>';
        this.appendChild(canvas);
      }
    }
  }
  customElements.define('chart-block', ChartBlock);

  // ---------- 工具函数 ----------
  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ---------- 初始化入口 ----------
  window.initComponents = function(root){
    if (!root) return;
    // 自定义元素会通过 customElements 自动升级（innerHTML 插入后已触发）
    // 处理 $$...$$ 分隔符的块级公式（如果没用 <formula> 标签）
    if (window.renderMathInElement){
      try { renderMathInElement(root, {delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});} catch(e){}
    }
    // 给所有 <pre><code> 里的代码块加复制按钮（兼容普通 pre 写法）
    root.querySelectorAll('pre:not(.code-block pre)').forEach(pre=>{
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
      const code = pre.textContent;
      const wrap = document.createElement('div');
      wrap.className = 'code-block';
      wrap.innerHTML = `<div class="code-block-header"><span class="code-lang">code</span><button class="code-copy" type="button">Copy</button></div>`;
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.querySelector('.code-copy').addEventListener('click', ()=>{
        navigator.clipboard.writeText(code).then(()=>{
          const b = wrap.querySelector('.code-copy'); b.textContent='Copied!'; setTimeout(()=>b.textContent='Copy',1500);
        });
      });
    });
  };
})();
