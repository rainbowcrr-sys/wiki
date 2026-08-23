(function () {
  window.initComponents = function (root) {
    if (!root) return;
    root.querySelectorAll('code-block').forEach(renderCodeBlock);
    root.querySelectorAll('formula').forEach(renderFormula);
    root.querySelectorAll('icon-show').forEach(renderIconShow);
    root.querySelectorAll('icon-grid').forEach(renderIconGrid);
    root.querySelectorAll('chart-block').forEach(renderChart);
  };

  function renderCodeBlock(el) {
    if (el.dataset.r) return; el.dataset.r = '1';
    var lang = (el.getAttribute('lang') || 'text').toLowerCase();
    var code = el.textContent.trim();
    el.outerHTML = '<div class="code-block"><div class="code-block-header"><span class="code-lang">' + lang + '</span><button class="code-copy" type="button">Copy</button></div><pre><code></code></pre></div>'.replace('<pre><code></code></pre>', '<pre><code>' + escapeHtml(code) + '</code></pre>');
    var block = el.previousElementSibling || document.querySelector('.code-block:last-of-type');
    if (block) block.querySelector('.code-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(code).then(function () { this.textContent = 'Copied!'; var b = this; setTimeout(function () { b.textContent = 'Copy'; }, 1500); }.bind(this));
    });
  }

  function renderFormula(el) {
    if (el.dataset.r) return; el.dataset.r = '1';
    var tex = el.textContent.trim();
    var display = !el.hasAttribute('inline');
    if (window.katex) { try { katex.render(tex, el, { displayMode: display, throwOnError: false }); return; } catch (e) {} }
    el.textContent = (display ? '$$' : '$') + tex + (display ? '$$' : '$');
  }

  function renderIconShow(el) {
    if (el.dataset.r) return; el.dataset.r = '1';
    var name = el.getAttribute('name') || 'article';
    var label = el.getAttribute('label') || name;
    el.innerHTML = '<span class="icon-show"><span class="material-symbols-outlined" style="font-size:' + (el.getAttribute('size') || '48') + 'px">' + name + '</span><span class="icon-show-label">' + label + '</span></span>';
  }

  function renderIconGrid(el) {
    if (el.dataset.r) return; el.dataset.r = '1';
    var icons = [];
    try { icons = JSON.parse(el.getAttribute('icons') || '[]'); } catch (e) {}
    if (!icons.length) icons = ['code','psychology','terminal','build','web','database','cloud','school','science','rocket_launch','lightbulb','favorite'];
    el.innerHTML = '<div class="icon-grid">' + icons.map(function (n) { return '<span class="icon-tile"><span class="material-symbols-outlined">' + n + '</span><span class="icon-tile-name">' + n + '</span></span>'; }).join('') + '</div>';
  }

  function renderChart(el) {
    if (el.dataset.r) return; el.dataset.r = '1';
    var cfg = {};
    try { cfg = JSON.parse(el.getAttribute('config') || '{}'); } catch (e) {}
    var canvas = document.createElement('canvas');
    el.appendChild(canvas);
    if (window.Chart && cfg.type && cfg.data) new Chart(canvas.getContext('2d'), cfg);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
