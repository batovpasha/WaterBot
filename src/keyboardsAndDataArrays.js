'use strict';

const DOMAIN = 'kryo';
const API_KEY = 'yourKey'';
const CRM_EMAIL = 'yourEmail';

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

const STARTING_KEYBOARD = {
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
	},
	{
	  'Columns': 6,
	  'Rows': 1,
	  'BgColor': '#e6f5ff',
	  'Text': 'Скинути введені дані',
	  'ActionType': 'reply',
	  'ActionBody': '/clear'
	}
  ]	
};

const BACK_TO_ORDER_KEYBOARD = {
	'Type': 'keyboard',
  'InputFieldState': 'hidden',
  'Buttons': [
    {
	  'Columns': 6,
	  'Rows': 1,
	  'BgColor': '#e6f5ff',
	  'Text': 'До асортименту',
	  'ActionType': 'reply',
	  'ActionBody': '/assortment'
	}
  ]	
};

module.exports = {
  ORDER,
  ASSORTMENT_OF_GOODS,
  PRICE_LIST,
  ORDER_MENU_KEYBOARD,
  QUANTITY_TO_ORDER_KEYBOARD,
  PAYMENT_METHOD_KEYBOARD,
	CONFIRM_KEYBOARD,
	STARTING_KEYBOARD,
	BACK_TO_ORDER_KEYBOARD, 
	DOMAIN,
	API_KEY,
  CRM_EMAIL
};
  
