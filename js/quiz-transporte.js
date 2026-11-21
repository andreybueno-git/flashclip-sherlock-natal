/* Ligação em tempo real entre a tela do apresentador e os celulares.
   modo "mqtt": serviço público de mensagens, sem conta (precisa de internet nas duas pontas).
   modo "local": só entre abas do mesmo navegador, para ensaiar sem internet (?t=local). */
(function () {
  'use strict';
  var RAIZ = 'fcsh1/';

  function casa(filtro, sufixo) {
    if (filtro === sufixo) return true;
    if (filtro.slice(-2) === '/+') {
      var base = filtro.slice(0, -1);
      return sufixo.indexOf(base) === 0 && sufixo.indexOf('/', base.length) < 0;
    }
    return false;
  }

  /* op: { sala, modo, corretor (índice inicial), fixo (não trocar de corretor), aoEstado(texto, ok) } */
  window.QuizTransporte = function (op) {
    var ouvintes = [], fechado = false, cfg = window.QUIZ_CONFIG || {};
    var api = { corretor: op.corretor || 0, modo: op.modo, conectado: false };
    function avisar(txt, ok) { api.conectado = !!ok; if (op.aoEstado) op.aoEstado(txt, !!ok); }
    function entregar(sufixo, dados) {
      ouvintes.forEach(function (o) { if (casa(o.filtro, sufixo)) { try { o.cb(sufixo, dados); } catch (e) { console.error(e); } } });
    }

    if (op.modo === 'local') {
      var canal = new BroadcastChannel('fcsh1-' + op.sala), chave = 'fcsh1:' + op.sala + ':';
      canal.onmessage = function (ev) { entregar(ev.data.s, ev.data.d); };
      api.publicar = function (sufixo, dados, reter) {
        if (fechado) return;
        if (reter) { try { if (dados === null) localStorage.removeItem(chave + sufixo); else localStorage.setItem(chave + sufixo, JSON.stringify(dados)); } catch (e) { /* sem armazenamento */ } }
        if (dados !== null) canal.postMessage({ s: sufixo, d: dados });
      };
      api.assinar = function (filtro, cb) {
        ouvintes.push({ filtro: filtro, cb: cb });
        try {
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k.indexOf(chave) === 0 && casa(filtro, k.slice(chave.length))) cb(k.slice(chave.length), JSON.parse(localStorage.getItem(k)));
          }
        } catch (e) { /* sem armazenamento */ }
      };
      api.fechar = function () { fechado = true; canal.close(); };
      setTimeout(function () { avisar('Ensaio local (só neste navegador)', true); }, 0);
      return api;
    }

    /* ---- MQTT sobre WebSocket ---- */
    var cliente = null, lista = cfg.corretores || [], tTroca = null, jaConectou = false;
    function ligar() {
      if (fechado) return;
      if (typeof window.mqtt === 'undefined') { avisar('Biblioteca de mensagens não carregou', false); return; }
      var url = lista[api.corretor % lista.length];
      avisar('Conectando…', false);
      cliente = window.mqtt.connect(url, {
        clientId: 'fcsh_' + Math.random().toString(36).slice(2, 12),
        clean: true, keepalive: 30, reconnectPeriod: 2500, connectTimeout: 7000
      });
      /* se não conectar a tempo, tenta o próximo serviço (só quem cria a sala troca) */
      clearTimeout(tTroca);
      if (!op.fixo && lista.length > 1) {
        tTroca = setTimeout(function () {
          if (jaConectou || fechado) return;
          try { cliente.end(true); } catch (e) { /* já caiu */ }
          api.corretor = (api.corretor + 1) % lista.length;
          ligar();
        }, 8000);
      }
      cliente.on('connect', function () {
        jaConectou = true; clearTimeout(tTroca);
        ouvintes.forEach(function (o) { cliente.subscribe(RAIZ + op.sala + '/' + o.filtro, { qos: 0 }); });
        avisar('Conectado', true);
        if (op.aoConectar) op.aoConectar();
      });
      cliente.on('reconnect', function () { avisar('Reconectando…', false); });
      cliente.on('offline', function () { avisar('Sem conexão', false); });
      cliente.on('error', function () { avisar('Falha na conexão', false); });
      cliente.on('message', function (topico, carga) {
        var base = RAIZ + op.sala + '/';
        if (topico.indexOf(base) !== 0 || !carga.length) return;
        var dados;
        try { dados = JSON.parse(carga.toString()); } catch (e) { return; }
        entregar(topico.slice(base.length), dados);
      });
    }
    api.publicar = function (sufixo, dados, reter) {
      if (fechado || !cliente) return;
      cliente.publish(RAIZ + op.sala + '/' + sufixo, dados === null ? '' : JSON.stringify(dados), { qos: 0, retain: !!reter });
    };
    api.assinar = function (filtro, cb) {
      ouvintes.push({ filtro: filtro, cb: cb });
      if (cliente && cliente.connected) cliente.subscribe(RAIZ + op.sala + '/' + filtro, { qos: 0 });
    };
    api.fechar = function () { fechado = true; clearTimeout(tTroca); if (cliente) { try { cliente.end(true); } catch (e) { /* já caiu */ } } };
    ligar();
    return api;
  };
})();
