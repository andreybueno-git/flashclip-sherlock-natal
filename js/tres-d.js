/* Peça em 3D na gravura: o busto do detetive, girando devagar. Carrega depois da página, para
   não atrasar a abertura; se o 3D não carregar, fica a silhueta desenhada. */
(function () {
  'use strict';
  var alvos = Array.prototype.slice.call(document.querySelectorAll('#palco [data-3d]'));
  if (!alvos.length) return;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');

  function script(src) {
    return new Promise(function (ok, erro) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = function () { erro(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  function urlDoModelo() {
    var bin = atob(window.MODELO_BUSTO), n = bin.length, bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
    window.MODELO_BUSTO = null;
    return URL.createObjectURL(new Blob([bytes], { type: 'model/gltf-binary' }));
  }

  function montar(url) {
    alvos.forEach(function (alvo) {
      var mv = document.createElement('model-viewer'), slide = alvo.closest('.slide');
      mv.setAttribute('src', url);
      mv.setAttribute('alt', 'Busto de bronze do detetive, em 3D');
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('disable-zoom', '');
      mv.setAttribute('disable-pan', '');
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('shadow-intensity', '0');
      mv.setAttribute('exposure', '1.15');
      mv.setAttribute('camera-orbit', '25deg 80deg 105%');
      mv.setAttribute('rotation-per-second', '14deg');
      mv.setAttribute('auto-rotate-delay', '0');
      function girar() {
        if (slide.classList.contains('ativa') && !reduz.matches) mv.setAttribute('auto-rotate', '');
        else mv.removeAttribute('auto-rotate');
      }
      mv.addEventListener('load', function () { alvo.parentNode.classList.add('tem-3d'); girar(); });
      new MutationObserver(girar).observe(slide, { attributes: true, attributeFilter: ['class'] });
      alvo.appendChild(mv);
    });
  }

  function iniciar() {
    script('vendor/model-viewer-umd.min.js')
      .then(function () { return script('js/modelo-busto.js'); })
      .then(function () { montar(urlDoModelo()); })
      .catch(function () { /* sem 3D: a silhueta continua na gravura */ });
  }
  if (document.readyState === 'complete') iniciar(); else window.addEventListener('load', iniciar);
})();
