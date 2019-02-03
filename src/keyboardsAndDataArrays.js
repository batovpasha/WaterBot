'use strict';

const URL = `https://api.fondy.eu/api/checkout?button=%7B%22merchant_id%22%3A1415599%2C%22currency%22%3A%22UAH%22%2C%22fields%22%3A%5B%7B%22name%22%3A%22id-95iJMmbgTm%22%2C%22label%22%3A%22%D0%9D%D0%BE%D0%BC%D0%B5%D1%80%20%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD%D0%B0%22%2C%22valid%22%3A%22required%22%7D%2C%7B%22name%22%3A%22id-LCGvTNvXn7%22%2C%22label%22%3A%22%D0%A4%D0%98%D0%9E%22%2C%22valid%22%3A%22required%22%7D%2C%7B%22name%22%3A%22id-adpgQ8AFYf%22%2C%22label%22%3A%22%D0%9A%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%20%D0%B4%D0%BE%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F%3A%22%2C%22valid%22%3A%22max_length%3A1000%3B%22%7D%5D%2C%22params%22%3A%7B%22response_url%22%3A%22%7Bresponse_url%7D%22%2C%22lang%22%3A%22uk%22%2C%22order_desc%22%3A%22${cashlessOrderForUrl.toString()}%22%7D%2C%22amount%22%3A%22${cashlessPrice.toString()}%22%2C%22amount_readonly%22%3Atrue%7D`;

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

module.exports = {
  ORDER,
  ASSORTMENT_OF_GOODS,
  PRICE_LIST,
  TO_ORDER_KEYBOARD,
  ORDER_MENU_KEYBOARD,
  QUANTITY_TO_ORDER_KEYBOARD,
  PAYMENT_METHOD_KEYBOARD,
	CONFIRM_KEYBOARD,
	URL
};
  