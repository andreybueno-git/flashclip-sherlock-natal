# FlashClip: do algoritmo ao Prolog (Sherlock Holmes no Natal)

Apresentação do minicurso do grupo de Paradigmas (paradigma lógico, Prolog), feita a partir do
"Material básico FlashClip: do algoritmo ao Prolog". São os 61 slides do material, na mesma ordem,
com o texto do material. O visual é de impresso de época: página de revista vitoriana em edição de
Natal, com gravuras a traço, pastas confidenciais e o caso "A noite do crime".

## Abrir

Dê dois cliques em `index.html` (abre direto do Mac, sem internet) ou sirva a pasta:

```bash
python3 -m http.server 4187 --bind 127.0.0.1
```

e abra `http://localhost:4187`.

## Atalhos

| Tecla | O que faz |
|---|---|
| `→` `Espaço` `Page Down` | Avança: primeiro as etapas do slide, depois o próximo slide |
| `←` `Page Up` | Volta |
| `Home` `End` | Primeiro e último slide |
| `O` | Organizar a ordem dos slides |
| `C` | Passar os slides pelo celular (mostra um QR code) |
| `F` | Tela cheia |
| `?` | Ajuda |

## Mudar a ordem dos slides

Aperte `O` (ou o botão Organizar). Arraste as miniaturas, use os botões ◀ ▶ de cada uma, ou o
teclado: setas escolhem, `Espaço` pega e solta, `Alt` + setas move direto, `Enter` abre o slide.
Há "Desfazer" e "Voltar à ordem original". A ordem fica guardada no navegador em que você
organizou, no mesmo endereço (abrir pelo arquivo e abrir pelo `localhost` guardam ordens separadas).

## Quiz (opcional)

O botão Quiz abre `quiz.html`, a tela do apresentador: QR code, quem entrou, pergunta, contagem
e placar. Quem joga abre `jogar.html` pelo QR code, escolhe um apelido e responde; não precisa
de conta. As perguntas estão em `js/quiz-perguntas.js` (a primeira opção de cada uma é a certa).

## Controle pelo celular (opcional)

Aperte `C` na apresentação: aparece um QR code. O celular abre `controle.html`, com os botões
Avançar e Voltar e o nome do slide atual e do próximo.

## O que o quiz e o controle precisam

- Internet no Mac e nos celulares. As telas conversam por um serviço público de mensagens (MQTT
  sobre WebSocket), sem conta. Trafegam só o código da sala, apelidos, perguntas e respostas.
  A lista de serviços está em `js/quiz-config.js`; se o primeiro falhar, tenta o seguinte.
- As páginas do celular (`jogar.html` e `controle.html`) precisam estar em um endereço público.
  A apresentação em si pode continuar aberta do Mac: publique a pasta e cole o endereço público
  no campo que aparece junto do QR code (ou em `urlJogador`, em `js/quiz-config.js`).
- Para ensaiar sem internet, no mesmo navegador: `quiz.html?t=local` e `index.html?t=local`.

## Arquivos

- `index.html`, `css/tema.css`, `css/slides.css`, `css/organizar.css`: a apresentação.
- `js/deck.js`: navegação, etapas, ordem editável. `js/arte.js`: as gravuras (SVG próprio).
- `js/slides-*.js`: o conteúdo dos 61 slides. Cada slide tem um `id` fixo; não troque os ids,
  é por eles que a ordem escolhida é guardada.
- `quiz.html`, `jogar.html`, `controle.html`, `js/quiz-*.js`, `js/controle-*.js`, `css/quiz.css`.
- `fontes/`: Besley, Libre Baskerville, IBM Plex Mono, Charm e UnifrakturCook, esta só no nome
  do jornal (SIL OFL 1.1; licenças e procedência na própria pasta).
- Layout em duas metades: do slide 1 ao 29 a página é de revista; do slide 30 ("A noite do
  crime") em diante vira jornal de época, "O Correio de Baker Street", com manchete e colunas
  (`css/jornal.css`). O layout acompanha o slide, não a posição: se você mudar a ordem, cada
  slide leva o seu.
- Gravuras geradas no Higgsfield para este projeto: os retratos de Ana, Leo e Bia e a mesa da
  festa em duas versões (com a fatia e com o prato vazio), em `img/`. São pessoas inventadas.
- Página inteira estilizada (`css/pagina.css`): em 38 slides o espaço livre da página leva uma
  estampa, isto é, uma gravura de época ligada ao assunto (ábaco no número inteiro, balança no
  decimal, gaveteiro nos tipos de dados, caixa de tipos em maiúscula e minúscula, e assim por
  diante). Ela entra como vinheta embaixo do texto, entre dois fios, ou numa coluna à direita.
  As imagens são `img/est-*.webp` (tinta com transparência, para parecer impressa no papel) e as
  medidas ficam em `js/estampas.js`. Para pôr ou trocar a estampa de um slide, use a opção
  `estampa` na chamada `folha(...)` em `js/slides-*.js`: `estampa: 'abaco'` (vinheta) ou
  `estampa: { img: 'abaco', onde: 'lado' }` (coluna). Uma gravura nova entra pelo roteiro
  `ferramentas/estampas.py`, que converte o PNG em preto e branco e refaz `js/estampas.js`.
  As estampas são só ilustração: não acrescentam texto ao material.
- A moldura das páginas de revista tem cantoneiras, e em volta da folha aparece uma mesa de
  madeira quando a janela não tem a proporção 16:9 (em tela cheia num projetor 16:9 ela não
  aparece).
- Pastas confidenciais em 3D (roteiro, suspeitos e fichas): começam fechadas, com o carimbo na
  capa, e cada seta para a frente abre uma. A do caso abre sozinha ao entrar no slide.
- `js/tres-d.js`, `js/modelo-busto.js` e `js/modelo-pizza.js`: as peças em 3D, o busto do
  detetive que gira na capa e a fatia de pizza ao lado do culpado (modelos GLB gerados no
  Higgsfield a partir de imagem própria, embutidos em base64 para abrir também direto do
  arquivo). Se o 3D não carregar, fica o desenho.
- `vendor/`: `mqtt.min.js` (MQTT.js 5.16.1, MIT), `qrcode.js` (qrcode-generator 1.5.2, MIT) e
  `model-viewer-umd.min.js` (@google/model-viewer 4.4.0, Apache-2.0).
- `img/ambiente-prolog.webp`: a captura do ambiente, tirada do material.

## O que foi conferido e o que não foi

Conferido no navegador (Chromium), em 20 e 21/11/2026: os 61 slides sem estouro de texto; o modo
organizar com arrasto de verdade, botões, teclado, desfazer, ordem original e ordem guardada após
recarregar; o quiz com a tela do apresentador e dois celulares simulados pelo serviço público real
(entrada, respostas, pontuação, pódio, remoção de jogador); o controle pelo celular (avançar,
voltar, slide atual). Em 21/11, depois das estampas: os 61 slides medidos de novo (nenhum texto
estourando, nenhuma imagem quebrada), a apresentação percorrida do começo ao fim e o modo
organizar aberto e fechado. O quiz e o controle não foram refeitos depois das estampas (os
arquivos deles não mudaram). Não conferido: celular de verdade lendo o QR code (depende de publicar),
Safari e Firefox, projetor, e a sala cheia (o teste foi com dois jogadores).
