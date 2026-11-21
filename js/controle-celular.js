/* Controle dos slides no celular: manda "avançar" e "voltar" para a apresentação e mostra
   em que slide ela está. */
(function () {
  'use strict';
  var cfg = window.QUIZ_CONFIG || {};
  var par = new URLSearchParams(location.search);
  var modo = par.get('t') === 'local' ? 'local' : 'mqtt';
  var sala = (par.get('s') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  var corretor = parseInt(par.get('b'), 10) || 0;
  var $ = function (id) { return document.getElementById(id); };
  var T = null, P = null, tVigia = null, trava = null;

  function chave() {
    var r = new Uint32Array(2); crypto.getRandomValues(r);
    return r[0].toString(36) + r[1].toString(36);
  }

  function ligar() {
    if (T) T.fechar();
    T = window.QuizTransporte({
      sala: 'c' + sala, modo: modo, corretor: corretor, fixo: true,
      aoEstado: function (txt, ok) { var c = $('conexao'); c.textContent = ok && !P ? 'Procurando…' : txt; c.classList.toggle('ok', ok && !!P); }
    });
    T.assinar('p', function (sufixo, d) {
      if (!d || d.v !== 1) return;
      P = d;
      $('conexao').textContent = 'Ligado'; $('conexao').classList.add('ok');
      desenhar();
    });
    clearTimeout(tVigia);
    if (modo === 'mqtt' && (cfg.corretores || []).length > 1) {
      tVigia = setTimeout(function () {
        if (P) return;
        corretor = (corretor + 1) % cfg.corretores.length;
        ligar();
      }, 7000);
    }
  }

  function desenhar() {
    if (!sala) { $('t-codigo').hidden = false; $('t-controle').hidden = true; return; }
    $('t-codigo').hidden = true; $('t-controle').hidden = false;
    if (!P) return;
    $('ctl-pos').textContent = 'Slide ' + P.i + ' de ' + P.total;
    $('ctl-titulo').textContent = P.t;
    $('ctl-etapa').textContent = P.passos ? 'Etapa ' + P.etapa + ' de ' + P.passos + ' neste slide' : '';
    $('ctl-prox').textContent = P.prox ? 'Depois: ' + P.prox : 'Este é o último slide.';
    $('ctl-avancar').disabled = P.i === P.total && P.etapa === P.passos;
    $('ctl-voltar').disabled = P.i === 1 && P.etapa === 0;
  }

  function mandar(a) {
    if (!T) return;
    T.publicar('c', { a: a, k: chave() });
    if (navigator.vibrate) navigator.vibrate(12);
  }

  /* mantém a tela do celular acesa enquanto o controle está aberto, quando o aparelho deixa */
  function acender() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    navigator.wakeLock.request('screen').then(function (t) { trava = t; }).catch(function () { trava = null; });
  }

  $('ctl-avancar').addEventListener('click', function () { mandar('avancar'); });
  $('ctl-voltar').addEventListener('click', function () { mandar('voltar'); });
  $('form-codigo').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var c = $('campo-codigo').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 6) { $('campo-codigo').focus(); return; }
    var u = new URL(location.href);
    u.searchParams.set('s', c);
    location.href = u.href;
  });
  document.addEventListener('visibilitychange', acender);

  window.CONTROLE_CELULAR = { estado: function () { return P; } };
  if (sala) { ligar(); acender(); } else $('conexao').textContent = '';
  desenhar();
})();
