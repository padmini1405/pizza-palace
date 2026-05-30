import React from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. IMPORT useNavigate FOR REDIRECTION
import { useCart } from "../context/CartContext";
import "../Styles/Cart.css";

const Cart = () => {
  // 1. Add an empty array fallback directly to the destructuring assignment
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // 2. Add an optional chaining safety check (?.) before running your reduce loop
  const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  // 3. REDIRECT HANDLER
  const handleCheckoutRedirect = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Add some delicious pizzas before checking out!");
      return;
    }
    navigate("/checkout");
  };

    return (
        <div className="cart-page-wrapper">
            <div className="cart-container">
                <h2>Your Pizza Basket</h2>

                {cart.length === 0 ? (
                    <div className="empty-cart-view">
                        <span className="empty-cart-icon">🛒</span>
                        <p>Your basket is currently empty.</p>
                        <Link to="/menu" className="btn-shop-pizzas">Browse Menu</Link>
                    </div>
                ) : (
                    <div className="cart-layout-grid">
                        {/* LEFT ROW: ITEM STACK */}
                        <div className="cart-items-list">
                            {cart.map((item) => (
                                <div className="cart-item-card" key={`${item.id}-${item.size}`}>
                                    <img src={item.imageUrl} alt={item.name} className="cart-item-img" />

                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-size">Size: <span>{item.size}</span></p>
                                        <p className="cart-item-price-each">₹{item.price} each</p>
                                    </div>

                                    {/* QUANTITY CONFIGURATION MANAGEMENT */}
                                    <div className="cart-quantity-controls">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total-price">
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn-remove-item"
                                        onClick={() => removeFromCart(item.id, item.size)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT ROW: ORDER BASKET BREAKDOWN */}
                        <div className="cart-summary-panel">
                            <div className="summary-card">
                                <h3>Basket Total</h3>

                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <strong>₹{subtotal.toFixed(2)}</strong>
                                </div>
                                <div className="summary-row delivery-row">
                                    <span>Delivery</span>
                                    <span className="free-badge-style">Calculated next step</span>
                                </div>

                                <hr className="summary-divider" />

                                <div className="summary-row total-row">
                                    <span>Estimated Total</span>
                                    <strong className="estimated-total-amount">₹{subtotal.toFixed(2)}</strong>
                                </div>

                                {/* 4. ATTACH REDIRECTION EVENT ON CLICK */}
                                <button
                                    type="button"
                                    className="btn-proceed-checkout"
                                    onClick={handleCheckoutRedirect}
                                >
                                    Proceed to Checkout ➔
                                </button>

                                <Link to="/menu" className="continue-shopping-link">⬅ Continue Shopping</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;