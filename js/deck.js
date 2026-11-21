/* Motor da apresentação: navegação, etapas dentro do slide, ordem editável (modo organizar),
   cenário (rua nevada ou mesa do detetive) e neve. Sem dependências. */
(function () {
  'use strict';

  var CHAVE = 'flashclip-sherlock:ordem:v1';
  var SL = window.SLIDES;
  var ORIGINAL = SL.map(function (s) { return s.id; });
  var porId = {};
  SL.forEach(function (s) { porId[s.id] = s; });

  var $ = function (q, r) { return (r || document).querySelector(q); };
  var $$ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };
  var palco = $('#palco'), mundo = $('#mundo');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)');

  var ordem = [], atual = 0, etapa = 0, idAtual = null;

  /* ---------- ordem guardada ---------- */
  function igual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function lerOrdem() {
    var salvo = null;
    try { salvo = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { salvo = null; }
    if (!Array.isArray(salvo)) return ORIGINAL.slice();
    var visto = {}, out = [];
    salvo.forEach(function (id) { if (porId[id] && !visto[id]) { visto[id] = 1; out.push(id); } });
    /* slide novo no material entra depois do vizinho que ele tinha na ordem original */
    ORIGINAL.forEach(function (id, i) {
      if (visto[id]) return;
      var ant = ORIGINAL[i - 1], k = ant ? out.indexOf(ant) + 1 : 0;
      out.splice(k, 0, id); visto[id] = 1;
    });
    return out;
  }
  function salvarOrdem() {
    try {
      if (igual(ordem, ORIGINAL)) localStorage.removeItem(CHAVE);
      else localStorage.setItem(CHAVE, JSON.stringify(ordem));
      return true;
    } catch (e) { return false; }
  }

  /* ---------- montagem ---------- */
  function texto(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); }

  function prepararEntradas(raiz) {
    var i = 0;
    $$('.kicker, .titulo, .corpo > *, .cena [data-e]', raiz).forEach(function (el) {
      if (el.hasAttribute('data-passo')) return;
      el.setAttribute('data-e', '');
      el.style.setProperty('--i', i++);
    });
  }

  function qr(textoQr) {
    if (typeof window.qrcode !== 'function') return '';
    var q = window.qrcode(0, 'M'); q.addData(textoQr); q.make();
    return q.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
  }
  window.FLASHCLIP_QR = qr;

  function montar() {
    SL.forEach(function (s) {
      var el = document.createElement('section');
      el.className = 'slide slide--' + s.tipo + (s.layout ? ' slide--' + s.layout : '');
      el.dataset.id = s.id;
      el.setAttribute('aria-roledescription', 'slide');
      el.innerHTML = s.html;
      s.nome = s.nome || texto(s.titulo || '');
      s.el = el;
      s.passos = 0;
      $$('[data-passo]', el).forEach(function (p) { s.passos = Math.max(s.passos, +p.dataset.passo); });
      if (s.etapas) s.passos = Math.max(s.passos, s.etapas);
      $$('[data-qr]', el).forEach(function (q) { q.innerHTML = qr(q.dataset.qr); });
      prepararEntradas(el);
      palco.appendChild(el);
    });
  }

  function renumerar() {
    ordem.forEach(function (id, i) {
      var s = porId[id], n = $('.pe__num', s.el);
      if (n) n.textContent = (i + 1);
      s.el.setAttribute('aria-label', 'Slide ' + (i + 1) + ' de ' + ordem.length + ': ' + s.nome);
    });
  }

  /* ---------- etapas e navegação ---------- */
  function aplicarEtapa(s, n, alvo) {
    var el = alvo || s.el;
    el.dataset.etapa = n;
    for (var k = 1; k <= 12; k++) el.classList.toggle('e' + k, k <= n);
    $$('[data-passo]', el).forEach(function (p) { p.classList.toggle('visto', +p.dataset.passo <= n); });
  }

  var tSai = null, tEntra = null;
  function mostrar(i, e, op) {
    op = op || {};
    i = Math.max(0, Math.min(ordem.length - 1, i));
    var s = porId[ordem[i]], antigo = idAtual ? porId[idAtual] : null;
    var dir = op.dir || (i >= atual ? 1 : -1);
    var animar = !op.seco && !reduz.matches;

    SL.forEach(function (x) { if (x !== s && x !== antigo) x.el.classList.remove('ativa', 'saindo', 'entrando'); });
    clearTimeout(tSai); clearTimeout(tEntra);

    if (antigo && antigo !== s) {
      antigo.el.classList.remove('ativa', 'entrando');
      if (animar) {
        antigo.el.style.setProperty('--dir', dir);
        antigo.el.classList.add('saindo');
        tSai = setTimeout(function () { antigo.el.classList.remove('saindo'); }, 280);
      }
    }
    atual = i; etapa = Math.max(0, Math.min(s.passos, e || 0)); idAtual = s.id;
    aplicarEtapa(s, etapa);
    if (antigo !== s) {
      s.el.classList.remove('saindo');
      s.el.style.setProperty('--dir', dir);
      s.el.classList.add('ativa');
      if (animar) {
        s.el.classList.remove('entrando');
        void s.el.offsetWidth;
        s.el.classList.add('entrando');
        tEntra = setTimeout(function () { s.el.classList.remove('entrando'); }, 1600);
      }
    }
    mundo.dataset.lugar = s.tipo === 'cena' ? 'rua' : 'mesa';
    mundo.dataset.clima = s.clima || '';
    atualizarBarra();
    try { history.replaceState(null, '', '#/' + s.id); } catch (err) { /* file:// em alguns navegadores */ }
    neve.conferir();
  }

  function avancar() {
    var s = porId[ordem[atual]];
    if (etapa < s.passos) { etapa++; aplicarEtapa(s, etapa); atualizarBarra(); return; }
    if (atual < ordem.length - 1) mostrar(atual + 1, 0, { dir: 1 });
  }
  function voltar() {
    var s = porId[ordem[atual]];
    if (etapa > 0) { etapa--; aplicarEtapa(s, etapa); atualizarBarra(); return; }
    if (atual > 0) mostrar(atual - 1, porId[ordem[atual - 1]].passos, { dir: -1 });
  }
  function irParaId(id, seco) {
    var i = ordem.indexOf(id);
    if (i >= 0) mostrar(i, 0, { seco: seco });
  }

  function atualizarBarra() {
    var s = porId[ordem[atual]];
    $('#contador').textContent = (atual + 1) + ' / ' + ordem.length;
    document.body.dataset.slide = s.id; document.body.dataset.etapa = etapa;
    var frac = (atual + (s.passos ? etapa / (s.passos + 1) : 0)) / Math.max(1, ordem.length - 1);
    $('#progresso').style.setProperty('--p', Math.min(1, frac));
    $('#b-voltar').disabled = atual === 0 && etapa === 0;
    $('#b-avancar').disabled = atual === ordem.length - 1 && etapa === s.passos;
    var q = $('#b-quiz'); if (q) q.href = 'quiz.html?de=' + encodeURIComponent(s.id);
    if (window.DECK && window.DECK.aoMudar) window.DECK.aoMudar();
  }

  /* ---------- escala do palco ---------- */
  function escalar() {
    var k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--escala', k);
    if (org.aberto) escalarMinis();
  }

  /* ---------- neve ---------- */
  var neve = (function () {
    var c = $('#neve');
    if (!c) return { medir: function () {}, conferir: function () {} };
    var g = c.getContext('2d'), flocos = [], rodando = false, ultimo = 0, W = 0, H = 0;
    function medir() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!flocos.length) {
        for (var i = 0; i < 130; i++) flocos.push({ x: Math.random(), y: Math.random(), r: .8 + Math.random() * 2.6, v: 16 + Math.random() * 42, f: Math.random() * 6.28, a: .35 + Math.random() * .6 });
      }
      desenhar(0);
    }
    function desenhar(dt) {
      g.clearRect(0, 0, W, H);
      g.fillStyle = '#eef3f6';
      for (var i = 0; i < flocos.length; i++) {
        var f = flocos[i];
        f.y += (f.v * dt) / H; f.f += dt * .6;
        f.x += Math.sin(f.f) * .00035 * f.r;
        if (f.y > 1.02) { f.y = -.02; f.x = Math.random(); }
        g.globalAlpha = f.a;
        g.beginPath(); g.arc(f.x * W, f.y * H, f.r, 0, 6.2832); g.fill();
      }
      g.globalAlpha = 1;
    }
    function quadro(t) {
      if (!rodando) return;
      var dt = Math.min(.05, (t - ultimo) / 1000); ultimo = t;
      desenhar(dt);
      requestAnimationFrame(quadro);
    }
    function conferir() {
      var deve = mundo.dataset.lugar === 'rua' && !document.hidden && !reduz.matches && !org.aberto;
      if (deve && !rodando) { rodando = true; ultimo = performance.now(); requestAnimationFrame(quadro); }
      else if (!deve) rodando = false;
    }
    return { medir: medir, conferir: conferir };
  })();

  /* ---------- modo organizar ---------- */
  var org = { aberto: false, montado: false, el: $('#organizar'), lista: $('#org-lista'), pego: null, antes: null, hist: [], drag: null };
  var vivo = $('#org-vivo');
  function anunciar(msg) { vivo.textContent = ''; setTimeout(function () { vivo.textContent = msg; }, 30); }

  function montarOrg() {
    SL.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'mini';
      li.dataset.id = s.id;
      li.tabIndex = -1;
      li.innerHTML =
        '<div class="mini__quadro" aria-hidden="true"><div class="mini__slide slide slide--' + s.tipo + (s.layout ? ' slide--' + s.layout : '') + ' miniatura ativa">' + s.html + '</div></div>' +
        '<div class="mini__pe"><span class="mini__n"></span><span class="mini__t"></span></div>' +
        '<div class="mini__acoes">' +
        '<button type="button" tabindex="-1" data-acao="antes" title="Mover para antes">&#9664;</button>' +
        '<button type="button" tabindex="-1" data-acao="abrir">Abrir</button>' +
        '<button type="button" tabindex="-1" data-acao="depois" title="Mover para depois">&#9654;</button>' +
        '</div>';
      $('.mini__t', li).textContent = s.nome;
      var mini = $('.mini__slide', li);
      $$('[data-qr]', mini).forEach(function (q) { q.innerHTML = ''; });
      aplicarEtapa(s, 12, mini);
      s.li = li;
    });
    org.montado = true;
  }

  function escalarMinis() {
    var q = $('.mini__quadro', org.lista);
    if (q) org.lista.style.setProperty('--k', q.clientWidth / 1920);
  }

  function flip(mudar) {
    var antes = new Map();
    $$('.mini', org.lista).forEach(function (li) { antes.set(li, li.getBoundingClientRect()); });
    mudar();
    if (reduz.matches) return;
    $$('.mini', org.lista).forEach(function (li) {
      var a = antes.get(li), d = li.getBoundingClientRect();
      if (!a) return;
      var dx = a.left - d.left, dy = a.top - d.top;
      if (!dx && !dy) return;
      li.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }

  function sincronizarOrg(animado) {
    var fazer = function () { ordem.forEach(function (id) { org.lista.appendChild(porId[id].li); }); };
    if (animado) flip(fazer); else fazer();
    ordem.forEach(function (id, i) {
      var li = porId[id].li;
      $('.mini__n', li).textContent = i + 1;
      li.setAttribute('aria-label', 'Slide ' + (i + 1) + ' de ' + ordem.length + ': ' + porId[id].nome);
      li.classList.toggle('mini--atual', id === idAtual);
      $('[data-acao="antes"]', li).disabled = i === 0;
      $('[data-acao="depois"]', li).disabled = i === ordem.length - 1;
    });
    var orig = igual(ordem, ORIGINAL);
    $('#org-original').disabled = orig;
    $('#org-desfazer').disabled = !org.hist.length;
    $('#org-estado').textContent = orig ? 'Ordem original do material.' : 'Ordem sua, guardada neste navegador.';
  }

  function aposMudar(msg) {
    var ok = salvarOrdem();
    atual = Math.max(0, ordem.indexOf(idAtual));
    renumerar(); atualizarBarra(); sincronizarOrg(true);
    anunciar(msg + (ok ? '' : ' Atenção: este navegador não deixou guardar a ordem.'));
  }

  function mover(id, para, semHist) {
    var de = ordem.indexOf(id);
    para = Math.max(0, Math.min(ordem.length - 1, para));
    if (de < 0 || de === para) return false;
    if (!semHist) org.hist.push(ordem.slice());
    ordem.splice(de, 1); ordem.splice(para, 0, id);
    aposMudar('“' + porId[id].nome + '” agora é o slide ' + (para + 1) + ' de ' + ordem.length + '.');
    return true;
  }

  function focar(id) {
    $$('.mini', org.lista).forEach(function (li) { li.tabIndex = li.dataset.id === id ? 0 : -1; });
    var li = porId[id].li;
    li.focus({ preventScroll: true });
    li.scrollIntoView({ block: 'nearest', behavior: reduz.matches ? 'auto' : 'smooth' });
  }

  function soltar(cancelar) {
    if (!org.pego) return;
    var id = org.pego, li = porId[id].li;
    li.classList.remove('mini--pego');
    org.pego = null;
    if (cancelar) {
      ordem = org.antes.slice();
      aposMudar('Movimento cancelado. O slide voltou para o lugar.');
    } else if (!igual(ordem, org.antes)) {
      org.hist.push(org.antes);
      sincronizarOrg(false);
      anunciar('Solto na posição ' + (ordem.indexOf(id) + 1) + ' de ' + ordem.length + '.');
    } else anunciar('Solto no mesmo lugar.');
    org.antes = null;
    focar(id);
  }

  function colunas() {
    var lis = $$('.mini', org.lista);
    if (lis.length < 2) return 1;
    var y0 = lis[0].offsetTop, n = 1;
    while (n < lis.length && lis[n].offsetTop === y0) n++;
    return n;
  }

  function abrirOrganizar() {
    if (!org.montado) montarOrg();
    org.aberto = true;
    org.el.hidden = false;
    document.body.classList.add('organizando');
    sincronizarOrg(false);
    escalarMinis();
    focar(idAtual);
    neve.conferir();
  }
  function fecharOrganizar(irPara) {
    if (org.pego) soltar(true);
    org.aberto = false;
    org.el.hidden = true;
    document.body.classList.remove('organizando');
    mostrar(ordem.indexOf(irPara || idAtual), 0, { seco: true });
    $('#b-organizar').focus();
  }
  function desfazer() {
    if (org.pego || !org.hist.length) return;
    ordem = org.hist.pop();
    aposMudar('Último movimento desfeito.');
  }
  function ordemOriginal() {
    if (igual(ordem, ORIGINAL)) return;
    if (org.pego) soltar(true);
    org.hist.push(ordem.slice());
    ordem = ORIGINAL.slice();
    aposMudar('Ordem original do material restaurada.');
  }

  function teclaOrganizar(e) {
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); if (org.pego) soltar(true); else fecharOrganizar(); return; }
    if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'z') { e.preventDefault(); desfazer(); return; }
    var li = document.activeElement;
    if (!li || !li.classList || !li.classList.contains('mini')) {
      if ((k === 'o' || k === 'O') && !e.metaKey && !e.ctrlKey) { e.preventDefault(); fecharOrganizar(); }
      return;
    }
    var id = li.dataset.id, i = ordem.indexOf(id), d = null;
    if (k === 'ArrowRight') d = 1; else if (k === 'ArrowLeft') d = -1;
    else if (k === 'ArrowDown') d = colunas(); else if (k === 'ArrowUp') d = -colunas();
    else if (k === 'Home') d = -i; else if (k === 'End') d = ordem.length - 1 - i;
    else if (k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      if (org.pego) soltar(false);
      else {
        org.pego = id; org.antes = ordem.slice(); li.classList.add('mini--pego');
        anunciar('Pegou o slide ' + (i + 1) + ', “' + porId[id].nome + '”. Setas movem, Espaço solta, Esc cancela.');
      }
      return;
    } else if (k === 'Enter') { e.preventDefault(); if (org.pego) soltar(false); else fecharOrganizar(id); return; }
    else if (k === 'o' || k === 'O') { e.preventDefault(); fecharOrganizar(); return; }
    else return;
    e.preventDefault();
    var j = Math.max(0, Math.min(ordem.length - 1, i + d));
    if (org.pego) { mover(id, j, true); focar(id); }
    else if (e.altKey) { mover(id, j); focar(id); }
    else focar(ordem[j]);
  }

  /* arrastar com o mouse */
  function inicioArrasto(e) {
    if (e.button !== 0 || e.pointerType === 'touch') return;
    var li = e.target.closest('.mini');
    if (!li || e.target.closest('button')) return;
    if (org.pego) soltar(false);
    org.drag = { li: li, id: e.pointerId, x: e.clientX, y: e.clientY, ativo: false, fantasma: null, antes: ordem.slice() };
  }
  function moveArrasto(e) {
    var d = org.drag;
    if (!d || e.pointerId !== d.id) return;
    if (!d.ativo) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
      var r = d.li.getBoundingClientRect();
      d.ativo = true; d.ox = d.x - r.left; d.oy = d.y - r.top;
      d.fantasma = d.li.cloneNode(true);
      d.fantasma.classList.add('mini--fantasma');
      d.fantasma.style.width = r.width + 'px';
      d.fantasma.style.setProperty('--k', r.width ? ($('.mini__quadro', d.li).clientWidth / 1920) : .15);
      document.body.appendChild(d.fantasma);
      d.li.classList.add('mini--arrastando');
      document.body.classList.add('arrastando');
    }
    e.preventDefault();
    d.fantasma.style.transform = 'translate(' + (e.clientX - d.ox) + 'px,' + (e.clientY - d.oy) + 'px) rotate(1.5deg)';
    encaixar(d, e.clientX, e.clientY);
    var rolo = $('#org-rolo'), rr = rolo.getBoundingClientRect();
    if (e.clientY < rr.top + 70) rolo.scrollTop -= 18; else if (e.clientY > rr.bottom - 70) rolo.scrollTop += 18;
  }
  /* Acha a miniatura sob o ponteiro pela posição de layout (que não muda durante a animação)
     e põe no lugar dela a que está sendo arrastada. */
  function encaixar(d, x, y) {
    var r = org.lista.getBoundingClientRect(), lx = x - r.left, ly = y - r.top;
    var lis = $$('.mini', org.lista), alvo = null;
    for (var i = 0; i < lis.length; i++) {
      var l = lis[i];
      if (lx >= l.offsetLeft && lx <= l.offsetLeft + l.offsetWidth && ly >= l.offsetTop && ly <= l.offsetTop + l.offsetHeight) { alvo = l; break; }
    }
    if (!alvo || alvo === d.li) return;
    var a = lis.indexOf(d.li), b = lis.indexOf(alvo);
    flip(function () { org.lista.insertBefore(d.li, b > a ? alvo.nextSibling : alvo); });
  }

  function fimArrasto(e, cancelar) {
    var d = org.drag;
    if (!d || (e && e.pointerId !== d.id)) return;
    org.drag = null;
    if (!d.ativo) { focar(d.li.dataset.id); return; }
    if (!cancelar && e) encaixar(d, e.clientX, e.clientY);
    d.fantasma.remove();
    d.li.classList.remove('mini--arrastando');
    document.body.classList.remove('arrastando');
    var nova = $$('.mini', org.lista).map(function (li) { return li.dataset.id; });
    if (cancelar || igual(nova, d.antes)) { sincronizarOrg(true); focar(d.li.dataset.id); return; }
    org.hist.push(d.antes);
    ordem = nova;
    var id = d.li.dataset.id;
    aposMudar('“' + porId[id].nome + '” agora é o slide ' + (ordem.indexOf(id) + 1) + ' de ' + ordem.length + '.');
    focar(id);
  }

  function ligarOrganizar() {
    org.lista.addEventListener('pointerdown', inicioArrasto);
    window.addEventListener('pointermove', moveArrasto, { passive: false });
    window.addEventListener('pointerup', function (e) { fimArrasto(e, false); });
    window.addEventListener('pointercancel', function (e) { fimArrasto(e, true); });
    org.lista.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-acao]');
      if (!b) return;
      var li = b.closest('.mini'), id = li.dataset.id, i = ordem.indexOf(id);
      if (b.dataset.acao === 'abrir') { fecharOrganizar(id); return; }
      if (org.pego) soltar(false);
      mover(id, i + (b.dataset.acao === 'antes' ? -1 : 1));
      focar(id);
    });
    $('#org-fechar').addEventListener('click', function () { fecharOrganizar(); });
    $('#org-desfazer').addEventListener('click', desfazer);
    $('#org-original').addEventListener('click', ordemOriginal);
  }

  /* ---------- ajuda, tela cheia, barra ---------- */
  var ajuda = $('#ajuda');
  function alternarAjuda(abrir) {
    ajuda.hidden = abrir === undefined ? !ajuda.hidden : !abrir;
    if (!ajuda.hidden) $('#ajuda-fechar').focus();
  }
  function telaCheia() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
  }

  var tOcio = null;
  function acordar() {
    document.body.classList.remove('ocioso');
    clearTimeout(tOcio);
    tOcio = setTimeout(function () { if (!org.aberto && ajuda.hidden) document.body.classList.add('ocioso'); }, 2600);
  }

  function tecla(e) {
    if (org.aberto) { teclaOrganizar(e); return; }
    if (!ajuda.hidden) { if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); alternarAjuda(false); } return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var emBotao = e.target && e.target.closest && e.target.closest('button, a, input, select, textarea');
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': e.preventDefault(); avancar(); break;
      case ' ': case 'Enter': if (emBotao) return; e.preventDefault(); avancar(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); voltar(); break;
      case 'Home': e.preventDefault(); mostrar(0, 0); break;
      case 'End': e.preventDefault(); mostrar(ordem.length - 1, 0); break;
      case 'o': case 'O': e.preventDefault(); abrirOrganizar(); break;
      case 'f': case 'F': e.preventDefault(); telaCheia(); break;
      case 'm': case 'M': if (!window.MODO_FOTO) return; e.preventDefault(); window.MODO_FOTO.alternar(); break;
      case '?': e.preventDefault(); alternarAjuda(); break;
      default: return;
    }
    acordar();
  }

  /* ---------- partida ---------- */
  function iniciar() {
    montar();
    ordem = lerOrdem();
    renumerar();
    escalar(); neve.medir();
    ligarOrganizar();

    var m = /^#\/([\w-]+)/.exec(location.hash), i = m ? ordem.indexOf(m[1]) : 0;
    mostrar(i < 0 ? 0 : i, 0, { seco: true });

    document.addEventListener('keydown', tecla);
    window.addEventListener('resize', function () { escalar(); neve.medir(); });
    window.addEventListener('hashchange', function () {
      var h = /^#\/([\w-]+)/.exec(location.hash);
      if (h && h[1] !== idAtual && porId[h[1]] && !org.aberto) irParaId(h[1]);
    });
    document.addEventListener('visibilitychange', neve.conferir);
    if (reduz.addEventListener) reduz.addEventListener('change', neve.conferir);
    ['mousemove', 'pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, acordar, { passive: true }); });
    acordar();

    $('#b-avancar').addEventListener('click', avancar);
    $('#b-voltar').addEventListener('click', voltar);
    $('#b-organizar').addEventListener('click', abrirOrganizar);
    $('#b-cheia').addEventListener('click', telaCheia);
    $('#b-ajuda').addEventListener('click', function () { alternarAjuda(); });
    $('#ajuda-fechar').addEventListener('click', function () { alternarAjuda(false); });
    document.body.classList.add('pronto');
  }

  window.DECK = {
    ir: irParaId, avancar: avancar, voltar: voltar, aoMudar: null,
    organizando: function () { return org.aberto; },
    info: function () {
      var s = porId[ordem[atual]], p = ordem[atual + 1] ? porId[ordem[atual + 1]] : null;
      return { i: atual + 1, total: ordem.length, t: s.nome, prox: p ? p.nome : '', etapa: etapa, passos: s.passos };
    },
    estado: function () { return { ordem: ordem.slice(), atual: atual, etapa: etapa, id: idAtual, original: ORIGINAL.slice() }; }
  };
  iniciar();
})();
