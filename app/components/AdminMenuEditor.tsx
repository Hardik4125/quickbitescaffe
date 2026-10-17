'use client';

import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { MenuItem, DietaryType } from '../types/menu';
import { Plus, Trash2, Edit3, Check, X, RotateCcw, Sparkles, Store, Utensils } from 'lucide-react';
import { initialCategories } from '../data/initialMenu';

export const AdminMenuEditor: React.FC = () => {
  const {
    menuItems,
    restaurantConfig,
    toggleItemAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateRestaurantConfig,
    resetMenuToDefault,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'items' | 'branding' | 'new-item'>('items');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 12.0,
    category: 'Starters & Small Plates',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    spiceLevel: 0,
    isChefSpecial: false,
    calories: '350 kcal',
    prepTime: '12 mins',
    isAvailable: true,
    allergens: [],
    rating: 5.0,
    reviewsCount: 1,
  });

  // Branding form state
  const [brandingForm, setBrandingForm] = useState(restaurantConfig);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    addMenuItem(newItem);
    setNewItem({
      name: '',
      description: '',
      price: 12.0,
      category: 'Starters & Small Plates',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      dietary: 'veg',
      spiceLevel: 0,
      isChefSpecial: false,
      calories: '350 kcal',
      prepTime: '12 mins',
      isAvailable: true,
      allergens: [],
      rating: 5.0,
      reviewsCount: 1,
    });
    setActiveTab('items');
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMenuItem(editingItem);
    setEditingItem(null);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantConfig(brandingForm);
    alert('Restaurant details updated successfully!');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-100">
      {/* Top Banner & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Live Restaurant Manager
          </div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Dynamic Menu & Operations Studio
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Changes update instantly on customer phone screens when they scan the QR code.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-zinc-100 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'items'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Dishes ({menuItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new-item')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'new-item'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            + Add Dish
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'branding'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Branding & Wi-Fi
          </button>
        </div>
      </div>

      {/* TAB 1: Menu Items Management */}
      {activeTab === 'items' && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 pb-2">
            <span>Toggle the availability switch to immediately mark dishes in or out of stock.</span>
            <button
              type="button"
              onClick={resetMenuToDefault}
              className="inline-flex items-center gap-1 text-zinc-500 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.isAvailable ? 'bg-white border-zinc-200' : 'bg-zinc-50 border-zinc-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.dietary === 'veg' || item.dietary === 'vegan' ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      <h4 className="font-extrabold text-sm text-zinc-900 truncate">
                        {item.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{item.category}</p>
                    <span className="font-bold text-xs text-amber-600">
                      {restaurantConfig.currencySymbol}
                      {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions & Availability Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Switch */}
                  <label className="flex items-center cursor-pointer gap-2" title="Toggle Stock Availability">
                    <input
                      type="checkbox"
                      checked={item.isAvailable}
                      onChange={() => toggleItemAvailability(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 relative" />
                    <span className="text-[10px] font-bold text-zinc-600 hidden sm:inline">
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </span>
                  </label>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Add New Dish Form */}
      {activeTab === 'new-item' && (
        <form onSubmit={handleCreateItem} className="pt-6 space-y-4 max-w-xl mx-auto">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-zinc-900">Add New Dish to Menu</h3>
            <p className="text-xs text-zinc-500">
              Fill in the details below. It will immediately appear on the digital menu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Dish Title</label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Truffle Mac & Cheese"
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Price ({restaurantConfig.currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                required
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {initialCategories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Fresh artisanal ingredients, preparation style..."
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Dish Image URL</label>
            <input
              type="url"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Dietary Type</label>
              <select
                value={newItem.dietary}
                onChange={(e) => setNewItem({ ...newItem, dietary: e.target.value as DietaryType })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Spice Level (0-3)</label>
              <select
                value={newItem.spiceLevel}
                onChange={(e) => setNewItem({ ...newItem, spiceLevel: parseInt(e.target.value, 10) })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value={0}>0 - No Spice</option>
                <option value={1}>1 - Mild 🌶️</option>
                <option value={2}>2 - Medium 🌶️🌶️</option>
                <option value={3}>3 - Extra Spicy 🌶️🌶️🌶️</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Prep Time</label>
              <input
                type="text"
                value={newItem.prepTime || ''}
                onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}
                placeholder="e.g. 15 mins"
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Calories</label>
              <input
                type="text"
                value={newItem.calories || ''}
                onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                placeholder="e.g. 450 kcal"
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm py-3 px-5 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            Add Item to Live Menu
          </button>
        </form>
      )}

      {/* TAB 3: Branding & Restaurant Settings */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="pt-6 space-y-4 max-w-xl mx-auto">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-zinc-900">Restaurant Info & Table Settings</h3>
            <p className="text-xs text-zinc-500">
              Customize your venue name, table count, Wi-Fi details, and tax rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={brandingForm.name}
                onChange={(e) => setBrandingForm({ ...brandingForm, name: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Tagline</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Total Tables</label>
              <input
                type="number"
                min="1"
                max="50"
                value={brandingForm.tablesCount}
                onChange={(e) => setBrandingForm({ ...brandingForm, tablesCount: parseInt(e.target.value, 10) || 12 })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={brandingForm.currencySymbol}
                onChange={(e) => setBrandingForm({ ...brandingForm, currencySymbol: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={brandingForm.taxRatePercent}
                onChange={(e) => setBrandingForm({ ...brandingForm, taxRatePercent: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Wi-Fi Network Name</label>
              <input
                type="text"
                value={brandingForm.wifiName}
                onChange={(e) => setBrandingForm({ ...brandingForm, wifiName: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Wi-Fi Password</label>
              <input
                type="text"
                value={brandingForm.wifiPassword}
                onChange={(e) => setBrandingForm({ ...brandingForm, wifiPassword: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-5 rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            Save Restaurant Configuration
          </button>
        </form>
      )}

      {/* Item Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-zinc-900 text-base">Edit Dish</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
