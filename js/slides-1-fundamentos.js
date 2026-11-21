/* Parte 1 do material: fundamentos da programação. Texto fiel ao material básico do FlashClip. */
(function () {
  'use strict';
  var pegadas = Array.from({ length: 11 }, function (_, n) {
    return '<span class="trilha__p" style="--n:' + n + '">' + icone('pegada') + '</span>';
  }).join('');

  cena('capa', {
    titulo: 'Do algoritmo ao Prolog',
    corpo: `
      <div class="capa">
        <div class="capa__texto">
          <p class="kicker" data-e>FlashClip · Material básico</p>
          <h1 data-e>Do algoritmo<br>ao <em>Prolog</em></h1>
          <span class="floreio" data-e>${icone('floreio')}</span>
          <p class="sub" data-e>Fundamentos de programação e a resolução do caso <em>A noite do crime</em>.</p>
        </div>
        <div class="capa__gravura" data-e>
          ${ARTE.gravura({ w: 640, h: 780, lua: [330, 300, 205], detetive: [40, 129, .93], torre: .03 })}
          <div class="tres-d" data-3d></div>
          ${icone('lupa', 'capa__lupa')}
        </div>
      </div>`
  });

  folha('roteiro', {
    kicker: 'Roteiro', titulo: 'O que vamos ver hoje',
    etapas: 3,
    corpo: `
      <ol class="grade g3 pastas">
        ${pasta({ aba: 'Pasta n.º 1', abre: 1, capa: '<h3>Fundamentos</h3>', dentro: '<h3>Fundamentos</h3><p>Algoritmo, linguagem de programação, compilador, variável e tipos de dados.</p>' })}
        ${pasta({ aba: 'Pasta n.º 2', abre: 2, capa: '<h3>Prolog</h3>', dentro: '<h3>Prolog</h3><p>Fatos, regras e consultas: dar pistas ao computador e deixar que ele descubra a resposta.</p>' })}
        ${pasta({ aba: 'Pasta n.º 3', abre: 3, capa: '<h3>O caso</h3>', dentro: '<h3>O caso</h3><p><em>A noite do crime</em>: a atividade central, que resolvemos juntos do começo ao fim da aula.</p>' })}
      </ol>`
  });

  cena('parte1', {
    titulo: 'Parte 1: Fundamentos da programação',
    corpo: `
      <div class="parte">
        <span class="parte__emblema" data-e>${icone('guirlanda')}<b>1</b></span>
        <div class="parte__texto">
          <p class="kicker" data-e>Parte 1</p>
          <h1 data-e>Fundamentos da programação</h1>
          <span class="floreio" data-e>${icone('floreio')}</span>
          <p class="sub" data-e>Algoritmo, linguagem de programação, compilador, variável e tipos de dados.</p>
        </div>
        ${ARTE.gravura({ w: 1700, h: 300, classe: 'parte__faixa', lua: [1380, 92, 58], torre: .1, semente: 1891 })}
      </div>`
  });

  folha('algoritmo', {
    kicker: 'Parte 1 · Algoritmo', titulo: 'O que é algoritmo?',
    corpo: `
      <p class="lead">Um algoritmo é simplesmente um <b>passo a passo</b> para resolver um problema.</p>
      <p>Na tecnologia, é exatamente isso: uma lista de ordens bem claras e organizadas que a gente dá para o computador executar uma tarefa.</p>
      <div class="trilha" aria-hidden="true">${pegadas}</div>
      ${nota('Lembre', 'o computador não “pensa” por si só. Ele apenas segue o passo a passo, em uma velocidade impressionante.')}`
  });

  folha('receita', {
    kicker: 'Parte 1 · Algoritmo', titulo: 'Pense numa receita de bolo',
    etapas: 1,
    corpo: `
      <div class="receita">
        <ol class="grade g4 passos-h">
          <li class="cartao"><span class="num">1</span><p>Pegar os ingredientes</p></li>
          <li class="cartao"><span class="num">2</span><p>Misturar tudo na tigela</p></li>
          <li class="cartao"><span class="num">3</span><p>Colocar no forno</p></li>
          <li class="cartao"><span class="num">4</span><p>Esperar assar</p></li>
        </ol>
        <p class="receita__veredito"><span class="receita__ok">Na ordem certa, o bolo sai perfeito.</span><span class="receita__erro">Trocou a ordem: o resultado dá errado.</span></p>
      </div>
      ${nota('A ordem importa', 'seguindo os passos na ordem certa, o bolo sai perfeito. Se pular um passo ou trocar a ordem, o resultado dá errado.')}`
  });

  folha('desafio1', {
    kicker: 'Desafio 1', titulo: 'Ensine um robô a escovar os dentes', classe: 'desafio',
    corpo: `
      <p class="lead">Diga os passos em ordem, um por um.</p>
      <ol class="respostas">
        <li data-passo="1"><b>Passo 1:</b> pegar a escova.</li>
        <li data-passo="2"><b>Passo 2:</b> colocar pasta na escova.</li>
        <li data-passo="3"><b>Passo 3:</b> escovar todos os dentes.</li>
      </ol>
      ${nota('Atenção', 'o computador não adivinha. Tudo precisa ser dito.')}`
  });

  folha('linguagem', {
    kicker: 'Parte 1 · Linguagem de programação', titulo: 'O que é uma linguagem de programação?', longo: true,
    corpo: `
      <p class="lead">É o “idioma” que usamos para conversar com o computador.</p>
      <p>Funciona como uma ponte: é criada com palavras parecidas com o inglês e com regras bem definidas.</p>
      <div class="ponte" aria-hidden="true"><span>você</span>${icone('ponte')}<span>computador</span></div>
      <div class="grade g2">
        <div class="cartao palavra"><code>print</code><span>para mostrar algo na tela</span></div>
        <div class="cartao palavra"><code>if</code><span>para dizer “se acontecer tal coisa, faça aquilo”</span></div>
      </div>`
  });

  folha('pratica', {
    kicker: 'Parte 1 · Linguagem de programação', titulo: 'Como funciona na prática?',
    corpo: `
      <ol class="grade g3">
        <li class="cartao"><span class="num">1</span><h3>Você escreve o código</h3><p>Você digita as ordens usando a linguagem de programação, por exemplo Python ou JavaScript.</p></li>
        <li class="cartao"><span class="num">2</span><h3>O tradutor entra em ação</h3><p>O computador não entende essa linguagem diretamente. Um programa tradutor converte o seu texto para zeros e uns.</p></li>
        <li class="cartao"><span class="num">3</span><h3>O computador executa</h3><p>A máquina lê tudo em milissegundos e faz o que você mandou: abrir um site, calcular um valor, mover um personagem no jogo.</p></li>
      </ol>`
  });

  var bits = ['0111', '0000', '0111', '0010', '0110', '1001', '0110', '1110', '0111', '0100', '0110', '1001', '0110', '0110', '0010', '1110'];
  folha('compilador', {
    kicker: 'Parte 1 · Compilador', titulo: 'O que é um compilador?',
    etapas: 1,
    corpo: `
      <p class="lead">É como um <b>tradutor oficial</b>.</p>
      <p>Ele pega todo o código que você escreveu e o traduz de uma só vez para a linguagem de máquina: os zeros e uns que o computador entende.</p>
      <div class="tradutor">
        <div class="cartao tradutor__lado">
          <h3>Seu código</h3><p class="sub">numa linguagem parecida com o inglês</p>
          <pre class="tradutor__src">print ...
if ...</pre>
        </div>
        <span class="tradutor__seta" aria-hidden="true"></span>
        <div class="cartao tradutor__meio">
          ${icone('lupa')}
          <h3>Compilador</h3><p class="sub">o tradutor oficial</p>
        </div>
        <span class="tradutor__seta" aria-hidden="true"></span>
        <div class="cartao tradutor__lado">
          <h3>Linguagem de máquina</h3><p class="sub">zeros e uns</p>
          <pre class="tradutor__bin">${bits.map(function (b, i) { return '<span style="--n:' + i + '">' + b + '</span>'; }).join(' ')}</pre>
        </div>
      </div>`
  });

  folha('livro', {
    kicker: 'Compilador · Analogia do livro', titulo: 'Pense em um tradutor de livros',
    corpo: `
      <div class="lado lado--60">
        <ol class="passos-v">
          <li><span class="num">1</span><p>Ele pega um livro inteiro escrito em inglês.</p></li>
          <li><span class="num">2</span><p>Traduz tudo para o português de uma vez só e cria um livro novo, pronto para ser lido.</p></li>
          <li><span class="num">3</span><p>Quando as pessoas vão ler, não precisam mais do tradutor, porque o livro já está inteiro no idioma delas.</p></li>
        </ol>
        <div class="livros" aria-hidden="true">
          <span class="livros__um livros__en">${icone('livro')}<b>inglês</b></span>
          <span class="tradutor__seta"></span>
          <span class="livros__um livros__pt">${icone('livro')}<b>português</b></span>
        </div>
      </div>
      ${nota('No computador', 'o compilador traduz o código inteiro e gera um arquivo final (como um <code class="pl">.exe</code> no Windows) que roda sozinho, na velocidade máxima.')}`
  });

  folha('variavel', {
    kicker: 'Parte 1 · Variável', titulo: 'O que é variável?',
    corpo: `
      <p class="lead">É como uma <b>caixinha com uma etiqueta</b>, onde o computador guarda uma informação para poder usar e alterar depois.</p>
      <div class="lado lado--40">
        <div class="caixa caixa--pequena" aria-hidden="true">${icone('caixa')}<span class="caixa__etiqueta">etiqueta</span><span class="caixa__valor">conteúdo</span></div>
        <div class="grade g1">
          <div class="cartao"><h3>A etiqueta</h3><p>É o nome da variável. Ele continua sempre o mesmo.</p></div>
          <div class="cartao"><h3>O conteúdo</h3><p>É o valor guardado lá dentro. Ele pode mudar.</p></div>
        </div>
      </div>`
  });

  folha('caixinha', {
    kicker: 'Variável · Analogia da caixinha', titulo: 'Uma caixa de sapatos com etiqueta',
    corpo: `
      <p>Pense numa caixa com um papel colado escrito “Dinheiro da Viagem”.</p>
      <div class="caixa-cena">
        <div class="dia"><span class="sub">Hoje</span><b>R$ 100</b></div>
        <div class="caixa" aria-hidden="true">
          <span class="caixa__valor caixa__valor--a">R$ 100</span>
          <span class="caixa__valor caixa__valor--b">R$ 150</span>
          ${icone('caixa')}
          <span class="caixa__etiqueta">Dinheiro da Viagem</span>
        </div>
        <div class="dia" data-passo="1"><span class="sub">Amanhã</span><b>R$ 150</b></div>
      </div>
      ${nota('Por isso se chama variável', 'o nome da caixa continua o mesmo, mas o valor que está lá dentro varia.')}`
  });

  folha('servem', {
    kicker: 'Parte 1 · Variável', titulo: 'Para que elas servem?',
    corpo: `
      <p class="lead">Sem variáveis, os programas não conseguiriam lembrar de nada!</p>
      <div class="grade g3">
        <div class="cartao"><p class="sub">Nome</p><p>Guardar o nome de quem acabou de entrar no site.</p></div>
        <div class="cartao"><p class="sub">Pontuação</p><p>Salvar a pontuação atual de um jogo.</p></div>
        <div class="cartao"><p class="sub">Valor total</p><p>Guardar o valor total do carrinho de compras em um aplicativo de delivery.</p></div>
      </div>`
  });

  folha('tipos', {
    kicker: 'Parte 1 · Tipos de dados', titulo: 'Tipos de dados',
    corpo: `
      <p class="lead">São as etiquetas de categorias que dizem ao computador que tipo de informação ele está guardando.</p>
      <p>Assim como você separa roupas, dinheiro e documentos em lugares diferentes, o computador precisa saber com o que está lidando para não fazer contas erradas.</p>
      <div class="grade g4 gavetas">
        <div class="cartao gaveta"><h3>Texto</h3><code>String</code></div>
        <div class="cartao gaveta"><h3>Número inteiro</h3><code>Integer</code></div>
        <div class="cartao gaveta"><h3>Número decimal</h3><code>Float</code></div>
        <div class="cartao gaveta"><h3>Lógico</h3><code>Boolean</code></div>
      </div>`
  });

  function amostras(lista) {
    return '<p class="amostras">' + lista.map(function (a) { return '<code>' + a + '</code>'; }).join('') + '</p>';
  }
  function cartao(sub, txt) { return '<div class="cartao"><p class="sub">' + sub + '</p><p>' + txt + '</p></div>'; }

  folha('tipo-texto', {
    kicker: 'Tipos de dados · 1 de 4', titulo: 'Texto (String)',
    corpo: `
      <p class="lead">São palavras, frases ou letras.</p>
      ${amostras(['"João"', '"Rua Principal"', '"Senha123"'])}
      <div class="grade g2">
        ${cartao('Regra de ouro', 'Na programação, eles sempre vêm entre aspas.')}
        ${cartao('Onde se usa', 'Nome de usuário, mensagens de chat, endereços.')}
      </div>`
  });

  folha('tipo-inteiro', {
    kicker: 'Tipos de dados · 2 de 4', titulo: 'Número inteiro (Integer)',
    corpo: `
      <p class="lead">São números sem vírgula, que podem ser positivos, negativos ou zero.</p>
      ${amostras(['42', '-7', '2026', '0'])}
      <div class="grade g1 estreita">
        ${cartao('Onde se usa', 'Contar itens, idade, quantidade de vidas em um jogo.')}
      </div>`
  });

  folha('tipo-decimal', {
    kicker: 'Tipos de dados · 3 de 4', titulo: 'Número decimal (Float)',
    corpo: `
      <p class="lead">São números que têm parte quebrada (casas decimais).</p>
      ${amostras(['19.90', '1.75', '-0.5'])}
      <div class="grade g2">
        ${cartao('Regra de ouro', 'Na programação, usamos ponto em vez de vírgula: <code class="pl">9.99</code> e não <code class="pl">9,99</code>.')}
        ${cartao('Onde se usa', 'Preços, medidas, porcentagens, temperaturas.')}
      </div>`
  });

  folha('tipo-logico', {
    kicker: 'Tipos de dados · 4 de 4', titulo: 'Lógico (Boolean)',
    etapas: 1,
    corpo: `
      <div class="lado lado--70">
        <div class="pilha">
          <p class="lead">É o tipo mais simples de todos: só aceita duas respostas. Ou é Verdadeiro (True), ou é Falso (False).</p>
          <p class="amostras amostras--logico"><code class="am-true">True</code><code class="am-false">False</code></p>
          <div class="grade g2">
            ${cartao('Pense num interruptor de luz', 'Ou está ligado, ou está desligado.')}
            ${cartao('Onde se usa', 'Responder perguntas de sim ou não, como “O usuário está logado?” ou “O frete é grátis?”.')}
          </div>
        </div>
        <div class="poste" aria-hidden="true">
          <span class="poste__brilho"></span><span class="poste__chama"></span>
          ${icone('lampiao')}
          <span class="poste__chave"><i></i></span>
        </div>
      </div>`
  });

  folha('revisao1', {
    kicker: 'Revisão · Parte 1', titulo: 'O que vimos nos fundamentos',
    corpo: `
      <ol class="revisao">
        <li><span class="num">1</span><h3>Algoritmo</h3><p>Um passo a passo para resolver um problema.</p></li>
        <li><span class="num">2</span><h3>Linguagem</h3><p>O “idioma” para conversar com o computador.</p></li>
        <li><span class="num">3</span><h3>Compilador</h3><p>O tradutor oficial: traduz o código inteiro de uma só vez.</p></li>
        <li><span class="num">4</span><h3>Variável</h3><p>Uma caixinha com etiqueta: o nome fica, o valor varia.</p></li>
        <li><span class="num">5</span><h3>Tipos de dados</h3><p>Texto, número inteiro, número decimal e lógico.</p></li>
      </ol>`
  });
})();
