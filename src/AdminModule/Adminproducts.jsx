import React, { useEffect, useState } from 'react';
import './AdminProducts.css';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../user-authentication/context/AuthContext'; // ✅ import auth context

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ id: '', title: '', price: '', stock: '', rating: '' });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const productsPerPage = 10;

  const { user } = useAuth(); // ✅ get logged-in user

  // ✅ build adminProfile dynamically from logged-in user
  const adminProfile = {
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  };

  useEffect(() => {
    fetch('http://localhost:5001/products')
      .then(res => res.json())
      .then(data => {
        const mapped = Array.isArray(data)
          ? data.map(p => ({
              id: p.id.toString(),
              title: p.title,
              price: p.price,
              stock: p.stock ?? 0,
              rating: p.rating ?? 0
            }))
          : [];
        setProducts(mapped);
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const openModal = () => {
    setNewProduct({ id: '', title: '', price: '', stock: '', rating: '' });
    setShowModal(true);
  };

  const handleProductIdChange = e => {
    const id = e.target.value.trim();
    const match = products.find(p => p.id === id);

    if (match) {
      setNewProduct({
        id: match.id,
        title: match.title,
        price: match.price,
        stock: match.stock,
        rating: match.rating ?? ''
      });
    } else {
      setNewProduct({ id, title: '', price: '', stock: '', rating: '' });
    }
  };

  const handleSubmitProduct = () => {
    const { id, title, price, stock, rating } = newProduct;
    const trimmedTitle = title.trim();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);
    const parsedRating = parseFloat(rating);

    if (!trimmedTitle || isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedStock) || parsedStock < 0) {
      alert("Please enter valid product details.");
      return;
    }

    const payload = {
      title: trimmedTitle,
      price: parsedPrice,
      stock: parsedStock,
      rating: parsedRating || 0
    };

    const exists = products.some(p => p.id === id);

    if (exists) {
      fetch(`http://localhost:5001/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(() => {
          setProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, ...payload } : p))
          );
          setShowModal(false);
        })
        .catch(err => console.error('Failed to update product:', err));
    } else {
      fetch('http://localhost:5001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload })
      })
        .then(res => res.json())
        .then(newEntry => {
          setProducts(prev => [...prev, { ...newEntry, id: newEntry.id.toString() }]);
          setShowModal(false);
        })
        .catch(err => console.error('Failed to add product:', err));
    }

    setNewProduct({ id: '', title: '', price: '', stock: '', rating: '' });
  };

  const handleDeleteProduct = () => {
    const { id } = newProduct;
    fetch(`http://localhost:5001/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        setShowModal(false);
        setNewProduct({ id: '', title: '', price: '', stock: '', rating: '' });
      })
      .catch(err => console.error('Failed to delete product:', err));
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="admin-customer-wrapper">
      {/* ✅ Sidebar now gets dynamic adminProfile */}
      <Sidebar adminProfile={adminProfile} />
      <div className="customer-main">
        <div className="admin-customer">
          <div className="product-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="top-add-btn" onClick={openModal}>Add / Update Product</button>
            </div>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>ItemNumber</th>
                <th>Title</th>
                <th>Price (₹)</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p.id}>
                  <td>{products.findIndex(prod => prod.id === p.id) + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ⟨
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ⟩
            </button>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Enter Product Details</h3>
                <form className="add-product-form" onSubmit={e => e.preventDefault()}>
                  <input type="text" placeholder="Product ID" value={newProduct.id} onChange={handleProductIdChange} />
                  <input type="text" placeholder="Product Title" value={newProduct.title} required onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                  <input type="number" placeholder="Price" value={newProduct.price} required min="0.01" step="0.01" onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  <input type="number" placeholder="Stock" value={newProduct.stock} required min="0" step="1" onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <label key={star}>
                        <input type="radio" name="rating" value={star} checked={parseInt(newProduct.rating) === star} onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })} />
                        <span className={star <= parseInt(newProduct.rating) ? 'filled' : ''}>★</span>
                      </label>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <button type="submit" onClick={handleSubmitProduct}>Update / Add</button>
                    <button type="button" onClick={handleDeleteProduct}>Delete</button>
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
