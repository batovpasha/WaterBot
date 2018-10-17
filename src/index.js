'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

const winston = require('winston');
const toYAML = require('winston-console-formatter');
const ngrok = require('./get_public_url');

const createLogger = () => {
  const logger = new winston.Logger({
    level: "debug" // We recommend using the debug level for development
  });

  logger.add(winston.transports.Console, toYAML.config());
  
  return logger;
};

const say = (response, message) => {
  response.send(new TextMessage(message));
};

const logger = createLogger();

const bot = new ViberBot(logger, {
  authToken: "489504805567d0e4-fc4db6f42aca801e-5071919865b61d88",
  name: "KryoBot",
  avatar: "" // use default avatar
});


const SAMPLE_KEYBOARD = {
	"Type": "keyboard",
	"Revision": 1,
	"Buttons": [
		{
			"Columns": 6,
			"Rows": 1,
			"BgColor": "#e6f5ff",
			"BgMedia": "http://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg",
			"BgMediaType": "picture",
            "BgLoop": true,
            "Text": "Замовити",
			"ActionType": "reply",
			"ActionBody": "Yes"
		}
	]
};


bot.onSubscribe(response => {
  say(response, `Привіт, ${response.userProfile.name}. 
                 Я ${bot.name}! Я допоможу вам зробити замовлення.`);
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  if (!(message instanceof TextMessage))
    say(response, `Вибачте. Я розумію лише текстові повідомлення.`);
});

bot.onTextMessage(/зробити замовлення/i, (message, response) => {
    response.send(new KeyboardMessage(SAMPLE_KEYBOARD));
});

bot.onTextMessage(/./, (message, response) => {
  say(response, `Перепрошую, ви написали '${message.text}'?`);
});


if (process.env.NOW_URL || process.env.HEROKU_URL) {
  const http = require('http');
  const port = process.env.PORT || 8080;

  http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    logger.debug('Could not find the now.sh/Heroku environment variables. Trying to use the local ngrok server.');
    return ngrok.getPublicUrl().then(publicUrl => {
      const http = require('http');
      const port = process.env.PORT || 8080;

      http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

    }).catch(error => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
        process.exit(1);
    });
}
