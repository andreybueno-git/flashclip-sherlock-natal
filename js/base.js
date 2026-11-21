/* Ajudantes para escrever os slides. Cada slide tem um id fixo (é o que guarda a ordem escolhida).
   folha(...) = página do caderno do caso, sobre a mesa.  cena(...) = cena de rua, noite em Londres. */
(function () {
  'use strict';

  window.SLIDES = [];

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Colore um trecho de Prolog. Variáveis (inicial maiúscula) ganham destaque próprio. */
  var RE = /(%.*$)|(\?-|:-)|("[^"]*")|\b([A-Z_][A-Za-z0-9_]*)\b|\b([a-z][A-Za-z0-9_]*)(?=\()|([(),.;])/gm;
  function pintar(src) {
    var out = '', i = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(src))) {
      out += esc(src.slice(i, m.index));
      var c = m[1] ? 'c' : m[2] ? 'op' : m[3] ? 'str' : m[4] ? 'var' : m[5] ? 'pred' : 'pt';
      out += '<span class="t-' + c + '">' + esc(m[0]) + '</span>';
      i = m.index + m[0].length;
    }
    return out + esc(src.slice(i));
  }

  /* Prolog em linha */
  window.pl = function (src, cru) {
    return '<code class="pl">' + (cru ? esc(src) : pintar(src)) + '</code>';
  };

  /* Bloco de código. op: {rotulo, cru, classe, passos:[n por linha]} */
  window.bloco = function (src, op) {
    op = op || {};
    var linhas = src.replace(/^\n|\n\s*$/g, '').split('\n');
    var corpo = linhas.map(function (l, i) {
      var p = op.passos && op.passos[i] ? ' data-passo="' + op.passos[i] + '"' : '';
      var marca = op.marca && op.marca.indexOf(i) >= 0 ? ' ln--nova' : '';
      return '<span class="ln' + marca + '"' + p + '>' + (l.trim() === '' ? '&nbsp;' : (op.cru ? esc(l) : pintar(l))) + '</span>';
    }).join('');
    return '<figure class="codigo ' + (op.classe || '') + '">' +
      (op.rotulo ? '<figcaption class="codigo__rotulo">' + op.rotulo + '</figcaption>' : '') +
      '<pre>' + corpo + '</pre></figure>';
  };

  /* Bilhete de aviso: rótulo curto em caixa alta + frase */
  window.nota = function (rotulo, texto, extra) {
    return '<p class="nota"' + (extra || '') + '><b class="nota__r">' + rotulo + '</b><span>' + texto + '</span></p>';
  };

  window.icone = function (nome, classe) { return window.ARTE.usar(nome, classe); };

  var SELOS = {
    aula: '<span class="selo selo--aula">Exemplo de aula</span>',
    caso: '<span class="selo selo--caso">A noite do crime</span>'
  };
  window.SELOS = SELOS;

  window.folha = function (id, o) {
    o.id = id; o.tipo = 'folha';
    o.html =
      '<div class="folha ' + (o.classe || '') + '">' +
      '<header class="cab"><p class="kicker">' + o.kicker + '</p>' + (o.selo ? SELOS[o.selo] : '') + '</header>' +
      '<h2 class="titulo' + (o.longo ? ' titulo--longo' : '') + '">' + o.titulo + '</h2>' +
      '<div class="corpo ' + (o.arranjo || '') + '">' + o.corpo + '</div>' +
      '<footer class="pe"><span class="pe__marca">FlashClip · Edição de Natal</span><span class="pe__enfeite" aria-hidden="true">' + window.ARTE.usar('azevinho') + '</span><span class="pe__num"></span></footer>' +
      '</div>';
    window.SLIDES.push(o);
  };

  window.cena = function (id, o) {
    o.id = id; o.tipo = 'cena';
    o.html = '<div class="cena ' + (o.classe || '') + '">' +
      '<p class="cena__topo" aria-hidden="true"><span>FlashClip</span><b>Edição de Natal</b><span>Do algoritmo ao Prolog</span></p>' +
      o.corpo + '</div>';
    window.SLIDES.push(o);
  };
})();
