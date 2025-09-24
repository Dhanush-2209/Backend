import React, { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { Search, ChevronDown, Star, X } from "lucide-react";
import "./ShopAllPage.css";

const PRODUCTS_PER_PAGE = 9;

const ShopAllPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

  const availableBrands = useMemo(() => {
    const brands = allProducts.map((p) => p.brand);
    return [...new Set(brands)].sort();
  }, [allProducts]);

  const availableCategories = useMemo(() => {
    const categories = allProducts.map((p) => p.category);
    return [...new Set(categories)].sort();
  }, [allProducts]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    if (priceRange.min !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(priceRange.max));
    }

    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setDisplayedProducts(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedBrands,
    selectedCategories,
    priceRange,
    minRating,
    sortBy,
    allProducts,
  ]);

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setMinRating(0);
    setSortBy("featured");
  };

  const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-shop-wrapper">
      <div className="p-shop-container">
        <div className="p-shop-grid">
          <aside className="p-shop-filters">
            <div className="p-shop-filters-header">
              <h2 className="p-shop-filters-title">Filters</h2>
              <button onClick={resetFilters} className="p-clear-button">
                <X size={14} /> Clear All
              </button>
            </div>

            <FilterSection title="Category">
              {availableCategories.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Brand">
              {availableBrands.map((brand) => (
                <Checkbox
                  key={brand}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Price">
              <div className="p-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((p) => ({ ...p, min: e.target.value }))
                  }
                  className="p-price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((p) => ({ ...p, max: e.target.value }))
                  }
                  className="p-price-input"
                />
              </div>
            </FilterSection>

            <FilterSection title="Rating">
              <div className="p-rating-buttons">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`p-rating-button ${
                      minRating === rating ? "active" : ""
                    }`}
                  >
                    {rating} <Star size={14} className="p-star-icon" /> & Up
                  </button>
                ))}
              </div>
            </FilterSection>
          </aside>

          <main className="p-shop-main">
            <div className="p-shop-controls">
              <div className="p-search-wrapper">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-search-input"
                />
                <Search className="p-search-icon" size={20} />
              </div>
              <div className="p-sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-sort-select"
                >
                  <option value="featured">Featured items</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">By Rating</option>
                </select>
                <ChevronDown className="p-sort-icon" size={20} />
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="p-product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-no-results">
                <h3>No Products Found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="p-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div className="p-filter-section">
    <h3 className="p-filter-title">{title}</h3>
    <div className="p-filter-options">{children}</div>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="p-checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="p-checkbox-input"
    />
    <span className="p-checkbox-label">{label}</span>
  </label>
);

export default ShopAllPage;
