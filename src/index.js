'use strict';

const ViberBot        = require('viber-bot').Bot;
const BotEvents       = require('viber-bot').Events;
const TextMessage     = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const UrlMessage      = require('viber-bot').Message.Url;

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
  bottle: [],
  quantity: [],
  address: ''
};

const ASSORTMENT_OF_GOODS = [ 'Бутиль 20л ПЕТ',   // associated with keyboard buttons by index 
                              'Бутиль 20л метал', 
                              'Пляшка 1л ПЕТ' ];

const PRICE_LIST = 
{
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
              + 'аби додати ще щось до свого замовлення введіть "/асортимент"');

  return say(response, 'Якщо бажаєте продовжити,\n'  
                     + 'вкажіть адресу доставки у трикутних дужках <>\n'
                     + 'Приклад: <вул. Бажана, 42, кв. 20>');
});

bot.onTextMessage(/<.*>/, (message, response) => {
  if (ORDER['address']) return;
  
  ORDER['address'] = message.text.match(/[^<].*[^>)]/).join(''); // value without ""
    
  return response.send(new KeyboardMessage(PAYMENT_METHOD_KEYBOARD));
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {  
  switch (message.text) {  
    case '/замовити':
      return response.send(new KeyboardMessage(TO_ORDER_KEYBOARD));
      break;

    case '/makeOrder':
      return response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
      break;

    case '/firstBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[0]);
  
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/secondBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[1]);
    
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/thirdBottleFromAssortment':
      ORDER['bottle'].push(ASSORTMENT_OF_GOODS[2]);
  
      return response.send(new KeyboardMessage(QUANTITY_TO_ORDER_KEYBOARD));
      break;
  
    case '/oneToOrder':
      ORDER['quantity'].push(1);

      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      return say(response, 'Якщо бажаєте продовжити,\n'  
                         + 'вкажіть адресу доставки у трикутних дужках <>\n'
                         + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/twoToOrder':
      ORDER['quantity'].push(2);
  
      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      return say(response, 'Якщо бажаєте продовжити,\n'  
                         + 'вкажіть адресу доставки у трикутних дужках <>\n'
                         + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/fiveToOrder':
      ORDER['quantity'].push(5);
    
      say(response, 'Якщо бажаєте повернутися до асортименту,\n'   
                  + 'аби додати ще щось до свого замовлення введіть "/асортимент"');
      
      return say(response, 'Якщо бажаєте продовжити,\n'  
                         + 'вкажіть адресу доставки у трикутних дужках <>\n'
                         + 'Приклад: <вул. Бажана, 42, кв. 20>');
      break;
  
    case '/manualInput':
      return say(response, 'Будь ласка, введіть бажану кількість товару\n' + 
                           'Перед вашим числом має стояти слеш "/"');
      
    case '/cashPayment':
      let cashPrice = 0;

      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashPrice += PRICE_LIST[ORDER['bottle'][i]] * parseInt(ORDER['quantity'][i]);

      let cashOrder = 'Ваше замовлення:\n';
      
      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashOrder += `${ORDER['bottle'][i]}, ${ORDER['quantity'][i]} шт.\n`

      cashOrder += `Адреса доставки: ${ORDER['address']}\n` +
                   'Оплата готівкою\n' +
                   `Вартість: ${cashPrice} грн\n` +
                   'Введіть "/ок" для підтвердження або скасування замовлення';

      return say(response, cashOrder);
      break;     

    case '/cashlessPayment':
      let cashlessPrice = 0;

      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashlessPrice += PRICE_LIST[ORDER['bottle'][i]] * parseInt(ORDER['quantity'][i]);

      let cashlessOrder = 'Ваше замовлення:\n';
      
      for (let i = 0; i < ORDER['bottle'].length; i++)
        cashlessOrder += `${ORDER['bottle'][i]}, ${ORDER['quantity'][i]} шт.\n`

      cashlessOrder += `Адреса доставки: ${ORDER['address']}\n ` +
                       'Безготівковий розрахунок\n ' +
                       `Вартість: ${cashlessPrice} грн\n ` +
                       `Будь ласка, перейдіть за посиланням та оплатіть замовлення\n ` +
                       'Введіть "/ок" для підтвердження або скасування замовлення';

      say(response, cashlessOrder);

      const cashlessOrderForUrl = cashlessOrder.split(' ').join('%20');

      return response.send(new UrlMessage(`https://api.fondy.eu/api/checkout?button=%7B"merchant_id"%3A1415599%2C"currency"%3A"UAH"%2C"fields"%3A%5B%7B"name"%3A"id-adpgQ8AFYf"%2C"label"%3A"Коментар%20до%20замовлення%3A"%2C"valid"%3A"max_length%3A1000%3B"%7D%5D%2C"params"%3A%7B"response_url"%3A"%7Bresponse_url%7D"%2C"lang"%3A"uk"%2C"order_desc"%3A"Сплата%20за%20товари"%7D%2C"amount"%3A"${cashlessPrice}"%2C"amount_readonly"%3Atrue%7D`));
      break;

    case '/ок':
      return response.send(new KeyboardMessage(CONFIRM_KEYBOARD));

    case '/confirm':
      return say(response, 'Дякуємо за замовлення!\n' +
                           'Ми зв\'яжемося з Вами у найближчий час');
    
    case '/асортимент':
      return response.send(new KeyboardMessage(ORDER_MENU_KEYBOARD));
    
    case '/cancel':
      ORDER['bottle'] = [];
      ORDER['quantity'] = [];
      ORDER['address'] = '';

      return say(response, 'Гарного дня!');
      break;

    case '/скинути':
      ORDER['bottle'] = [];
      ORDER['quantity'] = [];
      ORDER['address'] = '';

      return say(response, 'Замовлення очищене!\n'
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
