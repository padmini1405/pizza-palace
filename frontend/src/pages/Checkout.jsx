import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/Checkout.css";
import API_URL from "../config/api.js";

const Checkout = () => {
  const { cart = [], clearCart } = useCart();

  // Form Field States
  const [formData, setFormData] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Dedicated Error State Matrix for Inline Messages
  const [errors, setErrors] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    phone: "",
    cart: ""
  });

  const [selectedPayment, setSelectedPayment] = useState("Credit Card");
  const [couponInput, setCouponInput] = useState("");
  const [activeDiscount, setActiveDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [confirmedPaidTotal, setConfirmedPaidTotal] = useState(0);

  const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const deliveryFee = subtotal > 0 ? 45.0 : 0.0;
  const taxAmount = parseFloat((subtotal * 0.05).toFixed(2));

  const discountAmount = parseFloat(((subtotal * activeDiscount) / 100).toFixed(2));
  const finalTotal = parseFloat((subtotal + deliveryFee + taxAmount - discountAmount).toFixed(2));

  // Dynamic state cleaner on input type change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear targeted error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");

    const standardizedCode = couponInput.trim().toUpperCase();

    if (standardizedCode === "FIRST10" || standardizedCode === "PIZZA10") {
      setActiveDiscount(10);
      setAppliedCouponCode(standardizedCode);
      setCouponInput("");
    } else if (standardizedCode === "SUPER30") {
      setActiveDiscount(30);
      setAppliedCouponCode(standardizedCode);
      setCouponInput("");
    } else if (standardizedCode === "") {
      setCouponError("Please type a promo code first.");
    } else {
      setCouponError("Invalid promo coupon sequence.");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveDiscount(0);
    setAppliedCouponCode("");
  };

  // Comprehensive Inline Validation Engine Matrix
  const validateForm = () => {
    let localErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      localErrors.fullName = "Full Name is required to address your delivery.";
      isValid = false;
    }
    if (!formData.streetAddress.trim()) {
      localErrors.streetAddress = "Please mention your exact street and house coordinates.";
      isValid = false;
    }
    if (!formData.city.trim()) {
      localErrors.city = "City field cannot be left blank.";
      isValid = false;
    }
    if (!formData.postalCode.trim()) {
      localErrors.postalCode = "ZIP/Postal code is necessary for regional sorting.";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      localErrors.phone = "Phone number is vital for our riders to reach you.";
      isValid = false;
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      localErrors.phone = "Please enter a valid working phone number format.";
      isValid = false;
    }

    if (cart.length === 0) {
      localErrors.cart = "Your artisan cart canvas is empty. Cannot process checkout.";
      isValid = false;
    }

    setErrors(localErrors);
    return isValid;
  };

  const handlePlaceOrderSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      // CREATE ORDER ITEMS
      const orderItems = cart.map((item) => ({
        pizza: item._id || item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }));

      // DELIVERY ADDRESS
      const deliveryAddress = `
      ${formData.fullName},
      ${formData.streetAddress},
      ${formData.city},
      ${formData.postalCode},
      ${formData.phone}
    `;

      // API CALL
      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: orderItems,
            totalAmount: finalTotal,
            deliveryAddress,
          }),
        }
      );

      const data = await response.json();

      console.log("ORDER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      // SUCCESS
      const mockOrderId =
        "PZ" + Math.floor(100000 + Math.random() * 900000);

      setConfirmedPaidTotal(finalTotal);

      setGeneratedOrderId(mockOrderId);

      setOrderSuccess(true);

      clearCart();

    } catch (error) {

      console.log("PLACE ORDER ERROR:", error);

      alert(error.message);

    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page-wrapper">
        <Navbar />
        <div className="order-success-screen">
          <div className="success-card-panel">
            <div className="success-checkmark-glow">🎉</div>
            <h2>Order Placed & Paid!</h2>
            <p className="success-subtitle">Your payment was completed successfully via instant simulation.</p>

            <div className="order-receipt-summary">
              <div><span>Order ID:</span> <strong>{generatedOrderId}</strong></div>
              <div><span>Deliver To:</span> <strong>{formData.fullName}</strong></div>
              <div><span>Address:</span> <p>{formData.streetAddress}, {formData.city}</p></div>
              <div><span>Amount Paid:</span> <strong className="paid-accent-color">₹{confirmedPaidTotal}</strong></div>
            </div>

            <p className="oven-timer-notice">⏱ Your artisanal selections are being tossed and fired in our stone ovens right now!</p>
            <Link to="/my-orders" className="btn-return-menu-success">Your Order</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <Navbar />

      <main className="checkout-main-container">
        <header className="checkout-title-header">
          <h1>Secure Checkout</h1>
          <p>Finish your order details and we'll start tossing the artisan dough.</p>
        </header>

        <div className="checkout-grid-layout">
          {/* LEFT CONTAINER FOR FILLABLE CHECKOUT FORMS */}
          <form className="checkout-form-column" onSubmit={handlePlaceOrderSubmit} noValidate>

            {/* DELIVERY PANEL */}
            <div className="checkout-card-section">
              <div className="section-header-title">
                <span className="section-icon-marker">📍</span>
                <h3>Delivery Address</h3>
              </div>

              <div className="input-form-grid">
                <div className={`form-field full-width ${errors.fullName ? "invalid-error-container" : ""}`}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Giacomo Rossini"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? "input-error-state" : ""}
                  />
                  {errors.fullName && <span className="field-inline-error">⚠️ {errors.fullName}</span>}
                </div>

                <div className={`form-field full-width ${errors.streetAddress ? "invalid-error-container" : ""}`}>
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    placeholder="123 Artisan Way, Appian Line"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className={errors.streetAddress ? "input-error-state" : ""}
                  />
                  {errors.streetAddress && <span className="field-inline-error">⚠️ {errors.streetAddress}</span>}
                </div>

                <div className={`form-field ${errors.city ? "invalid-error-container" : ""}`}>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Naples"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? "input-error-state" : ""}
                  />
                  {errors.city && <span className="field-inline-error">⚠️ {errors.city}</span>}
                </div>

                <div className={`form-field ${errors.postalCode ? "invalid-error-container" : ""}`}>
                  <label>ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="80100"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={errors.postalCode ? "input-error-state" : ""}
                  />
                  {errors.postalCode && <span className="field-inline-error">⚠️ {errors.postalCode}</span>}
                </div>

                <div className={`form-field full-width ${errors.phone ? "invalid-error-container" : ""}`}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? "input-error-state" : ""}
                  />
                  {errors.phone && <span className="field-inline-error">⚠️ {errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            {/* <div className="checkout-card-section">
              <div className="section-header-title">
                <span className="section-icon-marker">💳</span>
                <h3>Payment Method</h3>
              </div>
              <p className="payment-simulation-notice">
                ⚠️ <strong>Sandbox Mode Active:</strong> Clicking "Place Order" simulates an instant 100% paid confirmation.
              </p>

              <div className="payment-selector-row">
                {["Credit Card", "Apple Pay", "Cash on Delivery"].map((method) => (
                  <div
                    key={method}
                    className={`payment-option-card ${selectedPayment === method ? "selected" : ""}`}
                    onClick={() => setSelectedPayment(method)}
                  >
                    <div className="custom-radio-circle"></div>
                    <span>{method}</span>
                  </div>
                ))}
              </div>

              {selectedPayment === "Credit Card" && (
                <div className="credit-card-mock-fields">
                  <div className="form-field full-width">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="Giacomo Rossini" disabled value={formData.fullName} />
                  </div>
                  <div className="form-field full-width">
                    <label>Card Number</label>
                    <input type="text" placeholder="4111 2222 3333 4444" disabled />
                  </div>
                  <div className="form-field-row">
                    <div className="form-field">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="12 / 29" disabled />
                    </div>
                    <div className="form-field">
                      <label>CVV</label>
                      <input type="password" placeholder="***" disabled />
                    </div>
                  </div>
                </div>
              )}
            </div> */}
          </form>

          {/* RIGHT SIDEBAR PANEL - ORDER SUMMARY & DISCOUNT BALANCER */}
          <div className="checkout-summary-column">
            <div className="checkout-card-section sticky-summary-card">
              <div className="section-header-title">
                <h3>Order Summary</h3>
              </div>

              <div className="summary-items-list">
                {cart.length === 0 ? (
                  <p className="empty-cart-summary-msg">Your item stack is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div className="summary-item-row" key={item._id || item.id || idx}>
                      <div className="item-meta-details">
                        <h4>{item.name}</h4>
                        <p>Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* COUPON INPUT FIELD COMPONENT SECTION */}
              <div className="coupon-wrapper-box">
                <label>Have a promo code?</label>
                <div className="coupon-input-element">
                  <input
                    type="text"
                    placeholder="Try FIRST10 or SUPER30"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!appliedCouponCode}
                  />
                  <button type="button" onClick={handleApplyCoupon} disabled={!!appliedCouponCode}>Apply</button>
                </div>

                {couponError && <p className="coupon-error-alert">{couponError}</p>}

                {appliedCouponCode && (
                  <div className="applied-coupon-pill">
                    <span>🎉 Code <strong>{appliedCouponCode}</strong> Applied ({activeDiscount}% Off)</span>
                    <button type="button" onClick={handleRemoveCoupon}>✕</button>
                  </div>
                )}
              </div>

              {/* PRICING SHEET BREAKDOWN METRICS */}
              <div className="pricing-breakdown-ledger">
                <div className="ledger-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {activeDiscount > 0 && (
                  <div className="ledger-row discount-row-style">
                    <span>Coupon Discount ({activeDiscount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="ledger-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "₹0.00"}</span>
                </div>
                <div className="ledger-row">
                  <span>Tax (5% GST)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                <hr className="divider-line" />

                <div className="ledger-row total-row-final">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Error handle label if item stack is empty */}
              {errors.cart && <p className="cart-error-banner">{errors.cart}</p>}

              {/* PRIMARY ORDER ACTION TRIGGERS */}
              <button
                type="button"
                className="btn-submit-place-order"
                onClick={handlePlaceOrderSubmit}
                disabled={cart.length === 0}
              >
                Place Order & Simulate Payment
              </button>
              <p className="ssl-encryption-notice-tag">🔒 Secure 256-bit automated encryption processing pipeline active.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;