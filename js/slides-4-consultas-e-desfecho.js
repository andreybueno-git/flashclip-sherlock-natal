/* Consultas, a solução do caso e o fechamento. Texto fiel ao material básico do FlashClip. */
(function () {
  'use strict';
  var AMBIENTE = window.FLASHCLIP_AMBIENTE;

  function term(rotulo, src, passos, extra) {
    return bloco(src, { rotulo: rotulo, classe: 'codigo--terminal ' + (extra || ''), passos: passos });
  }
  function qa(pergunta, consulta, resposta, comentario, n) {
    return '<div class="cartao qa">' +
      '<p class="sub">Você pergunta</p><p class="qa__fala">' + pergunta + '</p>' + term('', consulta) +
      '<div class="qa__resp" data-passo="' + n + '"><p class="sub">Prolog responde</p>' +
      '<p class="qa__r">' + pl(resposta) + (comentario ? ' <span>' + comentario + '</span>' : '') + '</p></div></div>';
  }

  folha('consultas', {
    kicker: 'Prolog · Consultas', titulo: 'Como fazer consultas?',
    corpo: `
      <div class="lado lado--70">
        <div class="pilha">
          <p class="lead">É a hora da mágica: o momento em que você faz perguntas ao computador, e ele usa os fatos e as regras que você criou para investigar e responder como um detetive.</p>
          <p>Na tela de execução do Prolog (o terminal ou console), você vai ver o símbolo ${pl('?-')}. É ali que você digita suas perguntas, sempre terminando com um ponto final ( ${pl('.')} ).</p>
        </div>
        <div class="grande-simbolo" aria-hidden="true"><code>?-</code>${icone('lupa')}</div>
      </div>`
  });

  folha('preparando', {
    kicker: 'Consultas · Preparando o teste', titulo: 'Preparando o teste', selo: 'aula',
    corpo: `
      <div class="lado lado--40">
        <div class="pilha">
          <p class="lead">Imagine que já escrevemos estes fatos e esta regra no nosso arquivo.</p>
          ${nota('Agora', 'vamos fazer quatro tipos de perguntas ao sistema.')}
        </div>
        ${bloco(`% Fatos
gosta(maria, pizza).
gosta(joao, pizza).
gosta(ana, salada).

% Regra: alguém é feliz SE gosta de pizza
feliz(X) :- gosta(X, pizza).`, { rotulo: 'No arquivo', classe: 'codigo--caderno codigo--denso' })}
      </div>`
  });

  folha('tipo1', {
    kicker: 'Consultas · Tipo 1', titulo: 'Perguntas de sim ou não', selo: 'aula',
    corpo: `
      <p>Quando você usa apenas letras minúsculas, está perguntando se algo específico é verdade ou mentira.</p>
      <div class="grade g2">
        ${qa('“A Maria gosta de pizza?”', '?- gosta(maria, pizza).', 'true.', 'Sim, é verdade!', 1)}
        ${qa('“A Ana é feliz?”', '?- feliz(ana).', 'false.', 'Não, porque ela gosta de salada, não de pizza.', 2)}
      </div>`
  });

  folha('tipo2', {
    kicker: 'Consultas · Tipo 2', titulo: 'Perguntas de “quem?” ou “o quê?”', selo: 'aula',
    corpo: `
      <p>Quando você coloca uma palavra com letra maiúscula (como ${pl('X')} ou ${pl('Pessoa')}), pede ao Prolog que descubra o valor que torna a frase verdadeira. Se descobrir, ele guarda o valor na variável e mostra na tela.</p>
      <div class="grade g1 estreita">
        ${qa('“O que a Ana gosta de comer?”', '?- gosta(ana, Oque).', 'Oque = salada.', '', 1)}
      </div>`
  });

  folha('tipo3', {
    kicker: 'Consultas · Tipo 3', titulo: 'Perguntas com várias respostas', selo: 'aula',
    etapas: 3,
    corpo: `
      <p>Às vezes existe mais de uma resposta certa. O Prolog sempre mostra a primeira que encontrar e fica esperando.</p>
      <div class="lado lado--55">
        <ol class="passos-v passos-v--compacto">
          <li data-passo="1"><span class="num">1</span><p>Você pergunta: “Quem é feliz?”</p></li>
          <li data-passo="2"><span class="num">2</span><p>Prolog responde ${pl('Quem = maria')} e o cursor fica esperando você decidir.</p></li>
          <li data-passo="3"><span class="num">3</span><p>Você aperta ${pl(';')} (“e quem mais?”) e ele mostra ${pl('Quem = joao.')}, agora com ponto final: acabaram as respostas.</p></li>
        </ol>
        <figure class="codigo codigo--terminal"><figcaption class="codigo__rotulo">No ambiente</figcaption><pre><span class="ln" data-passo="1"><span class="t-op">?-</span> <span class="t-pred">feliz</span>(<span class="t-var">Quem</span>).</span><span class="ln" data-passo="2"><span class="t-var">Quem</span> = maria<span class="espera" aria-hidden="true"></span><span class="mais" data-passo="3"> ;</span></span><span class="ln" data-passo="3"><span class="t-var">Quem</span> = joao.</span></pre></figure>
      </div>`
  });

  folha('tipo4', {
    kicker: 'Consultas · Tipo 4', titulo: 'Perguntas combinadas', selo: 'aula',
    etapas: 3,
    corpo: `
      <p>Assim como usamos a vírgula nas regras, você também pode usá-la nas consultas para fazer perguntas com múltiplas condições ao mesmo tempo.</p>
      <div class="lado lado--55">
        <div class="pilha">
          <p class="qa__fala">“O que tanto a Maria quanto o João gostam de comer?”</p>
          ${term('', '?- gosta(maria, X), gosta(joao, X).', null, 'codigo--medio')}
          <div data-passo="3">${term('', 'X = pizza.', null, 'codigo--medio codigo--resposta')}</div>
        </div>
        <div class="pilha">
          <p class="rotulo">Como o Prolog pensa</p>
          <ol class="passos-v passos-v--compacto">
            <li data-passo="1"><span class="num">1</span><p>Olha o que a Maria gosta (${pl('X')}) e guarda esse valor.</p></li>
            <li data-passo="2"><span class="num">2</span><p>Verifica se o João também gosta dessa mesma coisa ${pl('X')}.</p></li>
            <li data-passo="3"><span class="num">3</span><p>Se os dois gostarem, mostra o resultado!</p></li>
          </ol>
        </div>
      </div>`
  });

  folha('quem-gosta', {
    kicker: 'O caso · Passo 3 · Consultas', titulo: 'Quem gosta de pizza?', selo: 'caso',
    corpo: `
      <div class="lado lado--50">
        <div class="pilha">
          <p class="lead">Letra maiúscula quer dizer <b>alguém</b>. O Prolog preenche o espaço.</p>
          ${nota('Dica', 'aperte <code class="pl simbolo">;</code> ou clique em <b>Próxima</b> para ver a outra resposta. O <code class="pl">false.</code> no fim quer dizer: não há mais respostas.')}
        </div>
        ${term('No ambiente', '?- gosta(Quem, pizza).\nQuem = ana ;\nQuem = leo ;\nfalse.', [0, 1, 2, 3])}
      </div>`
  });

  folha('desafio3', {
    kicker: 'Desafio 3 · Consultas', titulo: 'Quem estava na cozinha?', selo: 'caso', classe: 'desafio',
    corpo: `
      <p class="lead">Você conhece as pistas. Agora escreva a pergunta em Prolog.</p>
      <figure class="codigo codigo--grande codigo--terminal"><pre><span class="ln"><span class="t-op">?-</span> <span class="lacuna">______</span>(<span class="t-var">Quem</span>, <span class="lacuna">_______</span>).</span></pre></figure>
      ${nota('Dica', 'é igual à pergunta anterior. Só mudam duas palavras.')}`
  });

  function chip(nome) {
    return '<span class="chip">' + icone('retrato-' + nome, 'retrato') + pl('Quem = ' + nome) + '</span>';
  }
  folha('desafio3-resposta', {
    kicker: 'Desafio 3 · Resposta', titulo: 'Leo e Bia estavam na cozinha', selo: 'caso',
    corpo: `
      <div class="lado lado--50">
        <div class="pilha">
          ${term('', '?- estava(Quem, cozinha).', null, 'codigo--medio')}
          <div class="chips">${chip('leo')}${chip('bia')}</div>
        </div>
        ${term('No ambiente', '?- estava(Quem, cozinha).\nQuem = leo ;\nQuem = bia.')}
      </div>`
  });

  function par(sub, a, b, frase) {
    return '<div class="cartao grupo"><p class="sub">' + sub + '</p><div class="grupo__rostos">' + icone('retrato-' + a, 'retrato') + icone('retrato-' + b, 'retrato') + '</div><h3>' + frase + '</h3></div>';
  }
  folha('impasse', {
    kicker: 'O caso · O impasse', titulo: 'O impasse', selo: 'caso',
    corpo: `
      <div class="grade g2">
        ${par('Gostam de pizza', 'ana', 'leo', 'Ana e Leo')}
        ${par('Estavam na cozinha', 'leo', 'bia', 'Leo e Bia')}
      </div>
      ${nota('E agora?', 'uma pergunta sozinha não resolve o caso.')}`
  });

  function teste(nome, gosta, estava, veredito, n) {
    var t1 = '<li class="teste teste--' + (gosta ? 'sim' : 'nao') + '">' + pl('gosta(' + nome + ', pizza)') + '<b></b></li>';
    var t2 = estava === null
      ? '<li class="teste teste--pulo"><span>nem precisa conferir a cozinha</span></li>'
      : '<li class="teste teste--' + (estava ? 'sim' : 'nao') + ' teste--2">' + pl('estava(' + nome + ', cozinha)') + '<b></b></li>';
    return '<li class="cartao deduz deduz--' + (gosta && estava ? 'culpado' : 'fora') + '" data-passo="' + n + '">' +
      icone('retrato-' + nome, 'retrato') +
      '<div><p class="deduz__quem">' + pl('Quem = ' + nome) + '</p><ul>' + t1 + t2 + '</ul><p class="deduz__v">' + veredito + '</p></div></li>';
  }
  folha('combinada', {
    kicker: 'O caso · Passo 3 · Consultas', titulo: 'Uma pergunta combinada', selo: 'caso',
    etapas: 3,
    corpo: `
      <p class="lead lead--menor">A vírgula também vale nas consultas: gosta de pizza <b>E</b> estava na cozinha.</p>
      <div class="lado lado--62 topo">
        ${term('No ambiente', '?- gosta(Quem, pizza), estava(Quem, cozinha).\nQuem = leo ;\nfalse.', [0, 2, 3], 'codigo--denso')}
        ${nota('Por quê', 'o Prolog guarda o valor de <code class="pl">Quem</code> e confere as duas pistas. Só o Leo passa nos dois testes.', ' data-passo="3"')}
      </div>
      <ol class="grade g3 deducao">
        ${teste('ana', true, false, 'descartada', 1)}
        ${teste('leo', true, true, 'passa nos dois testes', 2)}
        ${teste('bia', false, null, 'descartada', 3)}
      </ol>`
  });

  cena('resolvido', {
    titulo: 'Caso resolvido: foi o Leo',
    etapas: 1,
    corpo: `
      <div class="resolvido">
        <div class="resolvido__texto">
          <p class="kicker" data-e>Caso resolvido</p>
          <h1 data-passo="1">Foi o Leo</h1>
          <figure class="codigo codigo--terminal codigo--grande" data-e><pre><span class="ln"><span class="t-op">?-</span> <span class="t-pred">culpado</span>(<span class="t-var">Quem</span>).</span><span class="ln" data-passo="1"><span class="t-var">Quem</span> = leo.</span></pre></figure>
          <p class="sub" data-passo="1">Demos as pistas e a regra. O computador concluiu sozinho.</p>
        </div>
        <div class="resolvido__retrato" data-passo="1" aria-hidden="true">
          ${icone('retrato-leo', 'retrato')}
          <span class="carimbo">${icone('lacre')}<b>Caso<br>resolvido</b></span>
          <span class="resolvido__prova">${icone('pizza', 'resolvido__pizza')}<div class="tres-d" data-3d="pizza"></div></span>
        </div>
      </div>`
  });

  folha('desafio-final', {
    kicker: 'Desafio final', titulo: 'Agora o detetive é você', selo: 'caso', classe: 'desafio',
    corpo: `
      <div class="lado lado--50 topo">
        <div class="pilha">
          <p>Acrescente duas pistas com o seu nome:</p>
          ${bloco('gosta(seu_nome, pizza).\nestava(seu_nome, cozinha).', { classe: 'codigo--medio' })}
        </div>
        <div class="pilha">
          <p>Depois pergunte de novo:</p>
          ${term('', '?- culpado(Quem).', null, 'codigo--medio')}
        </div>
      </div>
      ${nota('Dica', 'nome em minúscula, sem acento e sem espaço. Use <code class="pl">_</code> para juntar palavras: <code class="pl">maria_clara</code>.')}`
  });

  folha('resultado-final', {
    kicker: 'Desafio final · Resultado', titulo: 'A regra é a mesma, a resposta mudou', selo: 'caso', longo: true,
    corpo: `
      <div class="grade g2 antes-depois">
        <div class="cartao"><p class="sub">Antes</p>${term('', 'Quem = leo', null, 'codigo--medio')}</div>
        <div class="cartao cartao--forte"><p class="sub">Depois</p>${term('', 'Quem = leo\nQuem = seu_nome', null, 'codigo--medio')}</div>
      </div>
      ${nota('Por quê', 'ninguém mexeu na regra. Só acrescentamos pistas.')}`
  });

  folha('fechar', {
    kicker: 'Para fechar', titulo: 'O que aprendemos hoje',
    corpo: `
      <ol class="fecho">
        <li><span class="num">1</span><div><h3>Fato</h3><p>Uma pista.</p></div>${bloco('gosta(ana, pizza).', { classe: 'codigo--denso' })}</li>
        <li><span class="num">2</span><div><h3>Regra</h3><p>Uma conclusão.</p></div>${bloco(window.FLASHCLIP_CASO.regra, { classe: 'codigo--denso' })}</li>
        <li><span class="num">3</span><div><h3>Consulta</h3><p>Uma pergunta.</p></div>${term('', '?- culpado(Quem).', null, 'codigo--denso')}</li>
      </ol>`
  });

  cena('obrigado', {
    titulo: 'Obrigado!',
    corpo: `
      <div class="fim">
        <div class="fim__texto">
          <h1 data-e>O computador não sabia nada.<br><em>Até alguém ensinar.</em></h1>
          <p class="fim__obrigado" data-e>Obrigado!</p>
          <p class="fim__url" data-e>${AMBIENTE}</p>
        </div>
        <div class="capa__gravura" data-e>
          ${ARTE.gravura({ w: 640, h: 780, lua: [330, 300, 205], detetive: [40, 129, .93], torre: .03, semente: 61 })}
        </div>
      </div>`
  });
})();
