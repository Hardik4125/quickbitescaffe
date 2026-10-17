'use client';

import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { X, Trash2, Plus, Minus, ArrowRight, Utensils, Sparkles, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: () => void;
}

const TIP_OPTIONS = [0, 5, 10, 15];

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, currentTable, restaurantConfig, updateCartQuantity, removeFromCart, placeOrder, cartTotals } = useMenu();
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(10);
  const [chefInstructions, setChefInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const tipAmount = Number(((cartTotals.subtotal * selectedTipPercent) / 100).toFixed(2));
  const finalTotal = Number((cartTotals.subtotal + cartTotals.tax + tipAmount).toFixed(2));

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      placeOrder(tipAmount, chefInstructions);
      setIsSubmitting(false);
      onClose();
      onOrderPlaced();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-zinc-900 text-lg">Your Dine-In Order</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                  Table #{currentTable}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-200 text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-400">
                <ChefHat className="w-16 h-16 stroke-1 text-zinc-300 mb-3" />
                <p className="font-bold text-zinc-700 text-base">Your order is empty</p>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  Browse the menu and add your favorite dishes to dine in.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((ci) => {
                    const addonsCost = ci.selectedAddons?.reduce((s, a) => s + a.price, 0) || 0;
                    const itemTotal = (ci.item.price + addonsCost) * ci.quantity;

                    return (
                      <div
                        key={ci.item.id}
                        className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={ci.item.image}
                            alt={ci.item.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-zinc-900 text-xs sm:text-sm truncate">
                              {ci.item.name}
                            </h4>
                            {ci.selectedAddons && ci.selectedAddons.length > 0 && (
                              <p className="text-[10px] text-zinc-500 line-clamp-1">
                                + {ci.selectedAddons.map((a) => a.name).join(', ')}
                              </p>
                            )}
                            {ci.specialNotes && (
                              <p className="text-[10px] italic text-amber-700 line-clamp-1">
                                &quot;{ci.specialNotes}&quot;
                              </p>
                            )}
                            <div className="font-bold text-zinc-900 text-xs mt-0.5">
                              {restaurantConfig.currencySymbol}
                              {itemTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 bg-white border border-zinc-200 px-2 py-1 rounded-xl shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity - 1)}
                              className="text-zinc-500 hover:text-zinc-900 p-0.5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-extrabold text-xs w-4 text-center">
                              {ci.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity + 1)}
                              className="text-zinc-500 hover:text-zinc-900 p-0.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(ci.item.id)}
                            className="text-zinc-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Note for Kitchen */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Note for the Chef / Kitchen
                  </label>
                  <textarea
                    rows={2}
                    value={chefInstructions}
                    onChange={(e) => setChefInstructions(e.target.value)}
                    placeholder="Allergies, table preferences, or dietary notes..."
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                {/* Tip Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Staff Gratitude Tip
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIP_OPTIONS.map((tip) => (
                      <button
                        key={tip}
                        type="button"
                        onClick={() => setSelectedTipPercent(tip)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedTipPercent === tip
                            ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {tip === 0 ? 'None' : `${tip}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">
                      {restaurantConfig.currencySymbol}
                      {cartTotals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Tax & Service ({restaurantConfig.taxRatePercent}%)</span>
                    <span className="font-semibold text-zinc-900">
                      {restaurantConfig.currencySymbol}
                      {cartTotals.tax.toFixed(2)}
                    </span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Tip ({selectedTipPercent}%)</span>
                      <span className="font-semibold text-zinc-900">
                        +{restaurantConfig.currencySymbol}
                        {tipAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-900">
                    <span>Total Amount</span>
                    <span className="text-amber-600">
                      {restaurantConfig.currencySymbol}
                      {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-100 bg-zinc-50">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl shadow-zinc-900/10 flex items-center justify-between transition-transform active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Send Order to Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    {restaurantConfig.currencySymbol}
                    {finalTotal.toFixed(2)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </button>
              <p className="text-[11px] text-zinc-400 text-center mt-2">
                Order will be sent straight to Table #{currentTable}&apos;s kitchen queue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
