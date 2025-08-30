

// import React, { useState, useEffect } from 'react';

// const ProductManagement = ({ products, setProducts }) => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     category: '☕ Beverages',
//     description: '',
//     ingredients: [''],
//     image: '',
//     inStock: true,
//     featured: false
//   });

//   const categories = [
//     '☕ Beverages',
//     '🍽️ Breakfast', 
//     '🥪 Sandwiches & Wraps',
//     '🍕 Snacks & Appetizers',
//     '🥗 Salads',
//     '🍝 Main Course',
//     '🍰 Desserts & Bakery'
//   ];

//   useEffect(() => {
//     // GSAP Animation
//     if (typeof window !== 'undefined') {
//       import('gsap').then(({ gsap }) => {
//         gsap.fromTo('.product-management-container', 
//           { opacity: 0, y: 20 },
//           { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
//         );
//       });
//     }
//   }, []);

//   // Prevent input selection loss by using a stable handler
//   const handleInputChange = React.useCallback((e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   }, []);

//   const handleIngredientsChange = React.useCallback((index, value) => {
//     setFormData(prev => {
//       const newIngredients = [...prev.ingredients];
//       newIngredients[index] = value;
//       return { ...prev, ingredients: newIngredients };
//     });
//   }, []);

//   const addIngredientField = React.useCallback(() => {
//     setFormData(prev => ({
//       ...prev,
//       ingredients: [...prev.ingredients, '']
//     }));
//   }, []);

//   const removeIngredientField = React.useCallback((index) => {
//     setFormData(prev => ({
//       ...prev,
//       ingredients: prev.ingredients.filter((_, i) => i !== index)
//     }));
//   }, []);

//   const resetForm = React.useCallback(() => {
//     setFormData({
//       name: '',
//       price: '',
//       category: '☕ Beverages',
//       description: '',
//       ingredients: [''],
//       image: '',
//       inStock: true,
//       featured: false
//     });
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const productData = {
//       ...formData,
//       id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
//       price: parseFloat(formData.price),
//       ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
//       rating: editingProduct ? editingProduct.rating : 4.5,
//       reviews: editingProduct ? editingProduct.reviews : 0
//     };

//     if (editingProduct) {
//       setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
//       setIsEditModalOpen(false);
//       setEditingProduct(null);
//     } else {
//       setProducts(prev => [...prev, productData]);
//       setIsAddModalOpen(false);
//     }

//     resetForm();
//   };

//   const handleEdit = React.useCallback((product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       price: product.price.toString(),
//       category: product.category,
//       description: product.description || '',
//       ingredients: product.ingredients || [''],
//       image: product.image || '',
//       inStock: product.inStock,
//       featured: product.featured || false
//     });
//     setIsEditModalOpen(true);
//   }, []);

//   const handleDelete = (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       setProducts(prev => prev.filter(p => p.id !== productId));
//     }
//   };

//   const safeProducts = Array.isArray(products) ? products : [];
//   const filteredProducts = safeProducts.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const Modal = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <i className="ri-close-line text-2xl"></i>
//               </button>
//             </div>
//           </div>
//           <div className="p-6">
//             {children}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="product-management-container space-y-8">
//       {/* Header with Search and Add Button */}
//       <div className="bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <h2 className="text-2xl font-semibold text-gray-900">Product Management</h2>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
//           >
//             <i className="ri-add-line mr-2"></i>
//             Add New Product
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search Products
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by product name..."
//                 className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               />
//               <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Filter by Category
//             </label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//             >
//               <option value="all">All Categories</option>
//               {categories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Products List */}
//       <div className="bg-white rounded-2xl shadow-xl p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProducts.map(product => (
//             <div key={product.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//               <div className="relative mb-4">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 right-2 flex space-x-1">
//                   {product.featured && (
//                     <span className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
//                       Featured
//                     </span>
//                   )}
//                   <span className={`px-2 py-1 text-xs font-medium rounded ${
//                     product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.inStock ? 'In Stock' : 'Out of Stock'}
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-2 mb-4">
//                 <h3 className="font-semibold text-gray-900">{product.name}</h3>
//                 <p className="text-sm text-gray-600">{product.category}</p>
//                 <p className="text-lg font-bold text-amber-600">₹{product.price}</p>
//                 <div className="flex items-center space-x-2">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <i
//                         key={i}
//                         className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-yellow-400`}
//                       ></i>
//                     ))}
//                   </div>
//                   <span className="text-sm text-gray-600">({product.reviews})</span>
//                 </div>
//               </div>

//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleEdit(product)}
//                   className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   <i className="ri-edit-line mr-1"></i>
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
//                 >
//                   <i className="ri-delete-bin-line mr-1"></i>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div className="text-center py-12">
//             <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={isAddModalOpen || isEditModalOpen}
//         onClose={() => {
//           setIsAddModalOpen(false);
//           setIsEditModalOpen(false);
//           setEditingProduct(null);
//           resetForm();
//         }}
//         title={editingProduct ? 'Edit Product' : 'Add New Product'}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price (₹)
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 min="0"
//                 step="0.01"
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Image URL
//               </label>
//               <input
//                 type="url"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Ingredients
//             </label>
//             {formData.ingredients.map((ingredient, index) => (
//               <div key={index} className="flex items-center space-x-2 mb-2">
//                 <input
//                   type="text"
//                   value={ingredient}
//                   onChange={(e) => handleIngredientsChange(index, e.target.value)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//                   placeholder="Ingredient"
//                 />
//                 {formData.ingredients.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeIngredientField(index)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <i className="ri-delete-bin-line"></i>
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addIngredientField}
//               className="text-amber-600 hover:text-amber-700 font-medium"
//             >
//               <i className="ri-add-line mr-1"></i>
//               Add Ingredient
//             </button>
//           </div>

//           <div className="flex items-center space-x-6">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="inStock"
//                 checked={formData.inStock}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <span className="text-sm font-medium text-gray-700">In Stock</span>
//             </label>

//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="featured"
//                 checked={formData.featured}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <span className="text-sm font-medium text-gray-700">Featured Product</span>
//             </label>
//           </div>

//           <div className="flex space-x-4">
//             <button
//               type="submit"
//               className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
//             >
//               {editingProduct ? 'Update Product' : 'Add Product'}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setIsAddModalOpen(false);
//                 setIsEditModalOpen(false);
//                 setEditingProduct(null);
//                 resetForm();
//               }}
//               className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductManagement;



import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../api/products';


const ProductManagement = (props) => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '☕ Beverages',
    description: '',
    ingredients: [''],
    image: '',
    inStock: true,
    featured: false
  });

  // Fetch products from backend on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getAllProducts();
        // API returns { success, data: { products, pagination } }
        setProducts(res.data?.data?.products || []);
      } catch (err) {
        // Optionally handle error
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const categories = [
    '☕ Beverages',
    '🍽️ Breakfast',
    '🥪 Sandwiches & Wraps',
    '🍕 Snacks & Appetizers',
    '🥗 Salads',
    '🍝 Main Course',
    '🍰 Desserts & Bakery'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(
          '.product-management-container',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      });
    }
  }, []);

  // ✅ FIX: simple functions (no useCallback), so inputs won’t blur/unselect
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIngredientsChange = (index, value) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredientField = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '☕ Beverages',
      description: '',
      ingredients: [''],
      image: '',
      inStock: true,
      featured: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      id: editingProduct
        ? editingProduct.id
        : Math.random().toString(36).substr(2, 9),
      price: parseFloat(formData.price),
      ingredients: formData.ingredients.filter((ing) => ing.trim() !== ''),
      rating: editingProduct ? editingProduct.rating : 4.5,
      reviews: editingProduct ? editingProduct.reviews : 0
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? productData : p))
      );
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } else {
      setProducts((prev) => [...prev, productData]);
      setIsAddModalOpen(false);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      ingredients: product.ingredients || [''],
      image: product.image || '',
      inStock: product.inStock,
      featured: product.featured || false
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="product-management-container space-y-8">
      {/* Header with Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Product Management
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            <i className="ri-add-line mr-2"></i>
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {product.featured && (
                    <span className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-lg font-bold text-amber-600">₹{product.price}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`ri-star-${
                          i < Math.floor(product.rating) ? 'fill' : 'line'
                        } text-yellow-400`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews})
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <i className="ri-delete-bin-line mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingProduct(null);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientsChange(index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ingredient"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredientField}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              <i className="ri-add-line mr-1"></i>
              Add Ingredient
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured Product
              </span>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
