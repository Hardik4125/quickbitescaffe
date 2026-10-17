export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface VegVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dietary: DietaryType;
  spiceLevel: number; // 0 = none, 1 = mild, 2 = medium, 3 = spicy
  isChefSpecial?: boolean;
  calories?: string;
  prepTime?: string;
  isAvailable: boolean;
  allergens?: string[];
  rating: number;
  reviewsCount: number;
  pieceCount?: string; // e.g. '10 pcs', '8 pcs', '6 pcs', '2 pcs'
  hasCheeseOption?: boolean;
  cheeseOptionPrice?: number; // e.g. 20
  bucketContents?: string[]; // e.g. ['Wings 4pcs', 'Drumstick 1pcs', 'Strips 4pcs', 'Dip 2']
  vegVariants?: VegVariant[]; // e.g. [{ name: 'Mix Veg', price: 120 }, { name: 'Spinach & Corn', price: 130 }]
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSpiceLevel?: number;
  selectedAddons?: CartItemAddon[];
  specialNotes?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  wifiName: string;
  wifiPassword: string;
  currency: string;
  currencySymbol: string;
  taxRatePercent: number;
  bannerImage: string;
  logoImage: string;
  tablesCount: number;
}

export type OrderStatus = 'received' | 'cooking' | 'ready' | 'served';

export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}
