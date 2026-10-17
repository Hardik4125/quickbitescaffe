'use client';

import React, { useEffect, useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { OrderStatus } from '../types/menu';
import { X, CheckCircle, ChefHat, BellRing, Sparkles, UtensilsCrossed, Clock } from 'lucide-react';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'received', label: 'Order Received', desc: 'Ticket printed at the kitchen station.' },
  { status: 'cooking', label: 'Chef Preparing', desc: 'Fresh ingredients being seasoned & cooked.' },
  { status: 'ready', label: 'Plated & Ready', desc: 'Garnished and ready at the service counter.' },
  { status: 'served', label: 'Served to Table', desc: 'Enjoy your meal!' },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ isOpen, onClose }) => {
  const { activeOrder, currentTable, restaurantConfig } = useMenu();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [waiterNotified, setWaiterNotified] = useState(false);

  // Simulate kitchen progress
  useEffect(() => {
    if (!isOpen || !activeOrder) return;

    setCurrentStepIndex(0);

    const timer1 = setTimeout(() => setCurrentStepIndex(1), 3500);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 9000);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, activeOrder]);

  if (!isOpen || !activeOrder) return null;

  const handleCallWaiter = () => {
    setWaiterNotified(true);
    setTimeout(() => setWaiterNotified(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col p-6 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Celebration Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 relative">
          <ChefHat className="w-8 h-8 animate-bounce" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
            ✓
          </div>
        </div>

        <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full self-center mb-2">
          Order {activeOrder.id}
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
          Sent to Kitchen!
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Your food is being freshly prepared for <strong>Table #{currentTable}</strong>.
        </p>

        {/* Live Step Tracker */}
        <div className="my-6 text-left space-y-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="flex items-start gap-3 relative">
                {/* Connecting line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 transition-colors ${
                      idx < currentStepIndex ? 'bg-amber-500' : 'bg-zinc-200'
                    }`}
                  />
                )}

                {/* Step dot */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 z-10 ${
                    isCompleted
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : isCurrent
                      ? 'bg-zinc-900 text-white ring-4 ring-amber-500/20'
                      : 'bg-zinc-200 text-zinc-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-zinc-900' : isCompleted ? 'text-zinc-700' : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Accordion / Summary */}
        <div className="text-xs text-zinc-600 border-t border-zinc-100 pt-3 flex justify-between items-center mb-4">
          <span>{activeOrder.items.reduce((s, i) => s + i.quantity, 0)} Items Ordered</span>
          <span className="font-extrabold text-zinc-900">
            Total: {restaurantConfig.currencySymbol}
            {activeOrder.total.toFixed(2)}
          </span>
        </div>

        {/* Waiter Alert Notification */}
        {waiterNotified && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded-xl border border-emerald-200 animate-in fade-in">
            🔔 Waiter has been notified for Table #{currentTable}! Someone is on the way.
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCallWaiter}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-xs transition-colors"
          >
            <BellRing className="w-4 h-4 text-amber-600" />
            <span>Call Waiter</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>View Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
