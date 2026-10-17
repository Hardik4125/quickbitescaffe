'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  LayoutGrid,
  Rows3,
  Leaf,
  ArrowUp,
} from 'lucide-react';

const FALLBACK_FOOD_IMG = '/zingers/classic.jpg';

export default function MobileMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'bestsellers' | 'veg' | 'nonveg' | 'buckets'>('all');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Scroll animation states
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const stickySearchInputRef = useRef<HTMLInputElement>(null);

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

  const isScrolled = scrollY > 25;

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
    if (scrollY > 160) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Quick filter
      if (activeQuickFilter === 'bestsellers' && !item.isChefSpecial) return false;
      if (activeQuickFilter === 'veg' && item.dietary !== 'veg') return false;
      if (activeQuickFilter === 'nonveg' && item.dietary !== 'non-veg') return false;
      if (activeQuickFilter === 'buckets' && item.category !== 'Buckets') return false;

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
  }, [selectedCategory, activeQuickFilter, searchQuery]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black pb-28 bg-doodle relative">
      {/* ======================================================== */}
      {/* 🚀 ULTRA-SMOOTH STICKY ANIMATED HEADER & CATEGORY DECK    */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#09090e]/95 backdrop-blur-2xl shadow-2xl border-b border-amber-500/25'
            : 'bg-[#0c0c0f]/95 backdrop-blur-xl border-b border-white/5 shadow-xl'
        }`}
      >
        <div className="max-w-md mx-auto px-4">
          {/* Top Identity Row - Animates between spacious & compact */}
          <div
            className={`flex items-center justify-between gap-3 transition-all duration-300 ease-out ${
              isScrolled ? 'py-1.5' : 'py-3'
            }`}
          >
            {/* Logo & Cafe Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div
                  className={`overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out ${
                    isScrolled ? 'w-8 h-8 rounded-xl' : 'w-11 h-11 rounded-2xl'
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
                    isScrolled ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
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
                      : 'max-h-6 opacity-100 mt-0.5 translate-y-0'
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

            {/* Header Action Buttons with Compact Scroll Morphing */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick Search Toggle (appears in compact header when scrolled) */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(!isSearchExpanded);
                  if (!isSearchExpanded) {
                    setTimeout(() => stickySearchInputRef.current?.focus(), 150);
                  }
                }}
                className={`rounded-xl border flex items-center justify-center transition-all active:scale-90 shadow-sm ${
                  isScrolled ? 'w-8 h-8' : 'w-9 h-9'
                } ${
                  isSearchExpanded || (isScrolled && searchQuery)
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500/50'
                }`}
                title="Search menu"
              >
                <Search className={isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              </button>

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

          {/* Expandable Search Input inside Sticky Header */}
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              isSearchExpanded ? 'max-h-14 opacity-100 pb-2.5 pt-0.5' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                ref={stickySearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Zingers, Wings, Buckets, Nuggets..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#141419] border border-amber-500/40 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
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

          {/* Integrated Sticky Category Carousel (Always Perfectly Pinned, ZERO Gap!) */}
          <div className="py-2 border-t border-white/5 overflow-hidden">
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
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                        */}
      {/* ======================================================== */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3.5">
        {/* Main Search Bar (Visible at top of page) */}
        {!isScrolled && (
          <div className="relative animate-fade-in">
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
        )}

        {/* Quick Filter Badges & View Mode Switcher */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveQuickFilter('all')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeQuickFilter === 'all'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white bg-black/30 border border-white/5'
              }`}
            >
              All ({filteredItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveQuickFilter(activeQuickFilter === 'bestsellers' ? 'all' : 'bestsellers')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'bestsellers'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-amber-400 bg-black/30 border border-white/5'
              }`}
            >
              <span>🔥</span>
              <span>Bestsellers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQuickFilter(activeQuickFilter === 'veg' ? 'all' : 'veg')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'veg'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-emerald-400 bg-black/30 border border-white/5'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>Veg Only</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveQuickFilter(activeQuickFilter === 'buckets' ? 'all' : 'buckets')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'buckets'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-amber-400 bg-black/30 border border-white/5'
              }`}
            >
              <span>🪣</span>
              <span>Buckets</span>
            </button>
          </div>

          {/* Layout Mode Toggle: Showcase Cards vs Grid Cards */}
          <div className="flex items-center gap-1 bg-[#141419] p-1 rounded-xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              title="Showcase Cards"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'showcase'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Rows3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="2-Column Grid"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* No Items Found State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#121217]/80 rounded-3xl border border-white/5 p-6 mt-4">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="font-black text-white text-base">No items found</p>
            <p className="text-xs text-zinc-400 mt-1">Try clearing your search or filter</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setActiveQuickFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-amber-500 text-zinc-950 font-black rounded-full text-xs shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW MODE 1: SHOWCASE MAGAZINE CARDS (Cinematic & Rich)   */}
        {/* ======================================================== */}
        {viewMode === 'showcase' && filteredItems.length > 0 && (
          <div className="space-y-5 pt-1">
            {filteredItems.map((dish, index) => {
              const currentPrice = getItemPrice(dish);
              const hasCheese = !!cheeseMap[dish.id];
              const isVegDish = dish.dietary === 'veg';

              return (
                <article
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  style={{ animationDelay: `${index * 25}ms` }}
                  className="group relative bg-gradient-to-b from-[#181822]/95 to-[#121219]/95 card-luxury-border rounded-[28px] overflow-hidden transition-all duration-300 shadow-2xl active:scale-[0.99] cursor-pointer animate-spring"
                >
                  {/* Top Food Photography Canvas */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Gradient Vignettes */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14141d] via-black/20 to-black/60 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#181822] to-transparent pointer-events-none" />

                    {/* Top Overlaid Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2 z-10 pointer-events-none">
                      {/* Dietary & Category Pill */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`glass-pill px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                            isVegDish
                              ? 'text-emerald-400 border-emerald-500/30'
                              : 'text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isVegDish ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-500 shadow-sm shadow-rose-500/50'
                            }`}
                          />
                          <span>{isVegDish ? '100% Pure Veg' : 'Chicken'}</span>
                        </span>

                        {dish.isChefSpecial && (
                          <span className="bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-zinc-950" />
                            <span>Bestseller</span>
                          </span>
                        )}
                      </div>

                      {/* Floating Luxury Price Badge */}
                      <div className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-1 border border-amber-400/30 shadow-xl bg-black/70 backdrop-blur-md">
                        <span className="text-[11px] text-amber-400/80 font-bold">₹</span>
                        <span className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
                          {currentPrice}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Overlaid Badges on Image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 z-10 pointer-events-none">
                      {/* Piece Count Pill */}
                      {dish.pieceCount ? (
                        <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border border-amber-400/25 shadow-md flex items-center gap-1">
                          <span>🍗</span>
                          <span>{dish.pieceCount}</span>
                        </span>
                      ) : (
                        <span className="bg-black/75 backdrop-blur-md text-zinc-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl border border-white/10 shadow-md">
                          {dish.category}
                        </span>
                      )}

                      {/* Spiciness & Rating Indicator */}
                      <div className="flex items-center gap-1.5">
                        {dish.spiceLevel > 0 && (
                          <div className="bg-black/75 backdrop-blur-md px-2 py-1 rounded-xl border border-rose-500/30 flex items-center gap-0.5" title="Spiciness">
                            {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                              <Flame key={i} className="w-3 h-3 fill-rose-500 text-rose-500" />
                            ))}
                          </div>
                        )}

                        {dish.rating && (
                          <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-400/30 flex items-center gap-1 text-[11px] font-black text-amber-400 shadow-sm">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{dish.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Dish Title & Category Line */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-lg sm:text-xl text-white tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                          {dish.name}
                        </h3>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">
                          {dish.category}
                        </span>
                      </div>

                      <p className="text-zinc-300 text-xs sm:text-[13px] font-normal leading-relaxed mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    {/* Bucket Content Tag Cloud */}
                    {dish.bucketContents && (
                      <div className="p-2.5 bg-black/40 rounded-2xl border border-amber-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-amber-400">
                          <span>🪣 Bucket Inclusions</span>
                          <span className="text-zinc-400">{dish.bucketContents.length} Items</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dish.bucketContents.map((content, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1"
                            >
                              <span className="text-amber-400">✓</span> {content}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Veg Variant Selector (Mix Veg vs Spinach & Corn) */}
                    {dish.vegVariants && dish.vegVariants.length > 0 && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="space-y-1.5 p-2 bg-black/40 rounded-2xl border border-white/5"
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block px-1">
                          Select Variant:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {dish.vegVariants.map((variant) => {
                            const isVarSelected =
                              (vegVariantMap[dish.id] || dish.vegVariants![0].name) === variant.name;
                            return (
                              <button
                                key={variant.name}
                                type="button"
                                onClick={(e) => handleSelectVegVariant(dish.id, variant.name, e)}
                                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                                  isVarSelected
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.02]'
                                    : 'bg-zinc-900/80 text-zinc-400 border-white/5 hover:text-zinc-200'
                                }`}
                              >
                                <span>{variant.name}</span>
                                <span className="font-black text-white">₹{variant.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Interactive Cheese Slice Toggle for Zingers */}
                    {dish.hasCheeseOption && (
                      <div
                        onClick={(e) => toggleCheese(dish.id, e)}
                        className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all select-none cursor-pointer ${
                          hasCheese
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                            : 'bg-black/40 hover:bg-black/60 border-white/10 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                              hasCheese
                                ? 'bg-amber-500 border-amber-500 text-zinc-950'
                                : 'border-zinc-600 bg-zinc-900'
                            }`}
                          >
                            {hasCheese && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>🧀 With Cheese Slice</span>
                        </div>
                        <span className={`text-xs font-black ${hasCheese ? 'text-amber-400' : 'text-zinc-400'}`}>
                          +₹20
                        </span>
                      </div>
                    )}

                    {/* Card Action Footer */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Prep: {dish.prepTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW MODE 2: 2-COLUMN MODERN GRID (Instagram Food Style)  */}
        {/* ======================================================== */}
        {viewMode === 'grid' && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {filteredItems.map((dish, index) => {
              const currentPrice = getItemPrice(dish);
              const hasCheese = !!cheeseMap[dish.id];
              const isVegDish = dish.dietary === 'veg';

              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  style={{ animationDelay: `${index * 20}ms` }}
                  className="group relative bg-[#15151c]/95 card-luxury-border rounded-2xl overflow-hidden shadow-xl active:scale-[0.98] cursor-pointer flex flex-col justify-between animate-spring"
                >
                  {/* Image */}
                  <div className="relative h-36 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_FOOD_IMG;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15151c] via-transparent to-black/50" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-2 left-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center shrink-0 bg-black/60 ${
                          isVegDish ? 'border-emerald-500' : 'border-rose-500'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isVegDish ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Floating Price Pill */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-500/40 text-[11px] font-black text-amber-400">
                      ₹{currentPrice}
                    </div>

                    {/* Piece Count on bottom of photo */}
                    {dish.pieceCount && (
                      <span className="absolute bottom-1.5 left-2 bg-black/85 backdrop-blur-md text-amber-300 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border border-amber-500/30">
                        {dish.pieceCount}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-xs sm:text-sm text-white line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mt-1">
                        {dish.description}
                      </p>
                    </div>

                    {/* Cheese / Veg indicator */}
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                      {dish.hasCheeseOption && (
                        <button
                          type="button"
                          onClick={(e) => toggleCheese(dish.id, e)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                            hasCheese
                              ? 'bg-amber-500 text-black border-amber-500'
                              : 'bg-black/40 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {hasCheese ? '✓ Cheese' : '+ Cheese ₹20'}
                        </button>
                      )}

                      {dish.rating && (
                        <span className="ml-auto flex items-center gap-0.5 text-[10px] font-black text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {dish.rating.toFixed(1)}
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

      {/* Floating Back to Top Button (Smooth Scroll Animation) */}
      {scrollY > 300 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full bg-black/85 backdrop-blur-xl border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl shadow-black active:scale-90 transition-all hover:bg-amber-500 hover:text-black animate-spring"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
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
