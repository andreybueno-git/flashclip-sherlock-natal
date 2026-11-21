/* Página do celular: entra na sala com um apelido e responde. Não decide pontuação: só mostra
   o que a tela do apresentador publica. */
(function () {
  'use strict';
  var cfg = window.QUIZ_CONFIG || {};
  var par = new URLSearchParams(location.search);
  var modo = par.get('t') === 'local' ? 'local' : 'mqtt';
  var sala = (par.get('s') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  var corretor = parseInt(par.get('b'), 10) || 0;
  var $ = function (id) { return document.getElementById(id); };
  var LETRAS = ['A', 'B', 'C', 'D'];
  var TELAS = ['t-codigo', 't-entrar', 't-espera', 't-pergunta', 't-resultado', 't-fim', 't-fora'];
  var CHAVE = 'fcsh1:jogador:' + sala;

  var eu = null, resp = null, S = null, T = null, tela = '';
  var tEntrada = null, tResposta = null, tVigia = null, prazo = 0, nDesenhada = -2;

  try { var g = JSON.parse(sessionStorage.getItem(CHAVE)); if (g && g.eu) { eu = g.eu; resp = g.resp || null; } } catch (e) { eu = null; }
  function guardar() { try { sessionStorage.setItem(CHAVE, JSON.stringify({ eu: eu, resp: resp })); } catch (e) { /* segue sem guardar */ } }

  function mostrar(id) {
    if (tela === id) return;
    tela = id;
    TELAS.forEach(function (t) { $(t).hidden = t !== id; });
  }
  function novoId() {
    var a = 'abcdefghijklmnopqrstuvwxyz0123456789', r = new Uint32Array(10), s = '';
    crypto.getRandomValues(r);
    for (var i = 0; i < 10; i++) s += a[r[i] % a.length];
    return s;
  }
  function eu_no(estado) {
    if (!eu || !estado) return null;
    for (var i = 0; i < estado.j.length; i++) if (estado.j[i][0] === eu.id) return { pos: i + 1, v: estado.j[i] };
    return null;
  }

  /* ---------- ligação ---------- */
  function ligar() {
    if (T) T.fechar();
    T = window.QuizTransporte({
      sala: sala, modo: modo, corretor: corretor, fixo: true,
      aoEstado: function (txt, ok) { var c = $('conexao'); c.textContent = ok && !S ? 'Procurando a sala…' : txt; c.classList.toggle('ok', ok && !!S); },
      aoConectar: function () { if (eu && !eu_no(S)) mandarEntrada(); }
    });
    T.assinar('e', aoEstado);
    /* se a sala não aparecer neste serviço, tenta o seguinte */
    clearTimeout(tVigia);
    if (modo === 'mqtt' && (cfg.corretores || []).length > 1) {
      tVigia = setTimeout(function () {
        if (S) return;
        corretor = (corretor + 1) % cfg.corretores.length;
        ligar();
      }, 7000);
    }
  }

  function aoEstado(sufixo, d) {
    if (!d || d.v !== 1 || !Array.isArray(d.j)) return;
    if (S && d.seq < S.seq && d.fase === S.fase && d.n === S.n) return;
    S = d;
    $('conexao').textContent = 'Conectado'; $('conexao').classList.add('ok');
    desenhar();
  }

  function mandarEntrada() {
    if (!eu || !T) return;
    T.publicar('j/' + eu.id, { a: eu.a });
    clearTimeout(tEntrada);
    tEntrada = setTimeout(function () { if (!eu_no(S)) mandarEntrada(); }, 2000);
  }
  function mandarResposta() {
    if (!eu || !resp || !T || !S || S.fase !== 'pergunta' || resp.n !== S.n) return;
    T.publicar('r/' + eu.id, { n: resp.n, o: resp.o });
    clearTimeout(tResposta);
    tResposta = setTimeout(function () { var m = eu_no(S); if (m && !m.v[5]) mandarResposta(); }, 1500);
  }

  /* ---------- telas ---------- */
  function desenharPergunta(m) {
    var q = S.q, ol = $('c-opcoes');
    if (nDesenhada !== S.n) {
      nDesenhada = S.n;
      $('c-qual').textContent = 'Pergunta ' + (S.n + 1) + ' de ' + S.total;
      $('c-pergunta').textContent = q.t;
      ol.textContent = '';
      q.o.forEach(function (txt, i) {
        var li = document.createElement('li'), b = document.createElement('button');
        b.type = 'button'; b.className = 'op op--' + i;
        var l = document.createElement('b'); l.textContent = LETRAS[i];
        var s = document.createElement('span'); s.textContent = txt;
        b.appendChild(l); b.appendChild(s);
        b.addEventListener('click', function () { escolher(i); });
        li.appendChild(b); ol.appendChild(li);
      });
    }
    prazo = performance.now() + S.rest;
    var respondeu = (resp && resp.n === S.n) || m.v[5] === 1;
    Array.prototype.forEach.call(ol.querySelectorAll('button'), function (b, i) {
      b.disabled = respondeu;
      b.classList.toggle('op--minha', !!(resp && resp.n === S.n && resp.o === i));
    });
    $('c-enviada').hidden = !respondeu;
    $('c-enviada').textContent = 'Resposta enviada. Agora é esperar o telão.';
    tique();
  }
  function escolher(i) {
    if (!S || S.fase !== 'pergunta' || (resp && resp.n === S.n)) return;
    resp = { n: S.n, o: i }; guardar();
    mandarResposta();
    desenhar();
  }
  function tique() {
    if (tela !== 't-pergunta' || !S || S.fase !== 'pergunta') return;
    var rest = Math.max(0, prazo - performance.now());
    $('c-tempo').style.transform = 'scaleX(' + Math.min(1, rest / S.dur) + ')';
    if (rest <= 0 && !(resp && resp.n === S.n)) {
      Array.prototype.forEach.call($('c-opcoes').querySelectorAll('button'), function (b) { b.disabled = true; });
      $('c-enviada').hidden = false; $('c-enviada').textContent = 'O tempo acabou.';
    }
  }
  setInterval(tique, 120);

  function ordinal(n) { return n + 'º'; }
  function desenhar() {
    if (!sala) { mostrar('t-codigo'); return; }
    if (S && eu && S.x && S.x.indexOf(eu.id) >= 0) { mostrar('t-fora'); return; }
    var m = eu_no(S);
    if (!eu || !m) {
      mostrar('t-entrar');
      var b = $('form-apelido').querySelector('button');
      b.disabled = !!eu; b.textContent = eu ? 'Entrando…' : 'Entrar';
      if (eu) $('campo-apelido').value = eu.a;
      return;
    }
    if (S.fase === 'sala') {
      mostrar('t-espera'); $('meu-nome').textContent = m.v[1];
    } else if (S.fase === 'pergunta' && S.q) {
      mostrar('t-pergunta'); desenharPergunta(m);
    } else if (S.fase === 'resposta' && S.q) {
      mostrar('t-resultado');
      var ok = m.v[4];
      $('r-selo').textContent = 'Pergunta ' + (S.n + 1) + ' de ' + S.total;
      $('r-titulo').textContent = ok === 1 ? 'Acertou!' : ok === 0 ? 'Não foi dessa vez' : 'Sem resposta';
      $('t-resultado').dataset.ok = ok;
      $('r-certa').textContent = 'Resposta certa: ' + S.q.o[S.certa];
      $('r-pontos').textContent = m.v[2];
      $('r-ganho').textContent = m.v[3] ? '(+' + m.v[3] + ')' : '';
      $('r-pos').textContent = 'Você está em ' + ordinal(m.pos) + ' de ' + S.j.length;
    } else if (S.fase === 'fim') {
      mostrar('t-fim');
      $('f-pos').textContent = 'Você ficou em ' + ordinal(m.pos) + ' lugar';
      $('f-pontos').textContent = m.v[2];
    }
  }

  /* ---------- partida ---------- */
  $('form-codigo').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var c = $('campo-codigo').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 6) { $('campo-codigo').focus(); return; }
    var u = new URL(location.href);
    u.searchParams.set('s', c);
    location.href = u.href;
  });
  $('form-apelido').addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (eu) return;
    var a = $('campo-apelido').value.replace(/\s+/g, ' ').trim().slice(0, 16);
    if (!a) { $('campo-apelido').focus(); return; }
    eu = { id: novoId(), a: a }; guardar();
    mandarEntrada();
    desenhar();
  });

  window.QUIZ_JOGADOR = { estado: function () { return { eu: eu, resp: resp, tela: tela, fase: S && S.fase, n: S && S.n }; } };
  if (sala) ligar(); else $('conexao').textContent = '';
  desenhar();
})();
