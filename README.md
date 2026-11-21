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
- `fontes/`: Besley, Libre Baskerville, IBM Plex Mono e Charm (SIL OFL 1.1; licenças e
  procedência na própria pasta).
- `vendor/`: `mqtt.min.js` (MQTT.js 5.16.1, MIT) e `qrcode.js` (qrcode-generator 1.5.2, MIT).
- `img/ambiente-prolog.webp`: a captura do ambiente, tirada do material.

## O que foi conferido e o que não foi

Conferido no navegador (Chromium), em 20 e 21/11/2026: os 61 slides sem estouro de texto; o modo
organizar com arrasto de verdade, botões, teclado, desfazer, ordem original e ordem guardada após
recarregar; o quiz com a tela do apresentador e dois celulares simulados pelo serviço público real
(entrada, respostas, pontuação, pódio, remoção de jogador); o controle pelo celular (avançar,
voltar, slide atual). Não conferido: celular de verdade lendo o QR code (depende de publicar),
Safari e Firefox, projetor, e a sala cheia (o teste foi com dois jogadores).
