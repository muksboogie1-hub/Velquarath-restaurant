import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { MenuItem, MenuCategoryId, MENU_CATEGORIES } from '../data/menuData';
import { uploadImage } from '../services/contentService';

export const MenuManager: React.FC = () => {
  const { menuItems, updateMenuItem, removeMenuItem } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleStartNew = () => {
    setIsNew(true);
    setEditingItem({
      id: 'dish_' + Date.now(),
      name: '',
      category: 'grill',
      categoryLabel: 'Off the Charcoal Grill',
      price: '$15',
      description: '',
      image: '',
      imageAlt: '',
      dietaryOrNote: '',
      featured: false,
      comingSoon: false,
      isAvailable: true,
      displayOrder: menuItems.length,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      if (res.url) {
        setEditingItem({
          ...editingItem,
          image: res.url,
          imageAlt: editingItem.imageAlt || editingItem.name,
        });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaveStatus('Saving item...');
    const ok = await updateMenuItem(editingItem);
    if (ok) {
      setSaveStatus('Saved successfully!');
      setTimeout(() => {
        setEditingItem(null);
        setIsNew(false);
        setSaveStatus(null);
      }, 700);
    } else {
      setSaveStatus('Error saving item. Please try again.');
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updated = { ...item, isAvailable: item.isAvailable === false ? true : false };
    await updateMenuItem(updated);
  };

  const handleDelete = async (id: string) => {
    await removeMenuItem(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#332E26]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F4ECDA]">Menu Management</h2>
          <p className="text-xs text-[#B8AD96] mt-1">
            Manage your food &amp; drinks catalog, update live pricing, toggle availability, and upload photos.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish / Drink</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#B8AD96] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name, description..."
            className="w-full bg-[#1E1B17] border border-[#332E26] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F4ECDA] placeholder-[#736B5E] focus:border-[#C9A24B] focus:outline-none"
          />
        </div>
        {/* Count indicator */}
        <div className="text-xs text-[#B8AD96] font-mono self-center">
          Showing {filteredItems.length} of {menuItems.length} items
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#C9A24B] text-[#141210]'
              : 'bg-[#1E1B17] text-[#B8AD96] hover:text-[#F4ECDA] border border-[#332E26]'
          }`}
        >
          All Categories ({menuItems.length})
        </button>
        {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#C9A24B] text-[#141210]'
                : 'bg-[#1E1B17] text-[#B8AD96] hover:text-[#F4ECDA] border border-[#332E26]'
            }`}
          >
            {cat.label} (
            {menuItems.filter((i) => i.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Menu items list table */}
      <div className="bg-[#1E1B17] border border-[#332E26] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F4ECDA]">
            <thead className="bg-[#141210] border-b border-[#332E26] text-[#B8AD96] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item &amp; Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Live Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#332E26]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#B8AD96]">
                    No menu items found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#26221D]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#141210] shrink-0 border border-[#332E26]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#141210] border border-[#332E26] flex items-center justify-center text-[#736B5E] shrink-0 text-[10px]">
                            No photo
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#F4ECDA]">
                              {item.name}
                            </span>
                            {item.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-950/70 text-amber-300 border border-amber-700/50">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>Featured</span>
                              </span>
                            )}
                            {item.comingSoon && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-950/70 text-sky-300 border border-sky-700/50">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#B8AD96] line-clamp-1 max-w-md mt-0.5">
                            {item.description || 'No description provided.'}
                          </p>
                          {item.dietaryOrNote && (
                            <span className="text-[11px] text-[#C9A24B] mt-0.5 block">
                              {item.dietaryOrNote}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#B8AD96] whitespace-nowrap">
                      <span className="px-2 py-1 rounded bg-[#141210] border border-[#332E26] text-[11px]">
                        {item.categoryLabel || item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[#C9A24B]">
                      {item.price || (
                        <span className="text-[#736B5E] font-normal italic">Ask Server</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          item.isAvailable !== false
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80'
                            : 'bg-red-950/70 text-red-300 border border-red-700/60 hover:bg-red-900/80'
                        }`}
                        title="Click to toggle availability"
                      >
                        {item.isAvailable !== false ? '● In Stock' : '○ Sold Out'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNew(false);
                            setEditingItem({ ...item });
                          }}
                          className="p-1.5 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-[#B8AD96] hover:text-[#C9A24B] transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg bg-[#26221D] hover:bg-red-950/60 text-[#B8AD96] hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1E1B17] border border-red-900/60 rounded-xl p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-[#F4ECDA]">Confirm Deletion</h3>
            <p className="text-xs text-[#B8AD96] mt-2 leading-relaxed">
              Are you sure you want to delete this menu item? It will be removed from your website immediately.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#B8AD96] hover:text-[#F4ECDA] bg-[#26221D] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#1E1B17] border border-[#332E26] rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#332E26] mb-6">
              <h3 className="font-display text-xl font-bold text-[#F4ECDA]">
                {isNew ? 'Add New Menu Item' : `Edit: ${editingItem.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-[#B8AD96] hover:text-[#F4ECDA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveStatus && (
              <div className="mb-4 p-3 rounded-lg bg-[#26221D] border border-[#C9A24B] text-xs text-[#C9A24B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveStatus}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                    Dish / Drink Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Flame-Grilled Sticky Ribs"
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                    Price (USD or note)
                  </label>
                  <input
                    type="text"
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    placeholder="e.g. $18 or Full: $28 / Half: $16"
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => {
                      const found = MENU_CATEGORIES.find((c) => c.id === e.target.value);
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as Exclude<MenuCategoryId, 'all'>,
                        categoryLabel: found ? found.label : e.target.value,
                      });
                    }}
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  >
                    {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dietary or Note */}
                <div>
                  <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                    Dietary Badge or Serving Note
                  </label>
                  <input
                    type="text"
                    value={editingItem.dietaryOrNote || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, dietaryOrNote: e.target.value })
                    }
                    placeholder="e.g. Served with Sadza & Greens, or Chef Special"
                    className="w-full bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Describe ingredients, cooking method, flavors, or sides..."
                  className="w-full bg-[#141210] border border-[#332E26] rounded-lg p-3 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-[#B8AD96] mb-1">
                  Dish Photo (Upload to Cloud Storage or paste Image URL)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={editingItem.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://... image address"
                    className="flex-1 bg-[#141210] border border-[#332E26] rounded-lg px-3.5 py-2 text-xs text-[#F4ECDA] focus:border-[#C9A24B] focus:outline-none"
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#26221D] hover:bg-[#332E26] text-xs font-semibold text-[#C9A24B] cursor-pointer border border-[#332E26] shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingItem.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded border border-[#332E26]"
                    />
                    <span className="text-[11px] text-[#736B5E]">Photo preview ready</span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-[#141210] border border-[#332E26] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#C9A24B]"
                  />
                  <span className="text-xs text-[#F4ECDA]">In Stock / Available</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-[#141210] border border-[#332E26] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.featured)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#C9A24B]"
                  />
                  <span className="text-xs text-[#F4ECDA]">Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-[#141210] border border-[#332E26] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.comingSoon)}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, comingSoon: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#C9A24B]"
                  />
                  <span className="text-xs text-[#F4ECDA]">Mark as Coming Soon</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#332E26]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#B8AD96] hover:text-[#F4ECDA] bg-[#26221D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#C9A24B] hover:bg-[#DFB85E] text-[#141210] font-semibold text-xs transition-colors shadow-lg cursor-pointer"
                >
                  Save Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
