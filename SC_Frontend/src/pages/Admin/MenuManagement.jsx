import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../api/products';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/menu';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    is_featured: false,
    stock_quantity: 0,
    allergens: '',
    nutritional_info: ''
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setMenuItems(res.data.products || res.data.data.products || []);
    } catch (err) {
      setError('Failed to fetch menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setForm({ ...item });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm({
      name: '', description: '', price: '', image_url: '', category_id: '', is_featured: false, stock_quantity: 0, allergens: '', nutritional_info: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem, form);
        setMenuItems(menuItems.map((item) => (item.id === editingItem ? { ...item, ...form } : item)));
      } else {
        const res = await createMenuItem(form);
        fetchMenu();
      }
      handleCancel();
    } catch (err) {
      setError('Failed to save item.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded" required />
            <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" className="border p-2 rounded" required />
            <input name="image_url" value={form.image_url} onChange={handleInputChange} placeholder="Image URL" className="border p-2 rounded" />
            <input name="category_id" value={form.category_id} onChange={handleInputChange} placeholder="Category ID" className="border p-2 rounded" required />
            <input name="stock_quantity" value={form.stock_quantity} onChange={handleInputChange} placeholder="Stock" type="number" className="border p-2 rounded" />
            <input name="allergens" value={form.allergens} onChange={handleInputChange} placeholder="Allergens" className="border p-2 rounded" />
            <input name="nutritional_info" value={form.nutritional_info} onChange={handleInputChange} placeholder="Nutritional Info" className="border p-2 rounded" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleInputChange} />
              <span>Featured</span>
            </label>
          </div>
          <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" className="border p-2 rounded w-full" />
          <div className="flex space-x-2">
            <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded">{editingItem ? 'Update' : 'Add'} Item</button>
            {editingItem && <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
        {loading ? (
          <div>Loading menu...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Menu</h2>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm text-gray-600">₹{item.price}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
