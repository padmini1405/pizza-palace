import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import "../Styles/ProductDescription.css";
import API_URL from "../config/api";

const ProductDescription = () => {
  const { id } = useParams(); 
  const { addToCart } = useCart();

  // Core component states
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // POPUP NOTIFICATION STATE SETUP
  const [showPopup, setShowPopup] = useState(false);
  const [popupDetails, setPopupDetails] = useState({ name: "", size: "", qty: 1 });

  // Fetch individual item data directly using your backend handler
  useEffect(() => {
    const fetchPizzaDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/pizzas/${id}`);
        const data = await response.json();

        if (data.success) {
          setPizza(data.pizza);
        } else {
          setError(data.message || "Failed to locate this product.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("An unexpected network error occurred while loading.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPizzaDetails();
    }
  }, [id]);

  // Adjust order quantity count boundaries
  const handleQuantityChange = (type) => {
    if (type === "decrement") {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  // Add constructed item payload to global application basket context
  const handleAddToCartClick = () => {
    if (!pizza) return;

    const currentSizeObj = pizza.sizes[selectedSizeIndex];
    const currentSizeName = currentSizeObj?.size || "Regular";

    addToCart({
      ...pizza,
      id: pizza._id || pizza.id,
      quantity: quantity,
      size: currentSizeName,
      price: currentSizeObj?.price || 0,
    });

    // TRIGGER THE BEAUTIFUL POPUP WINDOW INSIDE THE UI
    setPopupDetails({
      name: pizza.name,
      size: currentSizeName,
      qty: quantity
    });
    setShowPopup(true);

    // Auto-dismiss notification card after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="product-page-wrapper">
        <Navbar />
        <div className="product-loading-container">
          <div className="spinner"></div>
          <p>Baking pizza details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="product-page-wrapper">
        <Navbar />
        <div className="product-error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error || "Pizza item data was not found."}</p>
          <Link to="/" className="btn-back-home">Return to Menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentSizeData = pizza.sizes[selectedSizeIndex];
  const totalDisplayPrice = ((currentSizeData?.price || 0) * quantity).toFixed(2);

  return (
    <div className="product-page-wrapper">
      <Navbar />

      {/* --- BEAUTIFUL DYNAMIC POPUP BANNER --- */}
      <div className={`custom-toast-popup ${showPopup ? "show" : ""}`}>
        <div className="toast-icon">🍕</div>
        <div className="toast-message-content">
          <h4>Added to Basket!</h4>
          <p>{popupDetails.qty}x {popupDetails.name} ({popupDetails.size})</p>
        </div>
        <button type="button" className="toast-close-btn" onClick={() => setShowPopup(false)}>✕</button>
      </div>

      <main className="product-container-layout">
        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <Link to="/">Menu</Link> / <span>{pizza.category || "Signature Pizzas"}</span> /
          <span> {pizza.name}</span>
        </div>

        {/* MAIN SECTION */}
        <div className="product-page">
          {/* LEFT IMAGE PANEL */}
          <div className="product-left">
            <img
              src={pizza.imageUrl}
              alt={pizza.name}
              className="dynamic-product-image"
            />

            {/* BADGES */}
            <div className="pizza-tags">
              {pizza.category === "Traditional" && <span>🔥 Chef's Choice</span>}
              <span>✔ {pizza.category || "Freshly Baked"}</span>
              {pizza.isAvailable === false && <span className="out-of-stock-tag">⚠ Temp Out of Stock</span>}
            </div>
          </div>

          {/* RIGHT METADATA SIDE PANEL */}
          <div className="product-right">
            <h1>{pizza.name}</h1>

            <div className="rating">
              ⭐⭐⭐⭐⭐
              <span>(128 reviews)</span>
            </div>

            <p className="product-desc">
              {pizza.description || "No description provided for this culinary choice."}
            </p>

            {/* SIZE SELECTION ACTIONS */}
            <div className="section-title">SELECT SIZE</div>
            <div className="sizes">
              {pizza.sizes && pizza.sizes.map((sizeOption, index) => (
                <button
                  key={sizeOption._id || index}
                  type="button"
                  className={selectedSizeIndex === index ? "active" : ""}
                  onClick={() => setSelectedSizeIndex(index)}
                >
                  <span>{sizeOption.size}</span>
                  <small>₹{sizeOption.price}</small>
                </button>
              ))}
            </div>

            {/* QUANTITY PICKER ENGINE */}
            <div className="section-title quantity-title">QUANTITY</div>
            <div className="cart-row">
              <div className="quantity-box">
                <button type="button" onClick={() => handleQuantityChange("decrement")}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange("increment")}>+</button>
              </div>

              <button 
                type="button" 
                className="cart-btn"
                onClick={handleAddToCartClick}
                disabled={pizza.isAvailable === false}
              >
                {pizza.isAvailable === false 
                  ? "Out of Stock" 
                  : `Add to Cart — ₹${totalDisplayPrice}`
                }
              </button>
            </div>

            {/* INFO DETAILS WRAPPER */}
            <div className="info-box">
              <h4>ⓘ Nutritional Info & Allergens</h4>
              <div className="nutrition-grid">
                <div>
                  <span>Calories</span>
                  <strong>240 kcal</strong>
                </div>
                <div>
                  <span>Carbs</span>
                  <strong>32g</strong>
                </div>
                <div>
                  <span>Protein</span>
                  <strong>11g</strong>
                </div>
                <div>
                  <span>Fat</span>
                  <strong>8g</strong>
                </div>
              </div>

              <div className="allergens">
                <span>⚠ Contains Gluten</span>
                <span>⚠ Contains Dairy</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER CORE MARKETING CARD METRICS */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Sourdough Crust</h3>
            <p>
              Our signature 48-hour fermented dough creates a light, airy crust with a
              sophisticated tang and perfect chew.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>Farm-to-Palace</h3>
            <p>
              We source our heirloom ingredients and fresh toppings directly from local
              sustainable sources every single morning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱</div>
            <h3>Stone Baked</h3>
            <p>
              Cooked at 180°C to 480°C in our custom stone ovens to achieve authentic leopard-spot
              charring and smoky rich profiles.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDescription;