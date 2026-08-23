(function(){
  const root = document.documentElement;
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setDark = (d) => {
    root.classList.toggle('dark', d);
    if(icon) icon.textContent = d ? 'light_mode' : 'dark_mode';
    localStorage.setItem('theme', d ? 'dark' : 'light');
  };
  setDark(saved ? saved === 'dark' : prefersDark);
  const btn = document.getElementById('themeToggle');
  if(btn) btn.addEventListener('click', () => setDark(!root.classList.contains('dark')));
})();
