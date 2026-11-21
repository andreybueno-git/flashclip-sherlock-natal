/* Parte 2 do material: introdução ao Prolog (fatos). Texto fiel ao material básico do FlashClip. */
(function () {
  'use strict';
  var AMBIENTE = 'andreybueno-git.github.io/prolog-apresentacao-e-codigo/ambiente';
  window.FLASHCLIP_AMBIENTE = AMBIENTE;

  cena('parte2', {
    titulo: 'Parte 2: Introdução ao Prolog',
    corpo: `
      <div class="parte">
        <span class="parte__emblema" data-e>${icone('guirlanda')}<b>2</b></span>
        <div class="parte__texto">
          <p class="kicker" data-e>Parte 2</p>
          <h1 data-e>Introdução ao Prolog</h1>
          <span class="floreio" data-e>${icone('floreio')}</span>
          <p class="sub" data-e>Dar pistas e regras a um detetive e deixar o computador descobrir a resposta.</p>
        </div>
        ${ARTE.gravura({ w: 1700, h: 300, classe: 'parte__faixa', lua: [300, 92, 58], torre: .78, semente: 221 })}
      </div>`
  });

  folha('diferenca', {
    estampa: 'chave',
    kicker: 'Prolog · A grande diferença', titulo: 'Dois jeitos de falar com o computador',
    corpo: `
      <div class="grade g2 versus">
        <div class="cartao">
          <p class="sub">Linguagens famosas, como Python</p>
          <h3>Você diz <em>como</em> fazer.</h3>
          <p>É a receita de bolo.</p>
          <blockquote>“Vá na gaveta, abra, pegue a chave e abra a porta.”</blockquote>
        </div>
        <div class="cartao cartao--forte">
          <p class="sub">Prolog</p>
          <h3>Você diz <em>o que é verdade</em></h3>
          <p>(os fatos e as regras) e pergunta o resultado.</p>
          <blockquote>“A porta está trancada. A chave está na gaveta. Como abrir?”</blockquote>
        </div>
      </div>
      ${nota('A ideia', 'em vez de uma receita, o Prolog é como dar pistas e regras a um detetive.')}`
  });

  folha('usado', {
    estampa: 'dirigivel',
    kicker: 'Prolog · Onde é usado', titulo: 'Quem usa ou já usou Prolog',
    corpo: `
      <p class="lead">Alguns exemplos bem famosos de empresas e organizações.</p>
      <ol class="grade g5 telegramas">
        <li class="cartao"><span class="num">1</span><h3>IBM</h3><p>O supercomputador Watson</p></li>
        <li class="cartao"><span class="num">2</span><h3>NASA</h3><p>Estação Espacial Internacional</p></li>
        <li class="cartao"><span class="num">3</span><h3>Companhias aéreas</h3><p>Sistemas de viagem</p></li>
        <li class="cartao"><span class="num">4</span><h3>Oracle</h3></li>
        <li class="cartao"><span class="num">5</span><h3>Nokia</h3></li>
      </ol>`
  });

  folha('pilares', {
    estampa: 'colunas',
    kicker: 'Prolog · Como funciona', titulo: 'Três pilares principais',
    corpo: `
      <ol class="grade g3 pilares">
        <li class="cartao"><span class="num">1</span><h3>Fatos</h3><p class="sub">As verdades absolutas</p><p>Você diz ao programa o que é verdade no mundo dele.</p></li>
        <li class="cartao"><span class="num">2</span><h3>Regras</h3><p class="sub">A lógica da coisa</p><p>Você ensina o computador a deduzir novas informações a partir dos fatos.</p></li>
        <li class="cartao"><span class="num">3</span><h3>Consultas</h3><p class="sub">As perguntas</p><p>Você faz perguntas ao sistema, e ele busca a resposta nas regras e nos fatos.</p></li>
      </ol>`
  });

  folha('ambiente', {
    kicker: 'Mão na massa', titulo: 'Onde vamos escrever',
    corpo: `
      <div class="lado lado--40 ambiente">
        <div class="pilha">
          <p class="lead">Um ambiente pronto, direto no navegador.</p>
          <p><b>Sem instalar nada.</b><br>À esquerda: as pistas.<br>À direita: as perguntas.</p>
          <div class="ambiente__qr"><span class="qr" data-qr="https://${AMBIENTE}"></span><span class="ambiente__url">${AMBIENTE.replace('/prolog', '/<wbr>prolog').replace('/ambiente', '/<wbr>ambiente')}</span></div>
        </div>
        <figure class="moldura"><img src="img/ambiente-prolog.webp" alt="Tela do ambiente Prolog: caderno de pistas à esquerda e consultas à direita" width="940" height="534"></figure>
      </div>`
  });

  folha('fatos', {
    estampa: 'caderno',
    kicker: 'Prolog · Fatos', titulo: 'Construindo fatos',
    corpo: `
      <p class="lead">Um fato é uma <b>verdade absoluta</b> que você conta para o computador, como escrever anotações num caderno.</p>
      <p>A estrutura básica de um fato segue sempre este formato:</p>
      ${bloco('predicado(argumento1, argumento2).', { classe: 'codigo--grande' })}`
  });

  folha('estrutura', {
    estampa: 'relogio',
    kicker: 'Prolog · Fatos', titulo: 'Destrinchando a estrutura',
    corpo: `
      <figure class="codigo codigo--grande anatomia"><pre><span class="ln"><span class="parte-f pf1">predicado</span>(<span class="parte-f pf2">argumento1, argumento2</span>)<span class="parte-f pf3">.</span></span></pre></figure>
      <div class="grade g3">
        <div class="cartao an1" data-passo="1"><h3><code class="pl">predicado</code></h3><p>A relação ou a categoria. Ex.: <code class="pl">gosta</code>, <code class="pl">pai</code>, <code class="pl">gato</code>.</p></div>
        <div class="cartao an2" data-passo="2"><h3><code class="pl">argumentos</code></h3><p>Os elementos envolvidos. Ex.: <code class="pl">maria</code>, <code class="pl">pizza</code>.</p></div>
        <div class="cartao an3" data-passo="3"><h3>ponto final</h3><p>Obrigatório! Todo fato termina com um ponto, igual a uma frase finalizada.</p></div>
      </div>`
  });

  function ff(frase, fato, n) {
    return '<li><span class="ff__frase">' + frase + '</span><span class="ff__seta" aria-hidden="true"></span><span class="ff__fato" data-passo="' + n + '">' + pl(fato) + '</span></li>';
  }
  folha('frase-fato', {
    estampa: 'gato',
    kicker: 'Fatos · Exemplos práticos', titulo: 'Da frase ao fato', selo: 'aula',
    corpo: `
      <ul class="ff">
        ${ff('Maria gosta de pizza', 'gosta(maria, pizza).', 1)}
        ${ff('O Carlos é pai da Ana', 'pai(carlos, ana).', 2)}
        ${ff('O céu é azul', 'cor(ceu, azul).', 3)}
        ${ff('O Garfield é um gato', 'gato(garfield).', 4)}
      </ul>`
  });

  folha('maiuscula', {
    estampa: 'tipos-moveis',
    kicker: 'Fatos · Maiúsculas e minúsculas', titulo: 'Maiúscula ou minúscula?', selo: 'aula',
    corpo: `
      <p class="lead">No Prolog, o uso de maiúsculas e minúsculas faz toda a diferença.</p>
      <div class="grade g2">
        <div class="cartao">
          <p class="sub">Começou com minúscula</p>
          <p class="amostras amostras--atomo"><code>maria</code><code>pizza</code><code>carlos</code></p>
          <p>O Prolog entende que é um <b>nome fixo</b>: um dado real, um fato.</p>
        </div>
        <div class="cartao">
          <p class="sub">Começou com maiúscula</p>
          <p class="amostras amostras--var"><code>Maria</code><code>X</code><code>Pessoa</code></p>
          <p>O Prolog entende que é uma <b>variável</b>: uma incógnita que ele precisa descobrir.</p>
        </div>
      </div>`
  });

  folha('dois-tipos', {
    estampa: 'carimbos',
    kicker: 'Antes de começar', titulo: 'Dois tipos de slide',
    corpo: `
      <div class="grade g2 tipos-selo">
        <div class="cartao"><span class="selo selo--aula">Exemplo de aula</span><p>Explica um conceito com personagens soltos, como Maria, Carlos e Garfield. Não faz parte do caso.</p></div>
        <div class="cartao"><span class="selo selo--caso">A noite do crime</span><p>É a atividade central. As pistas são sempre as mesmas, do começo ao fim da aula.</p></div>
      </div>
      ${nota('Dica', 'procure o selo no canto superior direito de cada slide.')}`
  });
})();
