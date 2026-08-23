// js/components.js
(function () {
  // ---------- <code-block> : 带 Copy 按钮的代码块 ----------
  class CodeBlock extends HTMLElement {
    connectedCallback() {
      var lang = (this.getAttribute('lang') || 'text').toLowerCase();
      var code = this.textContent.trim();
      this.innerHTML =
        '<div class="code-block">' +
          '<div class="code-block-header">' +
            '<span class="code-lang">' + lang + '</span>' +
            '<button class="code-copy" type="button">Copy</button>' +
          '</div>' +
          '<pre><code></code></pre>' +
        '</div>';
      this.querySelector('code').textContent = code;
      this.querySelector('.code-copy').addEventListener('click', function () {
        var btn = this;
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      });
    }
  }
  customElements.define('code-block', CodeBlock);

  // ---------- <formula> : 数学公式（KaTeX）----------
  class Formula extends HTMLElement {
    connectedCallback() {
      var tex = this.textContent.trim();
      var display = !this.hasAttribute('inline');
      if (window.katex) {
        try { katex.render(tex, this, { displayMode: display, throwOnError: false }); return; }
        catch (e) {}
      }
      this.textContent = (display ? '$$' : '$') + tex + (display ? '$$' : '$');
    }
  }
  customElements.define('formula', Formula);

  // ---------- <icon-show> : 单个 Material Symbol 图标 ----------
  class IconShow extends HTMLElement {
    connectedCallback() {
      var name = this.getAttribute('name') || 'article';
      var label = this.getAttribute('label') || name;
      var size = this.getAttribute('size') || '48';
      this.innerHTML =
        '<span class="icon-show">' +
          '<span class="material-symbols-outlined" style="font-size:' + size + 'px">' + name + '</span>' +
          '<span class="icon-show-label">' + label + '</span>' +
        '</span>';
    }
  }
  customElements.define('icon-show', IconShow);

  // ---------- <icon-grid> : 网格批量展示图标 ----------
  class IconGrid extends HTMLElement {
    connectedCallback() {
      var icons = [];
      try { icons = JSON.parse(this.getAttribute('icons') || '[]'); } catch (e) {}
      if (!icons.length) {
        icons = ['code','psychology','terminal','build','web','database','cloud','school','science','rocket_launch','lightbulb','favorite'];
      }
      var html = icons.map(function (n) {
        return '<span class="icon-tile" title="' + n + '">' +
                 '<span class="material-symbols-outlined">' + n + '</span>' +
                 '<span class="icon-tile-name">' + n + '</span>' +
               '</span>';
      }).join('');
      this.innerHTML = '<div class="icon-grid">' + html + '</div>';
    }
  }
  customElements.define('icon-grid', IconGrid);

  // ---------- <chart-block> : Chart.js 图表 ----------
  class ChartBlock extends HTMLElement {
    connectedCallback() {
      var cfg = {};
      try { cfg = JSON.parse(this.getAttribute('config') || '{}'); } catch (e) {}
      var canvas = document.createElement('canvas');
      this.appendChild(canvas);
      if (window.Chart && cfg.type && cfg.data) {
        new Chart(canvas.getContext('2d'), cfg);
      } else {
        var p = document.createElement('p');
        p.className = 'text-sm text-slate-400';
        p.textContent = 'Chart: ' + (cfg.type || 'no type') + ' — Chart.js ' + (window.Chart ? 'ready' : 'not loaded');
        this.insertBefore(p, canvas);
      }
    }
  }
  customElements.define('chart-block', ChartBlock);

  // ---------- 初始化入口 ----------
  window.initComponents = function (root) {
    if (!root) return;
    root.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.code-block')) return;
      var code = pre.textContent;
      var wrap = document.createElement('div');
      wrap.className = 'code-block';
      wrap.innerHTML = '<div class="code-block-header"><span class="code-lang">code</span><button class="code-copy" type="button">Copy</button></div>';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.querySelector('.code-copy').addEventListener('click', function () {
        navigator.clipboard.writeText(code).then(function () {
          var b = wrap.querySelector('.code-copy'); b.textContent = 'Copied!';
          setTimeout(function () { b.textContent = 'Copy'; }, 1500);
        });
      });
    });
    if (window.renderMathInElement) {
      try {
        renderMathInElement(root, {
          delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],
          throwOnError: false
        });
      } catch (e) {}
    }
  };
})();
