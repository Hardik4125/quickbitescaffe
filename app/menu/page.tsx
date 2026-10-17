'use client';

import React, { useState, useMemo } from 'react';
import { initialMenuItems, initialRestaurantConfig, initialCategories } from '../data/initialMenu';
import { MenuItem } from '../types/menu';
import {
  Search,
  Star,
  Phone,
  MapPin,
  Flame,
  Check,
  X,
  Clock,
  Navigation,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const FALLBACK_FOOD_IMG = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80';

export default function MobileMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // State for which dishes have cheese slice added: dishId -> boolean
  const [cheeseMap, setCheeseMap] = useState<Record<string, boolean>>({});

  // State for veg nuggets variant: dishId -> variantName
  const [vegVariantMap, setVegVariantMap] = useState<Record<string, string>>({});

  const toggleCheese = (dishId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCheeseMap((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const handleSelectVegVariant = (dishId: string, variantName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVegVariantMap((prev) => ({
      ...prev,
      [dishId]: variantName,
    }));
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black pb-28 bg-doodle relative">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0f]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Logo & Cafe Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/25">
                <img
                  src="/logo/001.jpg.jpeg"
                  alt="Quick Bites Cafe Logo"
                  className="w-full h-full object-contain rounded-xl bg-black"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0c0c0f] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-[15px] tracking-tight text-white truncate">
                  Quick Bites Cafe
                </h1>
                <span className="bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                  Palghar
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">Open Now</span>
                <span>•</span>
                <span>Closes 10:30 PM</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:07977684202"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-center text-amber-400 hover:text-white transition-all active:scale-90 shadow-sm"
              title="Call Cafe"
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href="https://maps.google.com/?q=Shop+no+1+Dattaganga+beside+Hotel+Swaraj+Lakshmiwadi+Tembhode+Palghar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-90 shadow-sm"
              title="Directions"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {/* Modern Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Zingers, Wings, Buckets, Nuggets..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#141419]/90 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Floating Category Pills (Swiggy / Zomato style) */}
        <div className="sticky top-[59px] z-30 bg-[#0c0c0f]/90 backdrop-blur-xl -mx-4 px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {initialCategories.map((cat) => {
              const count =
                cat === 'All'
                  ? initialMenuItems.length
                  : initialMenuItems.filter((i) => i.category === cat).length;
              const isSelected = selectedCategory === cat;

              const ICONS: Record<string, string> = {
                All: '✨',
                Zinger: '🍔',
                'Fried Chicken': '🍗',
                'Wing Flavours': '🔥',
                Buckets: '🪣',
                'Non-Veg Nuggets': '🍗',
                'Veg Nuggets': '🥦',
              };

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-3.5 rounded-full text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 scale-[1.03]'
                      : 'bg-[#18181f]/90 hover:bg-[#202029] border border-white/5 text-zinc-300'
                  }`}
                >
                  <span>{ICONS[cat] || '🍽️'}</span>
                  <span className="whitespace-nowrap">{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isSelected
                        ? 'bg-zinc-950 text-amber-400'
                        : 'bg-black/40 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items List - Premium Card Layout */}
        <div className="space-y-3.5 pt-1">
          {filteredItems.map((dish, index) => {
            // Price computation
            let currentPrice = dish.price;

            // Cheese slice logic for Zingers
            const hasCheese = !!cheeseMap[dish.id];
            if (hasCheese && dish.cheeseOptionPrice) {
              currentPrice += dish.cheeseOptionPrice;
            }

            // Veg variants logic (Mix Veg vs Spinach & Corn)
            const selectedVegVariant = vegVariantMap[dish.id] || (dish.vegVariants?.[0]?.name ?? '');
            if (dish.vegVariants && dish.vegVariants.length > 0) {
              const matched = dish.vegVariants.find((v) => v.name === selectedVegVariant);
              if (matched) {
                currentPrice = matched.price;
              }
            }

            const isVegDish = dish.dietary === 'veg';

            return (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                style={{ animationDelay: `${index * 25}ms` }}
                className="group relative bg-[#131318]/90 hover:bg-[#181820] border border-white/5 hover:border-amber-500/40 rounded-3xl p-4 transition-all duration-300 shadow-xl active:scale-[0.99] cursor-pointer flex gap-4 items-start animate-spring"
              >
                {/* Left Side: Info, Name, Price, Options */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div>
                    {/* Top Row: Dietary Dot + Category + Spice */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center shrink-0 ${
                          isVegDish ? 'border-emerald-500' : 'border-rose-500'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isVegDish ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>

                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 truncate">
                        {dish.category}
                      </span>

                      {dish.spiceLevel > 0 && (
                        <span className="flex items-center text-rose-500" title="Spiciness">
                          {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                            <Flame key={i} className="w-3 h-3 fill-rose-500 text-rose-500 -ml-0.5 first:ml-0" />
                          ))}
                        </span>
                      )}

                      {dish.rating && (
                        <span className="ml-auto flex items-center gap-0.5 text-[10px] font-black text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {dish.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Dish Name */}
                    <h3 className="font-black text-[15px] sm:text-base text-white leading-snug group-hover:text-amber-400 transition-colors">
                      {dish.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-black text-lg sm:text-xl text-amber-400 tracking-tight">
                        ₹{currentPrice}
                      </span>
                      {hasCheese && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Cheese added
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>

                    {/* Bucket Inclusions Tags */}
                    {dish.bucketContents && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dish.bucketContents.map((c, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Veg Variant Toggle (Mix Veg vs Spinach & Corn) */}
                  {dish.vegVariants && dish.vegVariants.length > 0 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 flex gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 text-[11px]"
                    >
                      {dish.vegVariants.map((variant) => {
                        const isVarSelected = (vegVariantMap[dish.id] || dish.vegVariants![0].name) === variant.name;
                        return (
                          <button
                            key={variant.name}
                            type="button"
                            onClick={(e) => handleSelectVegVariant(dish.id, variant.name, e)}
                            className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-between ${
                              isVarSelected
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <span>{variant.name}</span>
                            <span className="font-black">₹{variant.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Interactive Cheese Slice Toggle for Zingers */}
                  {dish.hasCheeseOption && (
                    <div
                      onClick={(e) => toggleCheese(dish.id, e)}
                      className={`mt-3 py-1.5 px-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-all select-none ${
                        hasCheese
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-black/40 hover:bg-black/60 border-white/5 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            hasCheese
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'border-zinc-600 bg-zinc-900'
                          }`}
                        >
                          {hasCheese && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>With Cheese Slice</span>
                      </div>
                      <span className="font-black text-amber-400">
                        +₹20
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side: Square Food Image & View Button */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-zinc-900 shadow-md border border-white/10">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Piece Count Pill */}
                    {dish.pieceCount && (
                      <span className="absolute bottom-1.5 left-1.5 bg-black/85 backdrop-blur-md text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-amber-500/30">
                        🍗 {dish.pieceCount}
                      </span>
                    )}

                    {/* Popular Pill */}
                    {dish.isChefSpecial && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-zinc-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                        Popular
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-0.5">
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cafe Address Footer */}
        <div className="rounded-3xl bg-[#121217]/90 border border-white/5 p-4 text-center space-y-2 text-xs text-zinc-400 mt-6 shadow-xl">
          <p className="font-bold text-white text-sm">Quick Bites Cafe • Palghar</p>
          <p className="flex items-center justify-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Shop no 1, Dattaganga, beside Hotel Swaraj, Tembhode</span>
          </p>
          <div className="pt-2 flex items-center justify-center">
            <a
              href="tel:07977684202"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-6 py-2.5 rounded-full text-xs active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 079776 84202</span>
            </a>
          </div>
        </div>
      </main>

      {/* Floating Centered Pill: Call to Order */}
      <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none">
        <div className="max-w-md mx-auto flex justify-center">
          <a
            href="tel:07977684202"
            className="pointer-events-auto inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-zinc-950 font-black text-xs sm:text-sm py-3 px-7 rounded-full shadow-2xl shadow-amber-500/40 active:scale-95 transition-all border border-amber-300"
          >
            <Phone className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            <span>Call to Order • 079776 84202</span>
          </a>
        </div>
      </div>

      {/* Fullscreen Mobile Dish Detail Drawer */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#141419] border border-amber-500/30 rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-spring">
            {/* Modal Image Header */}
            <div className="relative h-60 w-full bg-zinc-950 shrink-0">
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_FOOD_IMG;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-black/60" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black active:scale-90 transition-transform border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Tags */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                  {selectedDish.category}
                </span>
                {selectedDish.pieceCount && (
                  <span className="bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {selectedDish.pieceCount}
                  </span>
                )}
              </div>

              {/* Price & Name in Banner */}
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {selectedDish.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                    ₹
                    {selectedDish.vegVariants
                      ? (selectedDish.vegVariants.find((v) => v.name === (vegVariantMap[selectedDish.id] || selectedDish.vegVariants![0].name))?.price ?? selectedDish.price)
                      : (cheeseMap[selectedDish.id] && selectedDish.cheeseOptionPrice
                          ? selectedDish.price + selectedDish.cheeseOptionPrice
                          : selectedDish.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedDish.description}
              </p>

              {/* Bucket details */}
              {selectedDish.bucketContents && (
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    Bucket Inclusions:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-xs text-zinc-200">
                    {selectedDish.bucketContents.map((c, i) => (
                      <span key={i} className="flex items-center gap-1 font-semibold">
                        <span className="text-amber-400">✓</span> {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges / Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-black/50 rounded-2xl p-2.5 border border-white/5">
                  <span className="text-[9px] text-zinc-400 block uppercase font-bold">Rating</span>
                  <span className="font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5 text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {selectedDish.rating.toFixed(1)}
                  </span>
                </div>

                <div className="bg-black/50 rounded-2xl p-2.5 border border-white/5">
                  <span className="text-[9px] text-zinc-400 block uppercase font-bold">Prep Time</span>
                  <span className="font-black text-white flex items-center justify-center gap-1 mt-0.5 text-xs">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {selectedDish.prepTime}
                  </span>
                </div>

                <div className="bg-black/50 rounded-2xl p-2.5 border border-white/5">
                  <span className="text-[9px] text-zinc-400 block uppercase font-bold">Energy</span>
                  <span className="font-black text-white mt-0.5 block text-xs">
                    {selectedDish.calories}
                  </span>
                </div>
              </div>

              {/* Veg Variant Selector in Modal */}
              {selectedDish.vegVariants && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Choose Flavour:
                  </label>
                  <div className="flex gap-2">
                    {selectedDish.vegVariants.map((variant) => {
                      const isVarSelected = (vegVariantMap[selectedDish.id] || selectedDish.vegVariants![0].name) === variant.name;
                      return (
                        <button
                          key={variant.name}
                          type="button"
                          onClick={() => handleSelectVegVariant(selectedDish.id, variant.name)}
                          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-between border ${
                            isVarSelected
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                              : 'bg-black/50 border-white/5 text-zinc-400'
                          }`}
                        >
                          <span>{variant.name}</span>
                          <span className="font-black">₹{variant.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* With Cheese Slice Option for Zingers */}
              {selectedDish.hasCheeseOption && (
                <div
                  onClick={() => toggleCheese(selectedDish.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    cheeseMap[selectedDish.id]
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-black/50 border-white/5 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        cheeseMap[selectedDish.id]
                          ? 'bg-amber-500 border-amber-500 text-zinc-950'
                          : 'border-zinc-500 bg-zinc-900'
                      }`}
                    >
                      {cheeseMap[selectedDish.id] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-white">
                        Add Cheese Slice
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        Extra creamy melted slice
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-amber-400">
                    +₹20
                  </span>
                </div>
              )}

              {/* Call to Order Button */}
              <div className="pt-2">
                <a
                  href="tel:07977684202"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call to Order • 079776 84202</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
