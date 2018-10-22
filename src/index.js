'use strict';

const ViberBot        = require('viber-bot').Bot;
const BotEvents       = require('viber-bot').Events;
const TextMessage     = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

const winston = require('winston');
const toYAML  = require('winston-console-formatter');

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
      'ActionBody': '/oneToOrder'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': '2 шт.',
      'ActionType': 'reply',
      'ActionBody': '/twoToOrder'

    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': '5 шт.',
      'ActionType': 'reply',
      'ActionBody': '/fiveToOrder'
    },
    {
      'Columns': 6,
      'Rows': 1,
      'BgColor': '#e6f5ff',
      'Text': 'Введіть своє значення та натисність \'відправити\'',
      'ActionType': 'reply',
      'ActionBody': '/manualInput'
    }
  ]
};

const say = (response, message) => {
  response.send(new TextMessage(message));
};

bot.onSubscribe(response => {
  say(response, `Привіт, ${response.userProfile.name}.` +  
                `Я ${bot.name}! Я допоможу вам зробити замовлення.` +
                `Введіть будь який текс, аби зробити замовлення.`);
});

bot.onTextMessage(/\/firstBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[0];

  say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');

  return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/secondBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[1];

  say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');
  
  return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/thirdBottleFromAssortment/, (message, response) => {
  BOTTLE_TO_ORDER = ASSORTMENT_OF_GOODS[2];

  say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');

  return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
});

bot.onTextMessage(/\/oneToOrder/, (message, response) => {
  QUANTITY_TO_ORDER = 1;

});

bot.onTextMessage(/\/twoToOrder/, (message, response) => {
  QUANTITY_TO_ORDER = 1;

  
});

bot.onTextMessage(/\/fiveToOrder/, (message, response) => {
  QUANTITY_TO_ORDER = 1;

  
});

bot.onTextMessage(/\/manualInput/, (message, response) => {
  QUANTITY_TO_ORDER = 1;

  say(response, `Введіть, будь ласка, бажану кількість даного товару:`);

  bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    if (isNaN(message.text)) 
      say(response, `Некоректе значення!`);

    else {
      QUANTITY_TO_ORDER = parseInt(message.text);

      say(response, message.text);
    } 
  });
});

bot.onTextMessage(/\/makeOrder/, (message, response) => {
  return response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
});

bot.onTextMessage(/./, (message, response) => {
  say(response, 'Введіть будь який текст, аби зробити замовлення ' + 
                'та використовуйте, будь-ласка, кнопки \u2193');

  return response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
});

http.createServer(bot.middleware())
    .listen(port, () => bot.setWebhook("https://kryo-bot.herokuapp.com/"));
