'use client';

import React from 'react';
import { MenuItem } from '../types/menu';
import { useMenu } from '../context/MenuContext';
import { Plus, Minus, Star, Flame, Clock } from 'lucide-react';

interface DishCardProps {
  item: MenuItem;
  onOpenDetails: (item: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ item, onOpenDetails }) => {
  const { restaurantConfig, cart, addToCart, updateCartQuantity } = useMenu();

  const cartItem = cart.find((ci) => ci.item.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddQuick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    addToCart(item, 1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    updateCartQuantity(item.id, currentQuantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(item.id, currentQuantity - 1);
  };

  return (
    <div
      onClick={() => onOpenDetails(item)}
      className={`group relative bg-white rounded-3xl p-4 sm:p-5 border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        !item.isAvailable ? 'opacity-60 saturate-50' : 'hover:-translate-y-1'
      }`}
    >
      <div>
        {/* Top Image & Badges */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 mb-4 shadow-inner">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {/* Sold out overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                Sold Out
              </span>
            </div>
          )}

          {/* Chef Special Badge */}
          {item.isChefSpecial && (
            <span className="absolute top-2.5 left-2.5 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              ★ Chef Special
            </span>
          )}

          {/* Prep time badge */}
          {item.prepTime && (
            <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {item.prepTime}
            </span>
          )}

          {/* Rating Badge */}
          <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {item.rating.toFixed(1)}
          </span>
        </div>

        {/* Dietary & Spicy Indicator */}
        <div className="flex items-center gap-2 mb-2">
          {/* Veg / Non-Veg Standard Food Icon */}
          <div
            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
              item.dietary === 'veg' || item.dietary === 'vegan'
                ? 'border-emerald-600'
                : 'border-rose-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.dietary === 'veg' || item.dietary === 'vegan'
                  ? 'bg-emerald-600'
                  : 'bg-rose-600'
              }`}
            />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {item.dietary}
          </span>

          {/* Spicy Indicator */}
          {item.spiceLevel > 0 && (
            <span className="flex items-center text-xs text-rose-500" title={`Spice Level: ${item.spiceLevel}/3`}>
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500 -ml-0.5 first:ml-0" />
              ))}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 leading-snug group-hover:text-amber-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Footer: Price & Add-to-cart Controls */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 font-medium block">Price</span>
          <span className="font-black text-lg sm:text-xl text-zinc-900 tracking-tight">
            {restaurantConfig.currencySymbol}
            {item.price.toFixed(2)}
          </span>
        </div>

        <div>
          {currentQuantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-zinc-900 text-white rounded-full p-1 shadow-md shadow-zinc-900/20"
            >
              <button
                type="button"
                onClick={handleDecrease}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold w-5 text-center">{currentQuantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!item.isAvailable}
              onClick={handleAddQuick}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                item.isAvailable
                  ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-amber-500/20'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
