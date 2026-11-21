/* Ajustes do quiz. O quiz é opcional: a apresentação não depende dele.

   COMO OS CELULARES ENTRAM
   A tela do apresentador (quiz.html) pode ficar aberta no Mac, mas a página dos jogadores
   (jogar.html) precisa estar em um endereço público, senão o QR code não abre no celular.
   Depois de publicar esta pasta, ponha aqui o endereço público de jogar.html (ou cole no campo
   que aparece na própria tela do quiz, que guarda no navegador).

   COMO AS TELAS CONVERSAM
   Por um serviço público de mensagens (MQTT sobre WebSocket), sem conta e sem cadastro, nem para
   quem apresenta nem para quem joga. Só trafegam: o código da sala, os apelidos, as perguntas
   e as respostas. Se o primeiro serviço não responder, o quiz tenta o seguinte da lista. */
window.QUIZ_CONFIG = {
  urlJogador: 'https://andreybueno-git.github.io/flashclip-sherlock-natal/jogar.html',
  tempoPadrao: 20,
  perguntasPadrao: 10,
  corretores: [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081/mqtt'
  ]
};
