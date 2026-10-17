'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowUp,
} from 'lucide-react';

const FALLBACK_FOOD_IMG = '/zingers/classic.jpg';

export default function MobileMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Scroll animation states
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // State for which dishes have cheese slice added: dishId -> boolean
  const [cheeseMap, setCheeseMap] = useState<Record<string, boolean>>({});

  // State for veg nuggets variant: dishId -> variantName
  const [vegVariantMap, setVegVariantMap] = useState<Record<string, string>>({});

  // Passive scroll listener for smooth real-time animations
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = scrollY > 20;

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

  // Helper to calculate price
  const getItemPrice = (dish: MenuItem) => {
    let p = dish.price;
    if (dish.vegVariants && dish.vegVariants.length > 0) {
      const selected = vegVariantMap[dish.id] || dish.vegVariants[0].name;
      const matched = dish.vegVariants.find((v) => v.name === selected);
      if (matched) p = matched.price;
    }
    if (cheeseMap[dish.id] && dish.cheeseOptionPrice) {
      p += dish.cheeseOptionPrice;
    }
    return p;
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (scrollY > 120) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
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
      {/* ======================================================== */}
      {/* 🚀 ROCK-SOLID STICKY HEADER & CATEGORY DECK              */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#09090e]/95 backdrop-blur-2xl shadow-2xl border-b border-amber-500/20'
            : 'bg-[#0c0c0f]/95 backdrop-blur-xl border-b border-white/5 shadow-xl'
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          {/* Top Brand Bar */}
          <div
            className={`flex items-center justify-between gap-3 transition-all duration-300 ease-out ${
              isScrolled ? 'pt-2 pb-1.5' : 'pt-3 pb-2'
            }`}
          >
            {/* Logo & Cafe Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div
                  className={`overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out ${
                    isScrolled ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'
                  }`}
                >
                  <img
                    src="/logo/001.jpg.jpeg"
                    alt="Quick Bites Cafe Logo"
                    className="w-full h-full object-contain rounded-xl bg-black"
                  />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 bg-emerald-500 border-2 border-[#0c0c0f] rounded-full transition-all duration-300 ${
                    isScrolled ? 'w-2 h-2' : 'w-3 h-3'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1
                    className={`font-black tracking-tight text-white truncate transition-all duration-300 ${
                      isScrolled ? 'text-sm' : 'text-[15px]'
                    }`}
                  >
                    Quick Bites Cafe
                  </h1>
                  <span className="bg-amber-500/15 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                    Palghar
                  </span>
                </div>

                {/* Subtitle that folds away gracefully during scrolling */}
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${
                    isScrolled
                      ? 'max-h-0 opacity-0 -translate-y-1'
                      : 'max-h-5 opacity-100 mt-0.5 translate-y-0'
                  }`}
                >
                  <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-bold">Open Now</span>
                    <span>•</span>
                    <span>Closes 10:30 PM</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="tel:07977684202"
                className={`rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-center text-amber-400 hover:text-white transition-all active:scale-90 shadow-sm ${
                  isScrolled ? 'w-8 h-8' : 'w-9 h-9'
                }`}
                title="Call Cafe"
              >
                <Phone className={isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              </a>

              <a
                href="https://maps.google.com/?q=Shop+no+1+Dattaganga+beside+Hotel+Swaraj+Lakshmiwadi+Tembhode+Palghar"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-90 shadow-sm ${
                  isScrolled ? 'w-8 h-8' : 'w-9 h-9'
                }`}
                title="Directions"
              >
                <Navigation className={isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              </a>
            </div>
          </div>

          {/* Search Input Bar (Permanently inside sticky header) */}
          <div className="pb-2 pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Zingers, Wings, Buckets, Nuggets..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#141419]/90 border border-white/10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Integrated Sticky Category Carousel */}
          <div className="pb-2 pt-1 border-t border-white/5 overflow-hidden">
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
                    onClick={() => handleCategorySelect(cat)}
                    className={`py-1.5 px-3 rounded-full text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 shadow-md shadow-amber-500/30 scale-[1.03]'
                        : 'bg-[#18181f]/90 hover:bg-[#202029] border border-white/5 text-zinc-300'
                    }`}
                  >
                    <span>{ICONS[cat] || '🍽️'}</span>
                    <span className="whitespace-nowrap">{cat}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
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
        </div>

        {/* Dynamic Scroll Progress Glow Bar */}
        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-150 ease-out shadow-sm shadow-amber-500/50"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2-COLUMN MODERN GRID MENU CARDS (Requested Visual Format)*/}
      {/* ======================================================== */}
      <main className="max-w-md mx-auto px-3.5 pt-3 space-y-4">
        {/* No Items Found State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#121217]/80 rounded-3xl border border-white/5 p-6 mt-4">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="font-black text-white text-base">No items found</p>
            <p className="text-xs text-zinc-400 mt-1">Try clearing your search</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-amber-500 text-zinc-950 font-black rounded-full text-xs shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 2-Column Responsive Grid */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-0.5">
            {filteredItems.map((dish, index) => {
              const currentPrice = getItemPrice(dish);
              const hasCheese = !!cheeseMap[dish.id];
              const isVegDish = dish.dietary === 'veg';

              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  style={{ animationDelay: `${index * 20}ms` }}
                  className="group relative bg-[#13141c]/95 border border-white/10 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl active:scale-[0.98] cursor-pointer flex flex-col justify-between transition-all duration-300 animate-spring"
                >
                  {/* Top Square / 4:3 Food Photo */}
                  <div className="relative h-40 sm:h-44 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/60 pointer-events-none" />

                    {/* Top-Left: Dietary Dot in Square (Red Non-Veg / Green Veg) */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                      <div
                        className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center shrink-0 bg-black/75 shadow-md ${
                          isVegDish ? 'border-emerald-500' : 'border-rose-500'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isVegDish ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Top-Right: Solid Golden-Amber Price Pill */}
                    <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-400/40 shadow-lg flex items-center gap-0.5">
                        <span className="text-[11px] font-black text-amber-400">₹</span>
                        <span className="text-xs sm:text-sm font-black text-amber-400 tracking-tight">
                          {currentPrice}
                        </span>
                      </div>
                    </div>

                    {/* Piece Count Pill on bottom of photo if applicable */}
                    {dish.pieceCount && (
                      <span className="absolute bottom-2 left-2 z-10 bg-black/85 backdrop-blur-md text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-amber-500/30 shadow-md">
                        {dish.pieceCount}
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Dish Name */}
                      <h3
                        className={`font-black text-[13px] sm:text-sm leading-snug line-clamp-1 transition-colors ${
                          dish.isChefSpecial ? 'text-amber-400' : 'text-white group-hover:text-amber-400'
                        }`}
                      >
                        {dish.name}
                      </h3>

                      {/* Truncated Description */}
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom Action / Rating Row */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                      {/* Left: Interactive Cheese Toggle (for Zingers) or Veg Variant Toggle */}
                      {dish.hasCheeseOption ? (
                        <button
                          type="button"
                          onClick={(e) => toggleCheese(dish.id, e)}
                          className={`text-[10px] font-black px-2 py-1 rounded-lg border transition-all active:scale-95 flex items-center gap-1 ${
                            hasCheese
                              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md'
                              : 'bg-black/40 hover:bg-black/60 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <span>{hasCheese ? '✓ Cheese' : '+ Cheese ₹20'}</span>
                        </button>
                      ) : dish.vegVariants && dish.vegVariants.length > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5"
                        >
                          {dish.vegVariants.map((v) => {
                            const isVar = (vegVariantMap[dish.id] || dish.vegVariants![0].name) === v.name;
                            return (
                              <button
                                key={v.name}
                                type="button"
                                onClick={(e) => handleSelectVegVariant(dish.id, v.name, e)}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all ${
                                  isVar
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                              >
                                {v.name.split(' ')[0]}
                              </button>
                            );
                          })}
                        </div>
                      ) : dish.bucketContents ? (
                        <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {dish.bucketContents.length} Items
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-500">
                          Quick Bites
                        </span>
                      )}

                      {/* Right: Star Rating */}
                      {dish.rating && (
                        <span className="ml-auto flex items-center gap-1 text-[11px] font-black text-amber-400 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{dish.rating.toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

      {/* Floating Centered Pill: Call to Order (Exact Match to User Reference) */}
      

      {/* Floating Back to Top Button */}
      {scrollY > 300 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-black/85 backdrop-blur-xl border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-amber-500 hover:text-black animate-spring"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

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
                    ₹{getItemPrice(selectedDish)}
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
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
