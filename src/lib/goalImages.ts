export type GoalImageKey =
  | 'travel_rome'
  | 'travel_beach'
  | 'travel_mountains'
  | 'gadget_phone'
  | 'gadget_headphones'
  | 'fashion_shoes'
  | 'fashion_bag'
  | 'food_dinner'
  | 'home_decor'
  | 'fitness';

type GoalImage = {
  key: GoalImageKey;
  emoji: string;
  labelEs: string;
  labelEn: string;
};

export const GOAL_IMAGES: GoalImage[] = [
  { key: 'travel_rome',        emoji: '🏛️', labelEs: 'Viaje a Roma',        labelEn: 'Trip to Rome' },
  { key: 'travel_beach',       emoji: '🏖️', labelEs: 'Vacaciones en la playa', labelEn: 'Beach vacation' },
  { key: 'travel_mountains',   emoji: '⛰️', labelEs: 'Escapada a la montaña', labelEn: 'Mountain getaway' },
  { key: 'gadget_phone',       emoji: '📱',  labelEs: 'Nuevo móvil',           labelEn: 'New phone' },
  { key: 'gadget_headphones',  emoji: '🎧',  labelEs: 'Auriculares premium',   labelEn: 'Premium headphones' },
  { key: 'fashion_shoes',      emoji: '👟',  labelEs: 'Zapatillas nuevas',     labelEn: 'New sneakers' },
  { key: 'fashion_bag',        emoji: '👜',  labelEs: 'Bolso o mochila',       labelEn: 'Bag or backpack' },
  { key: 'food_dinner',        emoji: '🍽️', labelEs: 'Cena especial',         labelEn: 'Special dinner' },
  { key: 'home_decor',         emoji: '🏡',  labelEs: 'Algo para casa',        labelEn: 'Something for home' },
  { key: 'fitness',            emoji: '💪',  labelEs: 'Deporte o bienestar',   labelEn: 'Sport or wellness' },
];
