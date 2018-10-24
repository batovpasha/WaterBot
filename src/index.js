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

const ORDER = {
  bottle: '',
  quantity: '',
  address: ''
};

const ASSORTMENT_OF_GOODS = [ 'Бутиль 20л',   // associated with keyboard buttons by index 
                              'Пляшка 4л', 
                              'Пляшка 0.5л' ];

const TO_ORDER_KEYBOARD = { // keyboard with button for making order
  'Type': 'keyboard',
  'InputFieldState': 'hidden',
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
  'InputFieldState': 'hidden',
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
  'InputFieldState': 'hidden',
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

const PAYMENT_METHOD_KEYBOARD = { 
  'Type': 'keyboard',
  'InputFieldState': 'hidden',
	'Buttons': [
		{
			'Columns': 6,
			'Rows': 1,
			'BgColor': '#e6f5ff',
      'Text': 'Безготівковий розрахунок',
			'ActionType': 'reply',
			'ActionBody': '/cashlessPayment'
    },
    {
			'Columns': 6,
			'Rows': 1,
			'BgColor': '#e6f5ff',
      'Text': 'Сплата готівкою',
			'ActionType': 'reply',
			'ActionBody': '/cashPayment'
		}
	]
};


const say = (response, message) => {
  return response.send(new TextMessage(message));
};

bot.onTextMessage(/".*"/, (message, response) => {
  ORDER['address'] = message.text.match(/[^"].*[^"]/).join(''); // value without ""
    
  return response.send(new KeyboardMessage(PAYMENT_METHOD_KEYBOARD));
});

bot.onTextMessage(/\/\/d+/, (message, response) => {
  ORDER['quantity'] = message.text;

  return response.send(new KeyboardMessage(PAYMENT_METHOD_KEYBOARD));
});

bot.onSubscribe(response => {
  say(response, `Привіт, ${response.userProfile.name}.` +  
                `Я ${bot.name}! Я допоможу вам зробити замовлення.` +
                `Введіть будь який текс, аби зробити замовлення.`);
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {  
  switch (message.text) {
  
    case '/firstBottleFromAssortment':
      ORDER['bottle'] = ASSORTMENT_OF_GOODS[0];
  
      say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');
  
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/secondBottleFromAssortment':
      ORDER['bottle'] = ASSORTMENT_OF_GOODS[1];
  
      say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');
    
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/thirdBottleFromAssortment':
      ORDER['bottle'] = ASSORTMENT_OF_GOODS[2];
  
      say(response, 'Оберіть бажану кількість товару, або введіть своє значення:');
  
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/oneToOrder':
      ORDER['quantity'] = 1;
    
      return say(response, 'Вкажіть адресу доставки у лапках(""):');
      break;
  
    case '/twoToOrder':
      ORDER['quantity'] = 2;
  
      return say(response, 'Вкажіть адресу доставки у лапках(""):');
      break;
  
    case '/fiveToOrder':
      ORDER['quantity'] = 5;
  
      return say(response, 'Вкажіть адресу доставки у лапках(""):');
      break;
  
    case '/makeOrder':
      return response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
      break;

    case '/manualInput':
      return say(response, 'Будь ласка, введіть бажану кількість товару\n' + 
                           'Перед вашим числом має стояти слеш "/"');
      
      
    // case message.text.toSting().match(/".*"/ig).join(''):
    //   ORDER['address'] = message.text.toSring().match(/[^"].*[^"]/).join(''); // value without ""
      
    //   return response.send(new TextMessage('everything is ok!'));
    //   break;
  }
  
  say(response, 'Введіть будь який текст, аби зробити замовлення ' + 
                'та використовуйте, будь-ласка, кнопки \u2193');
  
  return response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
});


http.createServer(bot.middleware())
    .listen(port, () => bot.setWebhook("https://kryo-bot.herokuapp.com/")); 