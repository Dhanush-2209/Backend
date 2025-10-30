import React, { useEffect, useState } from 'react';
import './AdminProducts.css';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../user-authentication/context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_URL;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', category: '', price: '', stock: '', rating: '', brand: '', thumbnail: null
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [editing, setEditing] = useState({ id: null, field: null, value: '' });
  const [selectedIds, setSelectedIds] = useState([]);
  const productsPerPage = 10;

  const { user, token } = useAuth();
  const adminProfile = {
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  };

  const fetchProducts = () => {
    fetch(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => toast.error('Failed to fetch products'));
  };

  useEffect(() => {
    if (!token) return;
    fetchProducts();
  }, [token]);

  const openModal = () => {
    setNewProduct({
      title: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      rating: '',
      brand: '',
      thumbnail: null
    });
    setShowModal(true);
  };

  const handleSubmitProduct = () => {
    if (!token) return;
    if (!newProduct.title || !newProduct.price || !newProduct.stock) {
      toast.error("Fill required fields: title, price, stock");
      return;
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (key === 'thumbnail' && value) formData.append('thumbnail', value);
      else formData.append(key, value);
    });

    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts(); // ✅ Ensures image loads immediately
        setShowModal(false);
        toast.success("Product added");
      })
      .catch(err => toast.error('Failed to add product'));
  };

  const handleDeleteProduct = (id, title) => {
    if (!token) return;
    if (!window.confirm(`Delete "${title}"?`)) return;

    fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success("Product deleted");
      })
      .catch(err => toast.error('Failed to delete product'));
  };

  const handleInlineEdit = (id, field, value) => {
    if (!token) return;

    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [field]: value })
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts(); // ✅ Refetch to prevent thumbnail flicker
        toast.success(`${field} updated`);
      })
      .catch(err => toast.error(`Failed to update ${field}`));
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (!token || selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected products?`)) return;

    Promise.all(selectedIds.map(id =>
      fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
    ))
      .then(() => {
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        toast.success("Selected products deleted");
      })
      .catch(err => toast.error("Bulk delete failed"));
  };

  const filteredProducts = products
    .filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortByPrice ? a.price - b.price : 0);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  return (
  <div className="a-admin-user-wrapper">
    <Sidebar adminProfile={adminProfile} />
    <div className="a-user-main">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="a-admin-user">

        {/* Filter & Action Bar */}
        <div className="a-product-controls">
          <div className="a-search-sort-group">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="a-sort-btn" onClick={() => setSortByPrice(prev => !prev)}>
              {sortByPrice ? 'Clear Sort' : 'Sort by Price'}
            </button>
          </div>

          <div className="a-action-group">
            <button className="a-top-add-btn" onClick={openModal}>Add Product</button>
            {selectedIds.length > 0 && (
              <button className="a-top-add-btn" onClick={handleBulkDelete}>
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {/* Product Table */}
        <table className="a-product-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>#</th>
              <th>Title</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Thumbnail</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p, index) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => handleCheckboxChange(p.id)}
                  />
                </td>
                <td>{indexOfFirst + index + 1}</td>
                <td>{p.title}</td>

                {/* Inline Editable Price */}
                <td>
                  {editing.id === p.id && editing.field === 'price' ? (
                    <input
                      type="number"
                      value={editing.value}
                      onChange={e => setEditing({ ...editing, value: e.target.value })}
                      onBlur={() => {
                        handleInlineEdit(p.id, 'price', editing.value);
                        setEditing({ id: null, field: null, value: '' });
                      }}
                    />
                  ) : (
                    <>
                      ₹{p.price}
                      <button
                        className="a-edit-icon"
                        onClick={() => setEditing({ id: p.id, field: 'price', value: p.price })}
                        title="Edit Price"
                      >🖉</button>
                    </>
                  )}
                </td>

                {/* Inline Editable Stock */}
                <td>
                  {editing.id === p.id && editing.field === 'stock' ? (
                    <input
                      type="number"
                      value={editing.value}
                      onChange={e => setEditing({ ...editing, value: e.target.value })}
                      onBlur={() => {
                        handleInlineEdit(p.id, 'stock', editing.value);
                        setEditing({ id: null, field: null, value: '' });
                      }}
                    />
                  ) : (
                    <>
                      {p.stock}
                      <button
                        className="a-edit-icon"
                        onClick={() => setEditing({ id: p.id, field: 'stock', value: p.stock })}
                        title="Edit Stock"
                      >🖉</button>
                    </>
                  )}
                </td>

                {/* Thumbnail */}
                <td>
                  {p.thumbnail && (
                    <img
                      src={p.thumbnail.startsWith("http") ? p.thumbnail : `${BASE_URL}/uploads/${p.thumbnail}`}
                      alt={p.title}
                      className="a-thumbnail-hover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-product.jpg";
                      }}
                    />
                  )}
                </td>

                {/* Last Updated */}
                <td>
                  {p.updatedAt
                    ? new Date(p.updatedAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                    : '—'}
                </td>

                {/* Delete Button */}
                <td>
                  <button onClick={() => handleDeleteProduct(p.id, p.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="a-pagination">
          <button
            className="a-page-btn a-arrow"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⟨
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`a-page-btn ${currentPage === i + 1 ? 'a-active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="a-page-btn a-arrow"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ⟩
          </button>
        </div>

        {/* Modal for Adding Product */}
        {showModal && (
          <div className="a-modal-overlay">
            <div className="a-modal-content">
              <h3>Enter Product Details</h3>
              <form className="a-add-product-form" onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Title" value={newProduct.title} required onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                <input type="text" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                <input type="number" placeholder="Price" value={newProduct.price} required min="0.01" step="0.01" onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                <input type="text" placeholder="Brand" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                <input type="number" placeholder="Stock" value={newProduct.stock} required min="0" step="1" onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                <input type="number" placeholder="Rating" value={newProduct.rating} min="0" max="5" step="0.1" onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })} />
                <input type="file" accept="image/*" onChange={e => setNewProduct({ ...newProduct, thumbnail: e.target.files[0] })} />
                {newProduct.thumbnail && (
                  <img
                    src={URL.createObjectURL(newProduct.thumbnail)}
                    alt="Preview"
                    className="a-thumbnail-preview"
                  />
                )}
                <div className="a-modal-actions">
                  <button type="submit" onClick={handleSubmitProduct}>Add Product</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);


}

export default AdminProducts;
