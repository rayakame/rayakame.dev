// Accent theme switch. Loaded synchronously in <head> so a saved choice applies
// before the first paint; the footer button toggles it and remembers the choice.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function apply(theme) {
    if (theme === 'accent') root.setAttribute('data-theme', 'accent');
    else root.removeAttribute('data-theme');
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', String(theme === 'accent'));
  }

  apply(read());

  document.addEventListener('DOMContentLoaded', function () {
    apply(read());
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'accent' ? 'default' : 'accent';
        try {
          localStorage.setItem(KEY, next);
        } catch {
          // Storage unavailable: the choice lasts for this page only.
        }
        apply(next);
      });
    }
  });
})();
