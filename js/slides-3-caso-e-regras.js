/* O caso "A noite do crime" (abertura, fatos) e as regras. Texto fiel ao material básico do FlashClip. */
(function () {
  'use strict';

  /* Da abertura do caso em diante (a segunda metade), as páginas saem em layout de jornal. */
  window.LAYOUT_ATUAL = 'jornal';

  var CADERNO = `% Caderno do caso: A noite do crime

gosta(ana, pizza).
gosta(leo, pizza).
gosta(bia, sushi).

estava(ana, biblioteca).
estava(leo, cozinha).
estava(bia, cozinha).`;
  var REGRA = 'culpado(P) :- gosta(P, pizza), estava(P, cozinha).';
  window.FLASHCLIP_CASO = { caderno: CADERNO, regra: REGRA };

  cena('noite', {
    titulo: 'A noite do crime',
    etapas: 2,
    corpo: `
      <div class="crime">
        <figure class="crime__foto">
          <img src="img/festa.webp" width="1344" height="752" alt="Gravura: a mesa da festa de Natal, com a última fatia de pizza no prato, sob o lampião">
          <img class="crime__foto-vazia" src="img/festa-vazia.webp" width="1344" height="752" alt="" aria-hidden="true">
          <figcaption>A mesa da festa de Natal da turma.</figcaption>
        </figure>
        ${ARTE.gravura({ w: 1780, h: 220, classe: 'crime__faixa', lua: [300, 70, 46], torre: .7, semente: 1225 })}
        <div class="crime__breu" aria-hidden="true"></div>
        <div class="crime__texto">
          <p class="kicker" data-e>Festa de Natal da turma</p>
          <h1 data-e>A noite do crime</h1>
          <p class="sub" data-e>Sobrava uma única fatia de pizza. <span data-passo="1">A luz apagou por um instante.</span> <span data-passo="2">Quando voltou, a fatia tinha sumido.</span></p>
        </div>
      </div>`
  });

  function suspeito(nome, quem, n) {
    return pasta({
      aba: quem + ' nº ' + n, abre: n, classe: 'suspeito',
      capa: '<h3>' + quem + ' nº ' + n + '</h3>',
      dentro: '<span class="clipe" aria-hidden="true"></span>' + icone('retrato-' + nome.toLowerCase(), 'retrato') + '<h3>' + nome + '</h3>'
    });
  }
  folha('suspeitos', {
    kicker: 'O caso · Os suspeitos', titulo: 'Os três suspeitos', selo: 'caso', etapas: 3,
    corpo: `
      <ol class="grade g3 suspeitos">
        ${suspeito('Ana', 'Suspeita', 1)}${suspeito('Leo', 'Suspeito', 2)}${suspeito('Bia', 'Suspeita', 3)}
      </ol>
      ${nota('O caso', 'um dos três pegou a última fatia. Quem foi?')}`
  });

  function ficha(nome, gosta, estava) {
    return pasta({
      aba: 'Ficha · ' + nome, abre: { Ana: 1, Leo: 2, Bia: 3 }[nome], classeDentro: 'ficha',
      capa: '<h3>' + nome + '</h3>',
      dentro: icone('retrato-' + nome.toLowerCase(), 'retrato') + '<h3>' + nome + '</h3><dl><dt>Gosta de</dt><dd>' + gosta + '</dd><dt>Estava na</dt><dd>' + estava + '</dd></dl>'
    });
  }
  folha('arquivo', {
    kicker: 'O caso · O arquivo', titulo: 'O que sabemos de cada um', selo: 'caso', etapas: 3,
    corpo: `
      <ul class="grade g3 fichas">
        ${ficha('Ana', 'pizza', 'biblioteca')}${ficha('Leo', 'pizza', 'cozinha')}${ficha('Bia', 'sushi', 'cozinha')}
      </ul>
      ${nota('Atenção', 'são as mesmas pistas até o fim da aula.')}`
  });

  folha('tres-passos', {
    estampa: 'chapeu',
    kicker: 'O caso · Os três passos', titulo: 'Os três passos do detetive', selo: 'caso',
    corpo: `
      <ol class="grade g3 pilares">
        <li class="cartao"><span class="num">1</span><h3>Observar</h3><p class="sub">fatos</p><p>As pistas do caso: quem gosta do quê e onde cada um estava.</p></li>
        <li class="cartao"><span class="num">2</span><h3>Raciocinar</h3><p class="sub">regras</p><p>Como chegar ao culpado: gosta de pizza E estava na cozinha.</p></li>
        <li class="cartao"><span class="num">3</span><h3>Perguntar</h3><p class="sub">consultas</p><p>Quem gosta de pizza? Quem estava na cozinha? Quem é o culpado?</p></li>
      </ol>
      ${nota('Nesta aula', 'vamos escrever cada passo em Prolog e deixar o computador resolver o caso.')}`
  });

  folha('caderno-fatos', {
    kicker: 'O caso · Passo 1 · Fatos', titulo: 'O caderno do detetive', selo: 'caso',
    corpo: `
      <div class="lado lado--45">
        <div class="pilha">
          <p class="lead">Todas as pistas do caso, escritas em Prolog: um fato por linha.</p>
          ${nota('Confira', 'minúsculas, parênteses colados e ponto no fim.')}
        </div>
        ${bloco(CADERNO, { rotulo: 'No caderno do ambiente', classe: 'codigo--caderno codigo--escreve' })}
      </div>`
  });

  folha('ache-erro', {
    estampa: { img: 'borrao', onde: 'lado' },
    kicker: 'Desafio 2 · Fatos', titulo: 'Ache o erro', selo: 'caso', classe: 'desafio',
    corpo: `
      <p class="lead">Um assistente distraído anotou as pistas do caso.<br><b>Cada linha tem um erro. Qual?</b></p>
      <figure class="codigo codigo--grande codigo--numerado"><pre><span class="ln"><i>1</i>gosta(Ana, pizza).</span><span class="ln"><i>2</i>estava (leo, cozinha).</span><span class="ln"><i>3</i>gosta(bia, sushi)</span><span class="ln"><i>4</i>estava(ana biblioteca).</span></pre></figure>`
  });

  function erro(n, cod, txt) {
    return '<li data-passo="' + n + '"><span class="num">' + n + '</span><code class="pl erro__cod">' + cod + '</code><p>' + txt + '</p></li>';
  }
  folha('ache-erro-resposta', {
    estampa: 'tinteiro',
    kicker: 'Desafio 2 · Resposta', titulo: 'O erro de cada linha', selo: 'caso',
    corpo: `
      <ol class="erros">
        ${erro(1, 'gosta(<mark>A</mark>na, pizza).', '<code class="pl">Ana</code> com A maiúsculo vira variável: “alguém, não sei quem”. Nomes ficam em minúscula: <code class="pl">ana</code>.')}
        ${erro(2, 'estava<mark>&nbsp;</mark>(leo, cozinha).', 'Espaço entre a palavra e o parêntese. Cole os dois: <code class="pl">estava(leo, cozinha).</code>')}
        ${erro(3, 'gosta(bia, sushi)<mark>&nbsp;</mark>', 'Faltou o ponto final. Todo fato termina com ponto.')}
        ${erro(4, 'estava(ana<mark>&nbsp;</mark>biblioteca).', 'Faltou a vírgula entre os argumentos: ela separa o quem do o quê.')}
      </ol>`
  });

  folha('regras', {
    estampa: 'bombons',
    kicker: 'Prolog · Regras', titulo: 'Construindo regras',
    corpo: `
      <p class="lead">Fazer regras é ensinar o computador a “ligar os pontos” e tirar conclusões sozinho, a partir dos fatos que você já contou.</p>
      <p>Pense numa regra como uma frase de “Se… então…” da vida real:</p>
      <blockquote class="citacao">“Se uma pessoa gosta de chocolate, então ela fica feliz.”</blockquote>
      ${nota('O símbolo do “se”', 'é o <code class="pl simbolo">:-</code> (dois pontos seguidos de um traço).')}`
  });

  folha('regra-estrutura', {
    estampa: 'engrenagens',
    kicker: 'Regras · Estrutura', titulo: 'A estrutura básica de uma regra',
    corpo: `
      ${bloco('conclusao(X) :- condicao(X).', { classe: 'codigo--grande' })}
      <p class="lead">A ${pl('conclusao(X)')} é verdadeira <b>SE</b> a ${pl('condicao(X)')} for verdadeira.</p>
      ${nota('O X maiúsculo', 'funciona como uma variável: pode ser qualquer pessoa, animal ou coisa que se encaixe na regra.')}`
  });

  folha('regra-simples', {
    estampa: 'bola',
    kicker: 'Regras · Exemplo 1: regra simples', titulo: 'Uma condição', selo: 'aula',
    corpo: `
      <p>Primeiro, imagine que temos estes fatos:</p>
      ${bloco('gosta(ana, chocolate).\ngosta(pedro, futebol).')}
      <p>Agora criamos a regra: “Alguém é feliz <b>SE</b> essa pessoa gosta de chocolate.”</p>
      ${bloco('feliz(X) :- gosta(X, chocolate).')}`
  });

  var troca = '<span class="troca"><span class="troca__de t-var">X</span><span class="troca__para">ana</span></span>';
  folha('como-pensa', {
    kicker: 'Regras · Exemplo 1: como o Prolog pensa', titulo: 'Como o Prolog pensa?', selo: 'aula',
    etapas: 3,
    corpo: `
      <div class="lado lado--55 pensa">
        <div class="pilha">
          <p class="rotulo">Você pergunta:</p>
          ${bloco('?- feliz(ana).', { classe: 'codigo--terminal' })}
          <figure class="codigo pensa__quadro"><pre><span class="ln pensa__regra"><span class="t-pred">feliz</span>(${troca}) <span class="t-op">:-</span> <span class="t-pred">gosta</span>(${troca}, chocolate).</span><span class="ln pensa__fato"><span class="t-pred">gosta</span>(ana, chocolate).<b class="pensa__visto" aria-hidden="true">&#10003;</b></span><span class="ln pensa__outro"><span class="t-pred">gosta</span>(pedro, futebol).</span></pre></figure>
          <p class="rotulo" data-passo="3">O Prolog responde:</p>
          <div data-passo="3">${bloco('true.', { classe: 'codigo--terminal codigo--resposta' })}</div>
        </div>
        <ol class="passos-v">
          <li data-passo="1"><span class="num">1</span><p>Troca o ${pl('X')} por ${pl('ana')}.</p></li>
          <li data-passo="2"><span class="num">2</span><p>Verifica: “A Ana gosta de chocolate?”</p></li>
          <li data-passo="3"><span class="num">3</span><p>Como está nos fatos que sim, responde ${pl('true')} (verdadeiro)!</p></li>
        </ol>
      </div>`
  });

  folha('composta', {
    estampa: 'cadeado',
    kicker: 'Regras · Exemplo 2: regra composta', titulo: 'Duas ou mais condições',
    corpo: `
      <p class="lead">Na vida real, muitas vezes precisamos que duas coisas sejam verdadeiras ao mesmo tempo. Para regras mais complexas, o Prolog usa alguns símbolos:</p>
      <div class="grade g4 simbolos">
        <div class="cartao"><code>:-</code><b>SE</b></div>
        <div class="cartao"><code>,</code><b>E</b></div>
        <div class="cartao"><code>;</code><b>OU</b></div>
        <div class="cartao"><code>.</code><b>Fim da regra</b></div>
      </div>`
  });

  folha('irmao', {
    estampa: 'camafeus',
    kicker: 'Regras · Exemplo 2: regra composta', titulo: 'Exemplo: ser irmão', selo: 'aula',
    corpo: `
      <p>Imagine estes fatos sobre uma família:</p>
      ${bloco('pai(carlos, joao).\npai(carlos, maria).\nhomem(joao).', { classe: 'codigo--medio' })}
      <p>A lógica: X é irmão de Y <b>SE</b> eles têm o mesmo pai <b>E</b> X é homem. No código, fica assim:</p>
      ${bloco('irmao(X, Y) :- pai(Z, X), pai(Z, Y), homem(X).', { classe: 'codigo--medio' })}`
  });

  folha('regra-culpado', {
    estampa: 'algemas',
    kicker: 'O caso · Passo 2 · Regras', titulo: 'A regra do culpado', selo: 'caso',
    corpo: `
      <p class="lead">É culpado <b>SE</b> gosta de pizza <b>E</b> estava na cozinha.</p>
      ${bloco(REGRA, { classe: 'codigo--medio' })}
      <div class="grade g3 legenda">
        <div class="cartao"><code class="pl">culpado(P)</code><span>a conclusão</span></div>
        <div class="cartao"><code class="pl simbolo">:-</code><span>quer dizer: <b>se</b></span></div>
        <div class="cartao"><code class="pl simbolo">,</code><span>quer dizer: <b>e</b></span></div>
      </div>
      <p class="leia">Leia: “P é culpado se P gosta de pizza e P estava na cozinha.”</p>`
  });

  var P = '<span class="pino t-var">P</span>';
  folha('mesma-letra', {
    estampa: 'fio',
    kicker: 'O caso · Passo 2 · Regras', titulo: 'A mesma letra, a mesma pessoa', selo: 'caso',
    etapas: 1,
    corpo: `
      <figure class="codigo codigo--medio fios"><pre><span class="ln"><span class="fio fio--1" aria-hidden="true"></span><span class="fio fio--2" aria-hidden="true"></span><span class="t-pred">culpado</span>(${P}) <span class="t-op">:-</span> <span class="t-pred">gosta</span>(${P}, pizza), <span class="t-pred">estava</span>(${P}, cozinha).</span></pre></figure>
      <p class="lead">O ${pl('P')} aparece três vezes.<br><b>É sempre a mesma pessoa.</b></p>
      ${nota('Por quê', 'tem que ser a mesma pessoa gostando de pizza e estando na cozinha.')}`
  });

  folha('caderno-completo', {
    kicker: 'O caso · Passo 2 · Regras', titulo: 'O caderno do caso, completo', selo: 'caso',
    corpo: `
      <div class="lado lado--38">
        <div class="pilha">
          <p class="lead">Embaixo das pistas, digite a regra. Depois clique em <b>Carregar código</b>.</p>
          ${nota('Confira', '<code class="pl">P</code> maiúsculo, <code class="pl simbolo">:-</code> , vírgula e ponto no fim.')}
        </div>
        ${bloco(CADERNO + '\n\n' + REGRA, { rotulo: 'No caderno do ambiente', classe: 'codigo--caderno codigo--denso', marca: [10] })}
      </div>`
  });
})();
