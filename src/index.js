'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

const winston = require('winston');
const toYAML = require('winston-console-formatter');

const http = require('http');
const port = process.env.PORT || 8080;

const createLogger = () => {
  const logger = new winston.Logger({
    level: "debug"
  });

  logger.add(winston.transports.Console, toYAML.config());
  
  return logger;
};

const logger = createLogger();

const bot = new ViberBot(logger, {
  authToken: '489504805567d0e4-fc4db6f42aca801e-5071919865b61d88',
  name: 'KryoBot',
  avatar: '' // use default avatar
});

let BOTTLE_TO_ORDER, QUANTITY_TO_ORDER, SHIPPING_ADDRESS;

const ASSORTMENT_OF_GOODS = [ 'Бутиль 20л',   // associated with keyboard buttons by index 
                              'Пляшка 4л', 
                              'Пляшка 0.5л' ];

const TO_ORDER_KEYBOARD = { // keyboard with button for making order
	'Type': 'keyboard',
	'Revision': 1,
	'Buttons': [
		{
			'Columns': 6,
			'Rows': 1,
			'BgColor': '#e6f5ff',
      'Text': 'Замовити',
			'ActionType': 'reply',
			'ActionBody': '/makeOrder'
		}
	]
};

const ORDER_MENU_KEYBOARD = {
  'Type': 'keyboard',
  'Revision': 1,
  'Buttons': [
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': ASSORTMENT_OF_GOODS[0],
      'ActionType': 'reply',
      'ActionBody': '/firstBottleFromAssortment'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': ASSORTMENT_OF_GOODS[1],
      'ActionType': 'reply',
      'ActionBody': '/secondBottleFromAssortment'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': ASSORTMENT_OF_GOODS[2],
      'ActionType': 'reply',
      'ActionBody': '/thirdBottleFromAssortment'
    }  
  ]
};

const QUANTITY_TO_ORDER_KEYBOARD = {
  'Type': 'keyboard',
  'Revision': 1,
  'Buttons': [
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': '1 шт.',
      'ActionType': 'reply',
      'ActionBody': '/keyboardOfGoodsQuantity'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': '2 шт.',
      'ActionType': 'reply',
      'ActionBody': '/keyboardOfGoodsQuantity'

    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': '5 шт.',
      'ActionType': 'reply',
      'ActionBody': '/keyboardOfGoodsQuantity'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': 'Ручний ввід',
      'ActionType': 'reply',
      'ActionBody': '/keyboardOfGoodsQuantity'
    }
  ]
};

const say = (response, message) => {
  response.send(new TextMessage(message));
};

bot.onSubscribe(response => {
  say(response, `Привіт, ${response.userProfile.name}. 
                 Я ${bot.name}! Я допоможу вам зробити замовлення.`);
});

bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {
  //
  //
  //  
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  if (!(message instanceof TextMessage))
    say(response, 'Вибачте. Я розумію лише текстові повідомлення.');

  // say(response, 'Використовуйте, будь-ласка, кнопки \u2193');

  // response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/firstBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[0];
  
  response.send(new KeyboarMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/secondBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[1];

  response.send(new KeyboarMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/thirdBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[2];

  response.send(new KeyboarMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/makeOrder/, (message, response) => {
  response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
});

bot.onTextMessage(/./, (message, response) => {
  say(response, 'Використовуйте, будь-ласка, кнопки \u2193'); 

  response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
});

http.createServer(bot.middleware())
    .listen(port, () => bot.setWebhook("https://kryo-bot.herokuapp.com/"));
