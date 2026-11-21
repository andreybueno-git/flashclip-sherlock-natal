/* A página como um lugar: a Londres do Sherlock.
   - o panorama atrás da folha anda conforme os slides avançam e responde de leve ao ponteiro;
   - cada slide ganha figurinhas coladas nas bordas da folha (dá para clicar e arrastar);
   - a abertura: bater à porta da casa 221B começa a apresentação.
   Nada aqui muda o conteúdo dos slides. Se algo falhar, a apresentação abre sem a abertura. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  var D = window.DECK;
  if (!D) { raiz.classList.remove('com-entrada'); return; }

  function $(s, r) { return (r || document).querySelector(s); }

  /* ---------- o mundo: viagem e olhar ---------- */
  function viagem() {
    var e = D.estado();
    raiz.style.setProperty('--viagem', (e.atual / Math.max(1, e.ordem.length - 1)).toFixed(4));
  }
  var alvo = { x: 0, y: 0 }, olho = { x: 0, y: 0 }, andando = false;
  function passo() {
    olho.x += (alvo.x - olho.x) * .06; olho.y += (alvo.y - olho.y) * .06;
    raiz.style.setProperty('--olhar-x', olho.x.toFixed(2) + 'px');
    raiz.style.setProperty('--olhar-y', olho.y.toFixed(2) + 'px');
    if (Math.abs(alvo.x - olho.x) + Math.abs(alvo.y - olho.y) > .05 && !document.hidden) requestAnimationFrame(passo);
    else andando = false;
  }
  window.addEventListener('pointermove', function (e) {
    if (reduz.matches || e.pointerType === 'touch') return;
    alvo.x = (.5 - e.clientX / window.innerWidth) * 26;
    alvo.y = (.5 - e.clientY / window.innerHeight) * 14;
    if (!andando) { andando = true; requestAnimationFrame(passo); }
  }, { passive: true });

  /* ---------- figurinhas ---------- */
  var F = window.FIGURINHAS || {};
  var camada = $('#figurinhas'), palco = $('#palco');
  /* por parte do material: Londres, o detetive, o caso, o desfecho */
  var GRUPOS = [
    ['big-ben', 'cha', 'onibus', 'guarda-chuva', 'cabine', 'corvo', 'ponte', 'coroa', 'carruagem', 'correio', 'lampiao', 'capacete', 'globo'],
    ['coruja', 'chapeu', 'lupa', 'cachimbo', 'caderno', 'violino', 'chave', 'porta', 'lanterna', 'relogio', 'vela', 'raio'],
    ['pizza', 'pegadas', 'carta', 'lupa', 'algemas', 'corvo', 'lanterna', 'capacete', 'chave', 'lampiao', 'relogio', 'caderno'],
    ['consulta', 'coruja', 'azevinho', 'pizza', 'pudim', 'raio', 'guirlanda', 'carimbo', 'bengala', 'presente', 'globo', 'chapeu']
  ];
  var MARCOS = ['parte2', 'noite', 'consultas'];            /* onde cada parte começa */
  var FIXAS = {
    capa: ['porta', 'coruja', 'big-ben'], noite: ['pizza', 'lampiao', 'pegadas'],
    resolvido: ['carimbo', 'pizza', 'algemas'], obrigado: ['presente', 'guirlanda', 'raio']
  };
  /* lugares na borda da folha (centro, em px do palco de 1920 x 1080) */
  var LADO_E = [{ x: -4, y: 190 }, { x: -4, y: 440 }, { x: -4, y: 690 }, { x: -4, y: 905 }];
  var LADO_D = [{ x: 1924, y: 170 }, { x: 1924, y: 420 }, { x: 1924, y: 665 }, { x: 1924, y: 890 }];
  var CANTOS = [{ x: 40, y: 34 }, { x: 1880, y: 34 }, { x: 1886, y: 1040 }];   /* o canto de baixo à esquerda é da carruagem */

  function semente(t) { var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function sorteio(s) { return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function embaralhar(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* o que já ocupa a folha: textos, imagens e desenhos do slide, em px do palco */
  function ocupado(el) {
    var base = palco.getBoundingClientRect(), k = base.width / 1920, caixas = [];
    var nos = el.querySelectorAll('h1,h2,h3,h4,p,li,pre,code,figure,img,svg,table,dt,dd,blockquote,model-viewer,.selo,.pasta,.nota,.codigo');
    for (var i = 0; i < nos.length; i++) {
      if (nos[i].closest('.cantos')) continue;
      var r = nos[i].getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      caixas.push([(r.left - base.left) / k, (r.top - base.top) / k, (r.right - base.left) / k, (r.bottom - base.top) / k]);
    }
    return caixas;
  }
  function livre(p, lado, caixas) {
    var m = lado / 2 - 14;                                   /* as pontas da figurinha são vazias */
    for (var i = 0; i < caixas.length; i++) {
      var c = caixas[i];
      if (p.x + m > c[0] && p.x - m < c[2] && p.y + m > c[1] && p.y - m < c[3]) return false;
    }
    return true;
  }
  function escolher(id) {
    var e = D.estado(), orig = e.original, i = orig.indexOf(id);
    if (FIXAS[id]) return FIXAS[id];
    var g = 0, ini = 0;
    MARCOS.forEach(function (m, n) { var p = orig.indexOf(m); if (p >= 0 && i >= p) { g = n + 1; ini = p; } });
    var lista = GRUPOS[g], j = Math.max(0, i - ini);
    return [lista[(j * 2) % lista.length], lista[(j * 2 + 1) % lista.length]];
  }

  /* O lugar de cada figurinha é medido uma vez para todos os slides, com a página parada: medir
     na hora da troca pegaria o slide no meio da animação de virar a folha. */
  var memoria = {};                                          /* id -> figurinhas já posicionadas */
  function planejar(id) {
    if (memoria[id]) return memoria[id];
    var el = palco.querySelector('.slide[data-id="' + id + '"]');
    var r = sorteio(semente(id)), caixas = el ? ocupado(el) : [], nomes = escolher(id).filter(function (n) { return F[n]; });
    var filas = [embaralhar(LADO_E, r), embaralhar(LADO_D, r), embaralhar(CANTOS, r)];
    if (r() < .5) filas = [filas[1], filas[0], filas[2]];
    var usados = [], plano = [];
    nomes.forEach(function (nome, n) {
      var m = F[nome], lado = 162 + Math.round(r() * 34), larg = m[0] >= m[1] ? lado : Math.round(lado * m[0] / m[1]);
      var fila = filas[n % filas.length].concat(filas[(n + 1) % filas.length], filas[(n + 2) % filas.length]), lugar = null;
      for (var q = 0; q < fila.length && !lugar; q++) {
        if (usados.indexOf(fila[q]) < 0 && livre(fila[q], lado, caixas)) lugar = fila[q];
      }
      if (!lugar) return;
      usados.push(lugar);
      plano.push({ nome: nome, x: lugar.x + Math.round((r() - .5) * 12), y: lugar.y + Math.round((r() - .5) * 26), w: larg, r: Math.round((r() - .5) * 28) });
    });
    memoria[id] = plano;
    return plano;
  }

  var idNaTela = null;
  function colar() {
    if (!camada) return;
    var id = D.estado().id;
    if (id === idNaTela) return;
    idNaTela = id;
    var velhas = Array.prototype.slice.call(camada.children);
    velhas.forEach(function (v) {
      if (reduz.matches) { v.remove(); return; }
      v.className = 'fig fig--saindo';
      setTimeout(function () { v.remove(); }, 230);
    });
    planejar(id).forEach(function (p, n) {
      var im = document.createElement('img'), m = F[p.nome];
      im.className = 'fig' + (reduz.matches ? '' : ' fig--entrando');
      im.src = 'img/fig-' + p.nome + '.webp'; im.alt = ''; im.draggable = false;
      im.width = m[0]; im.height = m[1];
      im.style.cssText = 'left:' + p.x + 'px;top:' + p.y + 'px;width:' + p.w + 'px;--r:' + p.r + 'deg;--i:' + n;
      im.addEventListener('animationend', function () { im.classList.remove('fig--entrando', 'fig--toque', 'fig--solta'); });
      camada.appendChild(im);
    });
  }

  /* clicar balança; arrastar muda a figurinha de lugar (só nesta visita ao slide) */
  var pega = null;
  if (camada) {
    camada.addEventListener('pointerdown', function (e) {
      var im = e.target.closest ? e.target.closest('.fig') : null;
      if (!im || e.button > 0) return;
      e.preventDefault();
      pega = { im: im, id: e.pointerId, x0: e.clientX, y0: e.clientY, l: parseFloat(im.style.left), t: parseFloat(im.style.top), moveu: false };
      try { im.setPointerCapture(e.pointerId); } catch (err) { /* ponteiro sintético */ }
    });
    camada.addEventListener('pointermove', function (e) {
      if (!pega || e.pointerId !== pega.id) return;
      var k = palco.getBoundingClientRect().width / 1920, dx = (e.clientX - pega.x0) / k, dy = (e.clientY - pega.y0) / k;
      if (!pega.moveu && Math.abs(dx) + Math.abs(dy) < 6) return;
      if (!pega.moveu) { pega.moveu = true; pega.im.classList.remove('fig--entrando', 'fig--toque', 'fig--solta'); pega.im.classList.add('fig--pega'); }
      pega.im.style.left = Math.max(-80, Math.min(2000, pega.l + dx)) + 'px';
      pega.im.style.top = Math.max(-40, Math.min(1120, pega.t + dy)) + 'px';
    });
    var soltar = function (e) {
      if (!pega || e.pointerId !== pega.id) return;
      var im = pega.im, moveu = pega.moveu; pega = null;
      im.classList.remove('fig--pega');
      if (reduz.matches) return;
      im.classList.remove('fig--toque', 'fig--solta');
      void im.offsetWidth;
      im.classList.add(moveu ? 'fig--solta' : 'fig--toque');
    };
    camada.addEventListener('pointerup', soltar);
    camada.addEventListener('pointercancel', soltar);
  }

  function planejarTudo() {
    memoria = {};
    D.estado().original.forEach(planejar);
  }
  function aoTrocar() { viagem(); colar(); }
  new MutationObserver(aoTrocar).observe(document.body, { attributes: true, attributeFilter: ['data-slide'] });
  planejarTudo();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {                  /* com as fontes no lugar, o texto pode ter mudado de tamanho */
      var parado = !$('.slide.entrando, .slide.saindo', palco);
      if (!parado) return;
      planejarTudo(); idNaTela = null; colar();
    });
  }

  /* ---------- a abertura ---------- */
  var entrada = $('#entrada'), estado = 'dentro';
  var avancarDoDeck = D.avancar;
  D.avancar = function () { if (estado === 'fora') abrir(); else if (estado === 'dentro') avancarDoDeck(); };

  function travar(sim) {
    [palco, $('#barra'), camada].forEach(function (el) { if (el) { if (sim) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } });
  }
  function terminar() {
    if (estado === 'dentro') return;
    estado = 'dentro';
    raiz.classList.remove('com-entrada');
    entrada.className = 'entrada';
    travar(false);
    document.removeEventListener('keydown', teclaNaPorta, true);
    if (document.activeElement && entrada.contains(document.activeElement)) document.activeElement.blur();
    var s = $('.slide.ativa', palco);                         /* a capa entra como se o slide acabasse de abrir */
    if (s && !reduz.matches) {
      s.classList.remove('entrando'); void s.offsetWidth; s.classList.add('entrando');
      setTimeout(function () { s.classList.remove('entrando'); }, 1600);
    }
    idNaTela = null; colar();
  }
  function abrir(rapido) {
    if (estado !== 'fora') return;
    estado = 'abrindo';
    if (rapido || reduz.matches) {
      entrada.classList.add('entrada--some');
      setTimeout(terminar, 240);
      return;
    }
    entrada.classList.add('entrada--batendo');
    setTimeout(function () {
      entrada.classList.remove('entrada--batendo');
      entrada.classList.add('entrada--abrindo');
      setTimeout(terminar, 1650);
    }, 360);
  }
  function teclaNaPorta(e) {
    if (estado === 'dentro') return;
    if (e.key === 'f' || e.key === 'F' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Tab') return;                              /* o Tab anda entre a porta e o Pular */
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); abrir(true); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); abrir(); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      var b = e.target && e.target.closest ? e.target.closest('button') : null;
      if (b && entrada.contains(b)) return;                    /* o botão em foco cuida do clique */
      e.preventDefault(); abrir();
    }
  }

  if (entrada && raiz.classList.contains('com-entrada')) {
    estado = 'fora';
    travar(true);
    document.addEventListener('keydown', teclaNaPorta, true);
    $('#entrada-porta').addEventListener('click', function () { abrir(); });
    $('#entrada-dica').addEventListener('click', function () { abrir(); });
    $('#entrada-pular').addEventListener('click', function () { abrir(true); });
    var rua = $('.entrada__rua', entrada);
    rua.addEventListener('error', function () { abrir(true); });
    if (rua.complete && !rua.naturalWidth) abrir(true);
    try { $('#entrada-porta').focus({ preventScroll: true }); } catch (err) { /* sem foco: segue */ }
  }

  window.LONDRES = { pronta: true, abrir: abrir, naPorta: function () { return estado !== 'dentro'; } };
  aoTrocar();
})();
