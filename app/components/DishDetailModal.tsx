'use client';

import React, { useState } from 'react';
import { MenuItem, CartItemAddon } from '../types/menu';
import { useMenu } from '../context/MenuContext';
import { X, Flame, Plus, Minus, Check, Clock, Sparkles } from 'lucide-react';

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const COMMON_ADDONS: CartItemAddon[] = [
  { id: 'addon-cheese', name: 'Extra Melted Cheese / Burrata', price: 2.50 },
  { id: 'addon-truffle', name: 'Black Truffle Infused Aioli', price: 1.75 },
  { id: 'addon-avocado', name: 'Fresh Hass Avocado Slices', price: 2.00 },
];

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ item, onClose }) => {
  const { restaurantConfig, addToCart } = useMenu();
  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<number>(item?.spiceLevel ?? 0);
  const [selectedAddons, setSelectedAddons] = useState<CartItemAddon[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!item) return null;

  const toggleAddon = (addon: CartItemAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons((prev) => [...prev, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const itemTotal = (item.price + addonsTotal) * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedSpice, selectedAddons, specialNotes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative w-full h-56 sm:h-64 bg-zinc-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Top badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                {item.prepTime && (
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {item.prepTime}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {item.name}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-black text-xl sm:text-2xl">
                {restaurantConfig.currencySymbol}
                {item.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Description */}
          <p className="text-sm text-zinc-600 leading-relaxed">
            {item.description}
          </p>

          {/* Nutrition & Allergens */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs">
            {item.calories && (
              <div className="flex items-center gap-1 font-semibold text-zinc-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{item.calories}</span>
              </div>
            )}
            {item.allergens && item.allergens.length > 0 && (
              <div className="text-zinc-500">
                Contains: <strong className="text-zinc-700">{item.allergens.join(', ')}</strong>
              </div>
            )}
          </div>

          {/* Spice Level Customization */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Preferred Spice Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 0, label: 'Zero Mild' },
                { level: 1, label: 'Mild 🌶️' },
                { level: 2, label: 'Medium 🌶️🌶️' },
                { level: 3, label: 'Fiery 🌶️🌶️🌶️' },
              ].map(({ level, label }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedSpice(level)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all border ${
                    selectedSpice === level
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Add-ons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Gourmet Add-ons & Extras
            </label>
            <div className="space-y-2">
              {COMMON_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 text-zinc-900 font-semibold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs">{addon.name}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">
                      +{restaurantConfig.currencySymbol}
                      {addon.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Kitchen Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Extra crispy, dressing on the side, no mayo..."
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Footer: Quantity & Submit */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/80 flex items-center gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-zinc-200 shadow-xs">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm w-4 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-sm shadow-lg transition-transform active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Order!</span>
              </>
            ) : (
              <>
                <span>Add to Order</span>
                <span>•</span>
                <span>
                  {restaurantConfig.currencySymbol}
                  {itemTotal.toFixed(2)}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
