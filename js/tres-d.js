/* Peças em 3D: o busto do detetive com a coruja no ombro (capa) e a fatia de pizza (caso resolvido),
   girando devagar. Carregam depois da página, para não atrasar a abertura; se o 3D não carregar,
   fica o desenho (na capa, o retrato).
   Marcação: <div class="tres-d" data-3d="busto"></div>

   Modo foto (tecla M ou botão Foto): na capa, o busto em 3D dá lugar ao retrato de estúdio do
   detetive com a coruja. A escolha fica guardada no navegador; ?foto=1 ou ?foto=0 no endereço
   forçam um dos dois. Em modo foto o modelo do busto só é baixado se alguém voltar para o 3D. */
(function () {
  'use strict';
  var MODELOS = {
    busto: { arquivo: 'js/modelo-busto.js', global: 'MODELO_BUSTO', alt: 'Busto de bronze do detetive com uma coruja no ombro, em 3D', orbita: '100deg 80deg 105%', giro: '-12deg', foto: true },
    pizza: { arquivo: 'js/modelo-pizza.js', global: 'MODELO_PIZZA', alt: 'Fatia de pizza, em 3D', orbita: '30deg 55deg 105%', giro: '26deg' }
  };
  var alvos = Array.prototype.slice.call(document.querySelectorAll('#palco [data-3d]'));
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  var urls = {};

  /* ---------- modo foto ---------- */
  var CHAVE = 'flashclip-modo-foto', foto = false, pronto = false, aoTrocar = [];
  try { foto = localStorage.getItem(CHAVE) === '1'; } catch (e) { /* sem armazenamento: começa em 3D */ }
  var forcado = /[?&]foto=([01])(?:&|$)/.exec(location.search);
  if (forcado) foto = forcado[1] === '1';
  var botao = document.getElementById('b-foto');
  function aplicarFoto() {
    document.body.classList.toggle('modo-foto', foto);
    if (botao) { botao.classList.toggle('ligado', foto); botao.setAttribute('aria-pressed', foto ? 'true' : 'false'); }
    aoTrocar.forEach(function (f) { f(); });
  }
  window.MODO_FOTO = {
    ligado: function () { return foto; },
    alternar: function (valor) {
      foto = typeof valor === 'boolean' ? valor : !foto;
      try { localStorage.setItem(CHAVE, foto ? '1' : '0'); } catch (e) { /* vale só nesta visita */ }
      aplicarFoto();
    }
  };
  if (botao) botao.addEventListener('click', function () { window.MODO_FOTO.alternar(); });
  aplicarFoto();
  if (!alvos.length) return;

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
    if (!m || alvo.montado) return;
    if (m.foto && foto) return;            /* em modo foto, espera alguém pedir o 3D */
    alvo.montado = true;
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
        var naPorta = window.LONDRES && window.LONDRES.naPorta();   /* só gira depois da abertura */
        if (slide.classList.contains('ativa') && !reduz.matches && !(m.foto && foto) && !naPorta) mv.setAttribute('auto-rotate', '');
        else mv.removeAttribute('auto-rotate');
      }
      mv.addEventListener('load', function () { alvo.parentNode.classList.add('tem-3d'); girar(); });
      new MutationObserver(girar).observe(slide, { attributes: true, attributeFilter: ['class'] });
      if (m.foto) aoTrocar.push(girar);
      alvo.appendChild(mv);
    }).catch(function () { semTresD(alvo); });
  }
  /* sem 3D: o desenho continua; onde há retrato (capa), ele entra no lugar */
  function semTresD(alvo) { if (alvo.parentNode) alvo.parentNode.classList.add('sem-3d'); }

  function iniciar() {
    script('vendor/model-viewer-umd.min.js').then(function () {
      pronto = true;
      alvos.forEach(montar);
    }).catch(function () { alvos.forEach(semTresD); });
  }
  aoTrocar.push(function () { if (pronto && !foto) alvos.forEach(montar); });
  if (document.readyState === 'complete') iniciar(); else window.addEventListener('load', iniciar);
})();
