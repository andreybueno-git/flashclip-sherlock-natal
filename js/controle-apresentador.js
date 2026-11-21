/* Controle pelo celular (lado da apresentação). Opcional: só liga quando se abre o painel
   "Celular". Mostra um QR code; o celular que abrir a página passa a avançar e voltar os slides.
   Usa a mesma ligação do quiz (serviço público de mensagens, sem conta). */
(function () {
  'use strict';
  var CHAVE = 'fcsh1:controle', CHAVE_URL = 'fcsh1:urlJogador';
  var $ = function (id) { return document.getElementById(id); };
  var par = new URLSearchParams(location.search);
  var modo = par.get('t') === 'local' ? 'local' : 'mqtt';
  var painel = $('controle'), T = null, C = null, vistos = [], tBatida = null, carregando = null;

  function ler() { try { var c = JSON.parse(localStorage.getItem(CHAVE)); return c && c.sala ? c : null; } catch (e) { return null; } }
  function guardar() { try { if (C) localStorage.setItem(CHAVE, JSON.stringify(C)); else localStorage.removeItem(CHAVE); } catch (e) { /* segue sem guardar */ } }
  function codigo() {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = new Uint32Array(6), s = '';
    crypto.getRandomValues(r);
    for (var i = 0; i < 6; i++) s += a[r[i] % a.length];
    return s;
  }

  function carregarScripts() {
    if (carregando) return carregando;
    var lista = ['js/quiz-config.js', 'js/quiz-transporte.js'];
    if (modo === 'mqtt') lista.unshift('vendor/mqtt.min.js');
    carregando = lista.reduce(function (p, src) {
      return p.then(function () {
        return new Promise(function (ok, erro) {
          var s = document.createElement('script');
          s.src = src; s.onload = ok; s.onerror = function () { erro(new Error(src)); };
          document.head.appendChild(s);
        });
      });
    }, Promise.resolve());
    return carregando;
  }

  function urlBase() {
    var salvo = null;
    try { salvo = localStorage.getItem(CHAVE_URL); } catch (e) { salvo = null; }
    return new URL('controle.html', salvo || (window.QUIZ_CONFIG && window.QUIZ_CONFIG.urlJogador) || location.href.split(/[?#]/)[0]).href;
  }
  function urlCelular() {
    var u = new URL(urlBase());
    u.search = ''; u.hash = '';
    u.searchParams.set('s', C.sala);
    if (modo === 'local') u.searchParams.set('t', 'local'); else u.searchParams.set('b', T ? T.corretor : 0);
    return u.href;
  }
  function soNesteComputador() {
    var u = new URL(urlBase());
    return u.protocol === 'file:' || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(u.hostname);
  }

  function publicar() {
    if (!T || !window.DECK) return;
    var d = window.DECK.info(); d.v = 1;
    T.publicar('p', d, true);
  }
  function comando(sufixo, d) {
    if (!d || !d.k || vistos.indexOf(d.k) >= 0) return;
    vistos.push(d.k); if (vistos.length > 40) vistos.shift();
    if (window.DECK.organizando()) return;
    if (d.a === 'avancar') window.DECK.avancar();
    else if (d.a === 'voltar') window.DECK.voltar();
    $('controle-estado').textContent = 'Celular ligado: recebendo comandos.';
  }

  function desenhar() {
    if (!C || !T) return;
    var u = urlCelular(), curto = new URL(u);
    $('controle-qr').innerHTML = window.FLASHCLIP_QR(u);
    $('controle-url').textContent = curto.host + curto.pathname + ' · código ' + C.sala;
    $('controle-aviso').hidden = !(soNesteComputador() && modo !== 'local');
    $('b-controle').classList.add('ligado');
  }

  function ligar() {
    return carregarScripts().then(function () {
      if (!C) { C = { sala: codigo() }; guardar(); }
      if (T) T.fechar();
      T = window.QuizTransporte({
        sala: 'c' + C.sala, modo: modo, corretor: 0,
        aoEstado: function (txt, ok) { $('controle-estado').textContent = ok ? 'Pronto. Aponte a câmera do celular para o código.' : txt; },
        aoConectar: function () { desenhar(); publicar(); }
      });
      T.assinar('c', comando);
      window.DECK.aoMudar = publicar;
      clearInterval(tBatida);
      tBatida = setInterval(publicar, 5000);
      desenhar(); publicar();
    }).catch(function () {
      $('controle-estado').textContent = 'Não consegui carregar a ligação. Confira a internet e tente de novo.';
    });
  }
  function desligar() {
    if (T) { T.publicar('p', null, true); T.fechar(); T = null; }
    clearInterval(tBatida);
    if (window.DECK) window.DECK.aoMudar = null;
    C = null; guardar();
    $('controle-qr').textContent = ''; $('controle-url').textContent = '';
    $('controle-estado').textContent = 'Controle desligado.';
    $('b-controle').classList.remove('ligado');
  }

  function abrir() {
    painel.hidden = false;
    $('controle-fechar').focus();
    if (!T) ligar();
  }
  function fechar() { painel.hidden = true; $('b-controle').focus(); }

  $('b-controle').addEventListener('click', abrir);
  $('controle-fechar').addEventListener('click', fechar);
  $('controle-desligar').addEventListener('click', desligar);
  $('controle-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var campo = $('controle-campo'), v = campo.value.trim(), u;
    try { u = new URL(v); if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('protocolo'); }
    catch (e) { campo.setCustomValidity('Cole o endereço completo, começando com https://'); campo.reportValidity(); return; }
    if (!/\.html?$/.test(u.pathname) && u.pathname.slice(-1) !== '/') u.pathname += '/';
    try { localStorage.setItem(CHAVE_URL, u.href); } catch (e) { /* vale só até fechar */ }
    desenhar();
  });
  $('controle-campo').addEventListener('input', function () { this.setCustomValidity(''); });

  window.addEventListener('keydown', function (ev) {
    if (!painel.hidden) {
      if (ev.key === 'Escape') { ev.preventDefault(); fechar(); }
      if (!ev.target.closest || !ev.target.closest('input, button')) ev.stopPropagation();
      else if (ev.key !== 'Tab') ev.stopPropagation();
      return;
    }
    if ((ev.key === 'c' || ev.key === 'C') && !ev.metaKey && !ev.ctrlKey && !ev.altKey && window.DECK && !window.DECK.organizando() && $('ajuda').hidden) {
      ev.preventDefault(); ev.stopPropagation(); abrir();
    }
  }, true);

  /* se o controle já estava ligado nesta máquina, religa sozinho ao reabrir a apresentação */
  C = ler();
  if (C) ligar();
})();
