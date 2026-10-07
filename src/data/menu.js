// Local image assets — byte-identical to the photos placed in the Figma frames.
const IMG = {
  latte: require('../../assets/menu/latte.jpg'),
  chai: require('../../assets/menu/chai.jpg'),
  espresso: require('../../assets/menu/espresso.jpg'),
  cappuccino: require('../../assets/menu/cappuccino.jpg'),
  bolo: require('../../assets/menu/bolo.jpg'),
  ramen: require('../../assets/menu/ramen.jpg'),
  carbonara: require('../../assets/menu/carbonara.jpg'),
  padthai: require('../../assets/menu/padthai.jpg'),
  thanos: require('../../assets/menu/thanos.jpg'),
  neck: require('../../assets/menu/neck.jpg'),
  cheese: require('../../assets/menu/cheese.jpg'),
  bacon: require('../../assets/menu/bacon.jpg'),
  cham: require('../../assets/menu/cham.jpg'),
  blacktea: require('../../assets/menu/blacktea.jpg'),
  matcha: require('../../assets/menu/matcha.jpg'),
  boba: require('../../assets/menu/boba.jpg'),
  margh: require('../../assets/menu/margh.jpg'),
  pepper: require('../../assets/menu/pepper.jpg'),
  veggie: require('../../assets/menu/veggie.jpg'),
  hawaii: require('../../assets/menu/hawaii.jpg'),
  pie: require('../../assets/menu/pie.jpg'),
  crois: require('../../assets/menu/crois.jpg'),
  chick: require('../../assets/menu/chick.jpg'),
  fries: require('../../assets/menu/fries.jpg'),
};

export const CATEGORIES = [
  'All',
  'Coffee',
  'Noodle',
  'Burger',
  'Tea',
  'Pizza',
  'Sides',
];

export const MENU = [
  // Coffee
  { id: 'latte', name: 'Coffee Latte', category: 'Coffee', price: 4.5, rating: '4.5', image: IMG.latte },
  { id: 'chai', name: 'Chai Latte', category: 'Coffee', price: 5.2, rating: '4.2', image: IMG.chai },
  { id: 'espresso', name: 'Espresso', category: 'Coffee', price: 3.5, rating: '4.8', image: IMG.espresso },
  { id: 'cappuccino', name: 'Cappuccino', category: 'Coffee', price: 4.0, rating: '4.6', image: IMG.cappuccino },
  // Noodle
  { id: 'bolo', name: 'Bolognese Spaghetti', category: 'Noodle', price: 12.9, rating: '4.2', image: IMG.bolo },
  { id: 'ramen', name: 'Ramen Bowl', category: 'Noodle', price: 14.5, rating: '4.9', image: IMG.ramen },
  { id: 'carbonara', name: 'Carbonara', category: 'Noodle', price: 13.2, rating: '4.7', image: IMG.carbonara },
  { id: 'padthai', name: 'Pad Thai', category: 'Noodle', price: 11.8, rating: '4.5', image: IMG.padthai },
  // Burger
  { id: 'thanos', name: 'Thanos Burger', category: 'Burger', price: 9.9, rating: '5.0', image: IMG.thanos },
  { id: 'neck', name: 'Neck Burger', category: 'Burger', price: 8.5, rating: '5.0', image: IMG.neck },
  { id: 'cheese', name: 'Cheeseburger', category: 'Burger', price: 7.9, rating: '4.6', image: IMG.cheese },
  { id: 'bacon', name: 'Bacon Burger', category: 'Burger', price: 10.4, rating: '4.7', image: IMG.bacon },
  // Tea
  { id: 'cham', name: 'Chamomile Tea', category: 'Tea', price: 3.8, rating: '4.5', image: IMG.cham },
  { id: 'black', name: 'Black Tea', category: 'Tea', price: 3.2, rating: '4.4', image: IMG.blacktea },
  { id: 'matcha', name: 'Matcha Latte', category: 'Tea', price: 5.5, rating: '4.7', image: IMG.matcha },
  { id: 'boba', name: 'Boba Milk Tea', category: 'Tea', price: 6.2, rating: '4.8', image: IMG.boba },
  // Pizza
  { id: 'margh', name: 'Margherita', category: 'Pizza', price: 12.0, rating: '4.6', image: IMG.margh },
  { id: 'pepper', name: 'Pepperoni', category: 'Pizza', price: 13.5, rating: '4.8', image: IMG.pepper },
  { id: 'veggie', name: 'Veggie Pizza', category: 'Pizza', price: 11.5, rating: '4.4', image: IMG.veggie },
  { id: 'hawaii', name: 'Hawaiian', category: 'Pizza', price: 12.8, rating: '4.5', image: IMG.hawaii },
  // Sides
  { id: 'pie', name: 'Pie Susu', category: 'Sides', price: 6.4, rating: '4.5', image: IMG.pie },
  { id: 'crois', name: 'Croissant', category: 'Sides', price: 4.25, rating: '4.8', image: IMG.crois },
  { id: 'chick', name: 'Chicken Pops', category: 'Sides', price: 5.6, rating: '4.6', image: IMG.chick },
  { id: 'fries', name: 'Fries', category: 'Sides', price: 3.9, rating: '4.7', image: IMG.fries },
];

export const itemById = (id) => MENU.find((m) => m.id === id);
