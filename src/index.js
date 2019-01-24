'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const AgileCRMManager = require('./agilecrm.js');

const winston = require('winston');
const toYAML = require('winston-console-formatter');

const http = require('http');
const port = process.env.PORT || 8080;

const obj = new AgileCRMManager('kryo-bot', 
                                '7676j5j565a3i64133b0ejn8rq',
                                'ns@z-digital.net');

const success = data => data;
    
const error = data => data;

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
  bottle: [],
  quantity: [],
  address: ''
};

const ASSORTMENT_OF_GOODS = [ // associated with keyboard buttons by index 
  'Бутиль 20л ПЕТ',     
  'Бутиль 20л метал', 
  'Пляшка 1л ПЕТ' 
];

const PRICE_LIST = {
  'Бутиль 20л ПЕТ': 125,
  'Бутиль 20л метал': 160,
  'Пляшка 1л ПЕТ': 20
};

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
      'Text': 'Інше значення',
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

const CONFIRM_KEYBOARD = { 
  'Type': 'keyboard',
  'InputFieldState': 'hidden',
	'Buttons': [
		{
			'Columns': 6,
			'Rows': 1,
			'BgColor': '#e6f5ff',
      'Text': 'Підтвердити',
			'ActionType': 'reply',
			'ActionBody': '/confirm'
    },
    {
			'Columns': 6,
			'Rows': 1,
			'BgColor': '#e6f5ff',
      'Text': 'Скасувати',
			'ActionType': 'reply',
			'ActionBody': '/cancel'
		}
	]
};

const say = (response, message) => response.send(new TextMessage(message));

bot.onSubscribe(response => {
  say(response, `Привіт, ${response.userProfile.name}.` +  
                `Я ${bot.name}! Я допоможу вам зробити замовлення.\n` +
                `Введіть "/замовити", аби сформувати замовлення.\n` +
                'Прайс-лист:\n' +
                'Бутиль 20л ПЕТ - 125 грн\n' +
                'Бутиль 20л метал - 160 грн\n' +
                'Пляшка 1л ПЕТ - 20 грн');
});

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
  onFinish(new TextMessage(`Привіт, ${userProfile.name}! Радий Вас бачити.\n` +
                           'Введіть "/замовити", аби сформувати замовлення.\n' +
                           'Прайс-лист:\n' +
                           'Бутиль 20л ПЕТ - 125 грн\n' +
                           'Бутиль 20л метал - 160 грн\n' +
                           'Пляшка 1л ПЕТ - 20 грн'));
});
 
bot.onTextMessage(/\/[1-9][0-9]*/, (message, response) => {
  ORDER['quantity'].push(parseInt(message.text.match(/[^/].*/).join(''))); // number without '/'
  
  say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
              + 'аби додати ще щось до свого замовлення введіть "/асортимент"')
    
    .then(() => say(response, 'Якщо бажаєте продовжити,\n'  
                            + 'вкажіть адресу доставки у трикутних дужках <>\n'
                            + 'Приклад: <вул. Бажана, 42, кв. 20>'));
});

bot.onTextMessage(/<.*>/, (message, response) => {  
  ORDER['address'] = message.text.match(/[^<].*[^>)]/).join(''); // value without ""
    
  response.send(new KeyboardMessage(PAYMENT_METHOD_KEYBOARD));
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {    
  let post;
  
  switch (message.text) {  
    case '/замовити':
      response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
      break;

    case '/makeOrder':
      response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
      break;

    case '/firstBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[0]);
  
      response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/secondBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[1]);
    
      response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/thirdBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[2]);
  
      response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/oneToOrder':
      ORDER['quantity'].push(1);

      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      say(response, 'Якщо бажаєте продовжити,\n'  
                  + 'вкажіть адресу доставки у трикутних дужках <>\n'
                  + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/twoToOrder':
      ORDER['quantity'].push(2);
  
      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      say(response, 'Якщо бажаєте продовжити,\n'  
                  + 'вкажіть адресу доставки у трикутних дужках <>\n'
                  + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/fiveToOrder':
      ORDER['quantity'].push(5);
    
      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      say(response, 'Якщо бажаєте продовжити,\n'  
                  + 'вкажіть адресу доставки у трикутних дужках <>\n'
                  + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/manualInput':
      say(response, 'Будь ласка, введіть бажану кількість товару\n' + 
                    'Перед вашим числом має стояти слеш "/"');
      break;
      
    case '/cashPayment':
      let cashPrice = 0;
      let cashOrder = 'Ваше замовлення:\n';
  
      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashPrice += PRICE_LIST[ORDER['bottle'][i]] * parseInt(ORDER['quantity'][i]);

      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashOrder += `${ORDER['bottle'][i]}, ${ORDER['quantity'][i]} шт.\n`

      cashOrder += `Адреса доставки: ${ORDER['address']}\n` +
                   'Оплата готівкою\n' +
                   `Вартість: ${cashPrice} грн`;
      
      const cashDeal = {
        "name": response.userProfile.name,
        "expected_value": cashPrice.toString(),
        "probability": "100",
        "close_date": 1455042600,
        "milestone": "progress",
        "contact_ids": [
          "5630121163620352"
        ],
        "description": cashOrder
      };
                  
      obj.contactAPI.createDeal(cashDeal, success, error);                 
      
      say(response, cashOrder);
      say(response, 'Введіть "/ок" для підтвердження або скасування замовлення');
      break;     

    case '/cashlessPayment':
      let cashlessPrice = 0;
      let cashlessOrder = 'Ваше замовлення:\n';
  
      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashlessPrice += PRICE_LIST[ORDER['bottle'][i]] * parseInt(ORDER['quantity'][i]);
      
      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashlessOrder += `${ORDER['bottle'][i]}, ${ORDER['quantity'][i]} шт.\n`

      cashlessOrder += `Адреса доставки: ${ORDER['address']}\n ` +
                       'Безготівковий розрахунок\n ' +
                       `Вартість: ${cashlessPrice} грн`; 

      const cashlessDeal = {
        "name": response.userProfile.name,
        "expected_value": cashlessPrice.toString(),
        "probability": "100",
        "close_date": 1455042600,
        "milestone": "progress",
        "contact_ids": [
          "5630121163620352"
        ],
        "description": cashlessOrder
      };
                  
      obj.contactAPI.createDeal(cashlessDeal, success, error);                 

      say(response, cashlessOrder);
                       
      const cashlessOrderForUrl = cashlessOrder.split(' ').join('-').split('\n').join('-').split(':').join('-');
    
      const url = `https://api.fondy.eu/api/checkout?button=%7B%22merchant_id%22%3A1415599%2C%22currency%22%3A%22UAH%22%2C%22fields%22%3A%5B%7B%22name%22%3A%22id-95iJMmbgTm%22%2C%22label%22%3A%22%D0%9D%D0%BE%D0%BC%D0%B5%D1%80%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%22%2C%22valid%22%3A%22required%22%7D%2C%7B%22name%22%3A%22id-LCGvTNvXn7%22%2C%22label%22%3A%22%D0%A4%D0%98%D0%9E%22%2C%22valid%22%3A%22required%22%7D%2C%7B%22name%22%3A%22id-adpgQ8AFYf%22%2C%22label%22%3A%22%D0%9A%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%20%D0%B4%D0%BE%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F%3A%22%2C%22valid%22%3A%22max_length%3A1000%3B%22%7D%5D%2C%22params%22%3A%7B%22response_url%22%3A%22%7Bresponse_url%7D%22%2C%22lang%22%3A%22uk%22%2C%22order_desc%22%3A%22${cashlessOrderForUrl.toString()}%22%7D%2C%22amount%22%3A%22${cashlessPrice.toString()}%22%2C%22amount_readonly%22%3Atrue%7D`;

      say(response, 'Будь ласка, перейдіть за посиланням та оплатіть замовлення')
        .then(() => say(response, url))
        .then(() => say(response, 'Введіть "/ок" для підтвердження або скасування замовлення'));
      break;

    case '/ок':
      response.send(new KeyboardMessage(CONFIRM_KEYBOARD));
      break;

    case '/confirm':
      say(response, 'Дякуємо за замовлення!\n' +
                    'Ми зв\'яжемося з Вами у найближчий час');
      break;
    
    case '/асортимент':
      response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
      break;
    
    case '/cancel':
      ORDER['bottle'] = [];
      ORDER['quantity'] = [];
      ORDER['address'] = '';

      say(response, 'Гарного дня!');
      break;

    case '/скинути':
      ORDER['bottle'] = [];
      ORDER['quantity'] = [];
      ORDER['address'] = '';

      say(response, 'Замовлення очищене!\n'
                  + 'Введіть "/замовити", аби сформувати нове замовлення');
      break;
}

  if (message.text[0] !== '/' && message.text[0] !== '<')
    return say(response, 'Введіть "/замовити", аби сформувати замовлення\n'
                       + 'Введіть "/скинути", аби очистити введені дані про замовлення\n'
                       + 'Прайс-лист:\n'
                       + 'Бутиль 20л ПЕТ - 125 грн\n'
                       + 'Бутиль 20л метал - 160 грн\n'
                       + 'Пляшка 1л ПЕТ - 20 грн');
});

http.createServer(bot.middleware())
    .listen(port, () => bot.setWebhook("https://kryo-bot.herokuapp.com/")); 
