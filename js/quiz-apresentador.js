/* Tela do apresentador do quiz: cria a sala, mostra o QR code, conduz as perguntas e calcula o placar.
   Toda a pontuação é decidida aqui; o celular só manda o apelido e a opção escolhida. */
(function () {
  'use strict';
  var cfg = window.QUIZ_CONFIG, BANCO = window.QUIZ_PERGUNTAS;
  var par = new URLSearchParams(location.search);
  var modo = par.get('t') === 'local' ? 'local' : 'mqtt';
  var CHAVE = 'fcsh1:apresentador:' + modo, CHAVE_URL = 'fcsh1:urlJogador';
  var $ = function (id) { return document.getElementById(id); };
  var LETRAS = ['A', 'B', 'C', 'D'];

  function codigo() {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = new Uint32Array(6), s = '';
    crypto.getRandomValues(r);
    for (var i = 0; i < 6; i++) s += a[r[i] % a.length];
    return s;
  }
  function nova() {
    return { sala: codigo(), corretor: 0, fase: 'sala', n: -1, perguntas: [], jog: {}, fora: {}, dur: cfg.tempoPadrao * 1000, fimEm: 0, seq: 0, quantas: Math.min(cfg.perguntasPadrao, BANCO.length) };
  }
  function carregar() { try { var e = JSON.parse(sessionStorage.getItem(CHAVE)); return e && e.sala ? e : null; } catch (err) { return null; } }
  function guardar() { try { sessionStorage.setItem(CHAVE, JSON.stringify(E)); } catch (err) { /* segue sem guardar */ } }

  var E = carregar() || nova();
  var T = null;

  /* ---------- ligação ---------- */
  function ligar() {
    if (T) T.fechar();
    T = window.QuizTransporte({
      sala: E.sala, modo: modo, corretor: E.corretor,
      aoEstado: function (txt, ok) {
        var c = $('conexao');
        c.textContent = txt; c.classList.toggle('ok', ok);
        if (T && T.corretor !== E.corretor) { E.corretor = T.corretor; guardar(); desenharSala(); }
      },
      aoConectar: function () {
        if (T.corretor !== E.corretor) { E.corretor = T.corretor; guardar(); }
        desenharSala(); publicar();
      }
    });
    T.assinar('j/+', entrou);
    T.assinar('r/+', respondeu);
    if (modo === 'local') { desenharSala(); publicar(); }
  }

  function idValido(id) { return /^[a-z0-9]{6,16}$/.test(id); }
  function limparApelido(a) {
    a = String(a == null ? '' : a).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
    return a || 'Detetive';
  }
  function entrou(sufixo, d) {
    var id = sufixo.slice(2);
    if (!idValido(id) || !d) return;
    if (E.fora[id]) { publicarLogo(); return; }
    if (E.jog[id]) { publicarLogo(); return; }
    if (Object.keys(E.jog).length >= 200) return;
    var nome = limparApelido(d.a), base = nome, k = 2;
    var usados = Object.keys(E.jog).map(function (x) { return E.jog[x].a.toLowerCase(); });
    while (usados.indexOf(nome.toLowerCase()) >= 0) nome = base.slice(0, 13) + ' ' + (k++);
    E.jog[id] = { a: nome, p: 0, g: 0, ok: null, rn: -1, ro: -1, rt: 0, ord: Object.keys(E.jog).length };
    guardar(); desenhar(); publicarLogo();
  }
  function respondeu(sufixo, d) {
    var id = sufixo.slice(2), j = E.jog[id];
    if (!j || !d || E.fase !== 'pergunta' || d.n !== E.n) return;
    if (j.rn === E.n) { publicarLogo(); return; }
    var o = Number(d.o);
    if (!(o >= 0 && o <= 3) || o !== Math.floor(o)) return;
    var rest = E.fimEm - Date.now();
    if (rest < -1500) return;
    j.rn = E.n; j.ro = o; j.rt = Math.max(0, rest);
    guardar(); desenharContagem(); publicarLogo();
    var todos = Object.keys(E.jog).every(function (x) { return E.jog[x].rn === E.n; });
    if (todos) setTimeout(function () { if (E.fase === 'pergunta') revelar(); }, 500);
  }

  /* ---------- estado enviado aos celulares ---------- */
  function ranking() {
    return Object.keys(E.jog).map(function (id) { var j = E.jog[id]; return { id: id, j: j }; })
      .sort(function (a, b) { return b.j.p - a.j.p || a.j.ord - b.j.ord; });
  }
  function publicar() {
    if (!T) return;
    var q = E.perguntas[E.n], emJogo = E.fase === 'pergunta' || E.fase === 'resposta';
    T.publicar('e', {
      v: 1, seq: ++E.seq, fase: E.fase, n: E.n, total: E.perguntas.length, dur: E.dur,
      rest: E.fase === 'pergunta' ? Math.max(0, E.fimEm - Date.now()) : 0,
      q: emJogo && q ? { t: q.t, o: q.o } : null,
      certa: E.fase === 'resposta' && q ? q.c : null,
      j: ranking().map(function (r) { var j = r.j; return [r.id, j.a, j.p, j.g, j.ok === true ? 1 : j.ok === false ? 0 : -1, j.rn === E.n ? 1 : 0]; }),
      x: Object.keys(E.fora)
    }, true);
  }
  var tPub = null;
  function publicarLogo() { clearTimeout(tPub); tPub = setTimeout(publicar, 120); }

  /* ---------- condução ---------- */
  function embaralhar(v) {
    for (var i = v.length - 1; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)), t = v[i]; v[i] = v[k]; v[k] = t; }
    return v;
  }
  function comecar() {
    if (!Object.keys(E.jog).length) return;
    E.quantas = Number($('quantas').value); E.dur = Number($('tempo').value) * 1000;
    E.perguntas = BANCO.slice(0, E.quantas).map(function (q) {
      var ord = embaralhar([0, 1, 2, 3]);
      return { t: q.t, o: ord.map(function (i) { return q.o[i]; }), c: ord.indexOf(0) };
    });
    Object.keys(E.jog).forEach(function (id) { var j = E.jog[id]; j.p = 0; j.g = 0; j.ok = null; j.rn = -1; });
    E.n = -1;
    proxima();
  }
  function proxima() {
    E.n++;
    if (E.n >= E.perguntas.length) E.fase = 'fim';
    else {
      E.fase = 'pergunta'; E.fimEm = Date.now() + E.dur;
      Object.keys(E.jog).forEach(function (id) { E.jog[id].g = 0; E.jog[id].ok = null; });
    }
    guardar(); desenhar(); publicar();
  }
  function revelar() {
    var q = E.perguntas[E.n];
    Object.keys(E.jog).forEach(function (id) {
      var j = E.jog[id];
      if (j.rn === E.n && j.ro === q.c) { j.g = 500 + Math.round(500 * Math.min(1, j.rt / E.dur)); j.p += j.g; j.ok = true; }
      else { j.g = 0; j.ok = j.rn === E.n ? false : null; }
    });
    E.fase = 'resposta';
    guardar(); desenhar(); publicar();
  }
  function acao() {
    if (E.fase === 'sala') comecar();
    else if (E.fase === 'pergunta') revelar();
    else if (E.fase === 'resposta') proxima();
  }
  function deNovo() {
    E.fase = 'sala'; E.n = -1; E.perguntas = [];
    Object.keys(E.jog).forEach(function (id) { var j = E.jog[id]; j.p = 0; j.g = 0; j.ok = null; j.rn = -1; });
    guardar(); desenhar(); publicar();
  }
  function novaSala() {
    if (T) { E.fase = 'fim'; T.publicar('e', null, true); }
    E = nova(); guardar(); ligar(); desenhar();
  }

  /* ---------- desenho ---------- */
  function urlBase() {
    var salvo = null;
    try { salvo = localStorage.getItem(CHAVE_URL); } catch (err) { salvo = null; }
    return new URL('jogar.html', salvo || cfg.urlJogador || location.href.split(/[?#]/)[0]).href;
  }
  function urlJogador() {
    var u = new URL(urlBase());
    u.search = ''; u.hash = '';
    u.searchParams.set('s', E.sala);
    if (modo === 'local') u.searchParams.set('t', 'local'); else u.searchParams.set('b', E.corretor);
    return u.href;
  }
  function soNesteComputador() {
    var u;
    try { u = new URL(urlBase()); } catch (err) { return true; }
    return u.protocol === 'file:' || /^(localhost|127\.|\[::1\]|0\.0\.0\.0)/.test(u.hostname);
  }
  function desenharSala() {
    var u = urlJogador(), q = window.qrcode(0, 'M');
    q.addData(u); q.make();
    $('qr').innerHTML = q.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
    var curto = new URL(u);
    $('url').textContent = curto.host + curto.pathname;
    $('codigo').textContent = E.sala;
    $('aviso-local').hidden = !(soNesteComputador() && modo !== 'local');
  }
  function botaoNome(r) {
    var li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.textContent = r.j.a; b.title = 'Tirar ' + r.j.a + ' da sala';
    b.addEventListener('click', function () { E.fora[r.id] = 1; delete E.jog[r.id]; guardar(); desenhar(); publicar(); });
    li.appendChild(b);
    return li;
  }
  function desenharContagem() {
    var ids = Object.keys(E.jog), n = ids.filter(function (id) { return E.jog[id].rn === E.n; }).length;
    $('responderam').textContent = 'Responderam ' + n + ' de ' + ids.length;
  }
  function linhaPlacar(r, pos, comGanho) {
    var li = document.createElement('li');
    var p = document.createElement('span'); p.className = 'pl-pos'; p.textContent = pos + 'º';
    var n = document.createElement('span'); n.className = 'pl-nome'; n.textContent = r.j.a;
    var v = document.createElement('span'); v.className = 'pl-pontos'; v.textContent = r.j.p;
    li.appendChild(p); li.appendChild(n);
    if (comGanho && r.j.g) { var g = document.createElement('span'); g.className = 'pl-ganho'; g.textContent = '+' + r.j.g; li.appendChild(g); }
    li.appendChild(v);
    return li;
  }
  function desenhar() {
    var rk = ranking();
    $('f-sala').hidden = E.fase !== 'sala';
    $('f-jogo').hidden = !(E.fase === 'pergunta' || E.fase === 'resposta');
    $('f-fim').hidden = E.fase !== 'fim';
    document.body.dataset.fase = E.fase;

    if (E.fase === 'sala') {
      desenharSala();
      var ul = $('jogadores'); ul.textContent = '';
      Object.keys(E.jog).map(function (id) { return { id: id, j: E.jog[id] }; })
        .sort(function (a, b) { return a.j.ord - b.j.ord; }).forEach(function (r) { ul.appendChild(botaoNome(r)); });
      $('conta').textContent = rk.length;
      $('vazio').hidden = rk.length > 0;
      $('comecar').disabled = rk.length === 0;
    }

    if (E.fase === 'pergunta' || E.fase === 'resposta') {
      var q = E.perguntas[E.n], revelada = E.fase === 'resposta';
      $('qual').textContent = 'Pergunta ' + (E.n + 1) + ' de ' + E.perguntas.length;
      $('pergunta').textContent = q.t;
      var ol = $('opcoes'); ol.textContent = '';
      var conta = [0, 0, 0, 0];
      Object.keys(E.jog).forEach(function (id) { var j = E.jog[id]; if (j.rn === E.n) conta[j.ro]++; });
      q.o.forEach(function (txt, i) {
        var li = document.createElement('li');
        li.className = 'op op--' + i + (revelada ? (i === q.c ? ' op--certa' : ' op--errada') : '');
        var l = document.createElement('b'); l.textContent = LETRAS[i];
        var s = document.createElement('span'); s.textContent = txt;
        li.appendChild(l); li.appendChild(s);
        if (revelada) { var c = document.createElement('i'); c.textContent = conta[i]; c.title = 'Quantos escolheram'; li.appendChild(c); }
        ol.appendChild(li);
      });
      desenharContagem();
      $('acao').textContent = revelada ? (E.n + 1 >= E.perguntas.length ? 'Ver o pódio' : 'Próxima pergunta') : 'Encerrar o tempo';
      $('placar-mini').hidden = !revelada;
      if (revelada) {
        var top = $('top'); top.textContent = '';
        rk.slice(0, 5).forEach(function (r, i) { top.appendChild(linhaPlacar(r, i + 1, true)); });
        $('segundos').textContent = '0'; $('anel').style.strokeDashoffset = 276.5;
      }
      relogio();
    }

    if (E.fase === 'fim') {
      var podio = $('podio'), resto = $('resto');
      podio.textContent = ''; resto.textContent = '';
      rk.slice(0, 3).forEach(function (r, i) { var li = linhaPlacar(r, i + 1, false); li.className = 'podio__' + (i + 1); podio.appendChild(li); });
      rk.slice(3).forEach(function (r, i) { resto.appendChild(linhaPlacar(r, i + 4, false)); });
    }
  }

  var ultimoEnvio = 0;
  function relogio() {
    if (E.fase !== 'pergunta') return;
    var rest = E.fimEm - Date.now();
    $('segundos').textContent = Math.max(0, Math.ceil(rest / 1000));
    $('anel').style.strokeDashoffset = 276.5 * (1 - Math.max(0, Math.min(1, rest / E.dur)));
    if (rest <= 0) { revelar(); return; }
    if (Date.now() - ultimoEnvio > 1000) { ultimoEnvio = Date.now(); publicar(); }
  }
  setInterval(relogio, 200);
  /* reenvia o estado de tempos em tempos: se uma mensagem se perder, o celular se acerta sozinho */
  setInterval(function () { if (E.fase !== 'pergunta') publicar(); }, 3000);

  /* ---------- partida ---------- */
  var sel = $('quantas');
  [5, 8, 10, 12, 15, BANCO.length].filter(function (v, i, a) { return v <= BANCO.length && a.indexOf(v) === i; }).forEach(function (v) {
    var o = document.createElement('option'); o.value = v; o.textContent = v === BANCO.length ? 'Todas (' + v + ')' : v; sel.appendChild(o);
  });
  sel.value = E.quantas; if (!sel.value) sel.value = BANCO.length;
  $('tempo').value = E.dur / 1000;

  var de = par.get('de');
  if (de && /^[\w-]+$/.test(de)) { $('voltar').href = 'index.html#/' + de; $('voltar2').href = 'index.html#/' + de; }

  $('comecar').addEventListener('click', comecar);
  $('acao').addEventListener('click', acao);
  $('de-novo').addEventListener('click', deNovo);
  $('nova-sala').addEventListener('click', novaSala);
  $('form-url').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = $('campo-url').value.trim();
    try { var u = new URL(v); if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('protocolo'); } catch (err) { $('campo-url').setCustomValidity('Cole o endereço completo, começando com https://'); $('campo-url').reportValidity(); return; }
    var dest = new URL(v);
    if (!/\.html?$/.test(dest.pathname) && dest.pathname.slice(-1) !== '/') dest.pathname += '/';
    v = dest.href;
    try { localStorage.setItem(CHAVE_URL, v); } catch (err) { /* vale só até fechar */ cfg.urlJogador = v; }
    desenharSala(); publicar();
  });
  $('campo-url').addEventListener('input', function () { this.setCustomValidity(''); });
  document.addEventListener('keydown', function (ev) {
    if (ev.target.closest('input, select, button, a')) return;
    if (ev.key === ' ' || ev.key === 'Enter' || ev.key === 'ArrowRight' || ev.key === 'PageDown') { ev.preventDefault(); acao(); }
  });

  window.QUIZ_APRESENTADOR = { estado: function () { return JSON.parse(JSON.stringify(E)); }, url: urlJogador };
  ligar();
  desenhar();
})();
