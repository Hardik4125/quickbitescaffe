'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { MenuItem, RestaurantConfig, CartItem, Order, CartItemAddon } from '../types/menu';
import { initialMenuItems, initialRestaurantConfig } from '../data/initialMenu';

interface MenuContextType {
  menuItems: MenuItem[];
  restaurantConfig: RestaurantConfig;
  cart: CartItem[];
  currentTable: string;
  activeOrder: Order | null;
  orders: Order[];
  setCurrentTable: (table: string) => void;
  addToCart: (item: MenuItem, quantity?: number, spiceLevel?: number, addons?: CartItemAddon[], notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (tipAmount: number, notes?: string) => Order;
  clearActiveOrder: () => void;
  toggleItemAvailability: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  updateRestaurantConfig: (config: Partial<RestaurantConfig>) => void;
  resetMenuToDefault: () => void;
  cartTotals: {
    itemsCount: number;
    subtotal: number;
    tax: number;
  };
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'quick_bites_menu_items_v1',
  CONFIG: 'quick_bites_restaurant_config_v1',
  ORDERS: 'quick_bites_orders_v1',
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(initialRestaurantConfig);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentTable, setCurrentTable] = useState<string>('1');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
      if (savedMenu) {
        setMenuItems(JSON.parse(savedMenu));
      }

      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (savedConfig) {
        setRestaurantConfig(JSON.parse(savedConfig));
      }

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error('Failed to load menu data from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Error saving menu to storage', e);
    }
  }, [menuItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(restaurantConfig));
    } catch (e) {
      console.error('Error saving config to storage', e);
    }
  }, [restaurantConfig, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to storage', e);
    }
  }, [orders, isHydrated]);

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity = 1,
    spiceLevel?: number,
    addons?: CartItemAddon[],
    notes?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          ci.selectedSpiceLevel === spiceLevel &&
          JSON.stringify(ci.selectedAddons || []) === JSON.stringify(addons || [])
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          specialNotes: notes || next[existingIndex].specialNotes,
        };
        return next;
      }

      return [
        ...prev,
        {
          item,
          quantity,
          selectedSpiceLevel: spiceLevel ?? item.spiceLevel,
          selectedAddons: addons,
          specialNotes: notes,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => setCart([]);

  // Calculate totals
  const cartTotals = useMemo(() => {
    let itemsCount = 0;
    let subtotal = 0;

    cart.forEach((ci) => {
      itemsCount += ci.quantity;
      let itemPrice = ci.item.price;
      if (ci.selectedAddons && ci.selectedAddons.length > 0) {
        itemPrice += ci.selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
      }
      subtotal += itemPrice * ci.quantity;
    });

    const tax = Number((subtotal * (restaurantConfig.taxRatePercent / 100)).toFixed(2));
    return { itemsCount, subtotal: Number(subtotal.toFixed(2)), tax };
  }, [cart, restaurantConfig.taxRatePercent]);

  // Place order
  const placeOrder = (tipAmount: number, notes?: string): Order => {
    const newOrder: Order = {
      id: `TB-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: currentTable,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      tax: cartTotals.tax,
      tip: tipAmount,
      total: Number((cartTotals.subtotal + cartTotals.tax + tipAmount).toFixed(2)),
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const clearActiveOrder = () => setActiveOrder(null);

  // Admin menu management
  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `dish-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateRestaurantConfig = (config: Partial<RestaurantConfig>) => {
    setRestaurantConfig((prev) => ({ ...prev, ...config }));
  };

  const resetMenuToDefault = () => {
    setMenuItems(initialMenuItems);
    setRestaurantConfig(initialRestaurantConfig);
    try {
      localStorage.removeItem(STORAGE_KEYS.MENU);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        restaurantConfig,
        cart,
        currentTable,
        activeOrder,
        orders,
        setCurrentTable,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        clearActiveOrder,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateRestaurantConfig,
        resetMenuToDefault,
        cartTotals,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
