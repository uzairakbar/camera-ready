/*
 * Camera Ready: maths fallback.
 *
 * Maths is written as $`x^2`$ (inline) or $$`x^2`$$ (display), which markdown
 * turns into a <code> element between dollar signs. This script hands each
 * one to the self-hosted KaTeX. Without JavaScript the TeX source stays
 * readable in place.
 *
 * Sites built with scripts/prerender-math.js have this done at build time,
 * and this file and KaTeX's script are then not loaded at all.
 */
(function () {
  'use strict';

  function render() {
    if (!window.katex) return;
    var codes = document.querySelectorAll('main code');
    for (var i = 0; i < codes.length; i++) {
      var code = codes[i];
      var prev = code.previousSibling;
      var next = code.nextSibling;
      if (!prev || !next || prev.nodeType !== 3 || next.nodeType !== 3) continue;
      var before = /\${1,2}$/.exec(prev.nodeValue);
      var after = /^\${1,2}/.exec(next.nodeValue);
      if (!before || !after) continue;
      var n = Math.min(before[0].length, after[0].length);
      var span = document.createElement('span');
      try {
        window.katex.render(code.textContent, span, {
          displayMode: n === 2,
          throwOnError: false
        });
      } catch (e) {
        continue;
      }
      prev.nodeValue = prev.nodeValue.slice(0, prev.nodeValue.length - n);
      next.nodeValue = next.nodeValue.slice(n);
      code.parentNode.replaceChild(span.firstChild, code);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
