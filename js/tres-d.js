/* Peças em 3D: o busto do detetive (capa) e a fatia de pizza (caso resolvido), girando devagar.
   Carregam depois da página, para não atrasar a abertura; se o 3D não carregar, fica o desenho.
   Marcação: <div class="tres-d" data-3d="busto"></div> */
(function () {
  'use strict';
  var MODELOS = {
    busto: { arquivo: 'js/modelo-busto.js', global: 'MODELO_BUSTO', alt: 'Busto de bronze do detetive, em 3D', orbita: '25deg 80deg 105%', giro: '14deg' },
    pizza: { arquivo: 'js/modelo-pizza.js', global: 'MODELO_PIZZA', alt: 'Fatia de pizza, em 3D', orbita: '30deg 55deg 105%', giro: '26deg' }
  };
  var alvos = Array.prototype.slice.call(document.querySelectorAll('#palco [data-3d]'));
  if (!alvos.length) return;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  var urls = {};

  function script(src) {
    return new Promise(function (ok, erro) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = function () { erro(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  function urlDoModelo(nome) {
    if (urls[nome]) return Promise.resolve(urls[nome]);
    var m = MODELOS[nome];
    return script(m.arquivo).then(function () {
      var bin = atob(window[m.global]), n = bin.length, bytes = new Uint8Array(n);
      for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
      window[m.global] = null;
      urls[nome] = URL.createObjectURL(new Blob([bytes], { type: 'model/gltf-binary' }));
      return urls[nome];
    });
  }

  function montar(alvo) {
    var nome = alvo.getAttribute('data-3d') || 'busto', m = MODELOS[nome];
    if (!m) return;
    urlDoModelo(nome).then(function (url) {
      var mv = document.createElement('model-viewer'), slide = alvo.closest('.slide');
      mv.setAttribute('src', url);
      mv.setAttribute('alt', m.alt);
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('disable-zoom', '');
      mv.setAttribute('disable-pan', '');
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('shadow-intensity', '0');
      mv.setAttribute('exposure', '1.15');
      mv.setAttribute('camera-orbit', m.orbita);
      mv.setAttribute('rotation-per-second', m.giro);
      mv.setAttribute('auto-rotate-delay', '0');
      function girar() {
        if (slide.classList.contains('ativa') && !reduz.matches) mv.setAttribute('auto-rotate', '');
        else mv.removeAttribute('auto-rotate');
      }
      mv.addEventListener('load', function () { alvo.parentNode.classList.add('tem-3d'); girar(); });
      new MutationObserver(girar).observe(slide, { attributes: true, attributeFilter: ['class'] });
      alvo.appendChild(mv);
    }).catch(function () { /* sem 3D: o desenho continua */ });
  }

  function iniciar() {
    script('vendor/model-viewer-umd.min.js').then(function () { alvos.forEach(montar); }).catch(function () { /* sem 3D */ });
  }
  if (document.readyState === 'complete') iniciar(); else window.addEventListener('load', iniciar);
})();
