import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    url,
    cartItems,
    food_list,
    token,
    promoCodeApplied,
    promoDiscount,
    getDeliveryFee,
    getFinalTotal,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'processing' | 'success' | 'failed'
  const [savedOrderId, setSavedOrderId] = useState(null);

  const [activeTab, setActiveTab] = useState("card"); // 'card' | 'netbanking' | 'upi'
  const [selectedBank, setSelectedBank] = useState("");
  const [upiMethod, setUpiMethod] = useState("id"); // 'id' | 'qr'
  const [upiId, setUpiId] = useState("");

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onPaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = async (e) => {
    e.preventDefault();

    if (getTotalCartAmount() === 0) {
      alert("Cart is empty");
      return;
    }

    // Build items array from cart
    const items = Object.entries(cartItems)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const food = food_list.find((f) => f._id === id);
        return { id, name: food?.name, price: food?.price, qty };
      });

    try {
      const res = await axios.post(
        url + "/api/order/razorpay",
        {
          amount: getFinalTotal(),
          address: data,
          userId: token ? token : "guest_user",
          items,
        },
        token ? { headers: { token } } : {}
      );

      if (!res.data.success) {
        alert("Could not create order. Please try again.");
        return;
      }

      setSavedOrderId(res.data.orderId);
      setShowPaymentModal(true);
    } catch (error) {
      console.log(error);
      alert("Failed to connect to server.");
    }
  };

  const handleDummyPayment = async (e) => {
    e.preventDefault();

    if (activeTab === "netbanking" && !selectedBank) {
      alert("Please select a bank for netbanking payment.");
      return;
    }

    setPaymentStatus("processing");

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1800));

    try {
      await axios.post(url + "/api/order/verify", { orderId: savedOrderId });
      setPaymentStatus("success");
    } catch {
      setPaymentStatus("failed");
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
    setPaymentData({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
    setActiveTab("card");
    setSelectedBank("");
    setUpiMethod("id");
    setUpiId("");
  };

  return (
    <>
      <form className="place-order" onSubmit={handleProceed}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>

          <div className="multi-fields">
            <input name="firstName" onChange={onChangeHandler} type="text" placeholder="First Name" required />
            <input name="lastName" onChange={onChangeHandler} type="text" placeholder="Last Name" required />
          </div>

          <input name="email" onChange={onChangeHandler} type="email" placeholder="Email address" required />
          <input name="street" onChange={onChangeHandler} type="text" placeholder="Street" required />

          <div className="multi-fields">
            <input name="city" onChange={onChangeHandler} type="text" placeholder="City" required />
            <input name="state" onChange={onChangeHandler} type="text" placeholder="State" required />
          </div>

          <div className="multi-fields">
            <input name="zipcode" onChange={onChangeHandler} type="text" placeholder="Zip Code" required />
            <input name="country" onChange={onChangeHandler} type="text" placeholder="Country" required />
          </div>

          <input name="phone" onChange={onChangeHandler} type="text" placeholder="Phone" required />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>

            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{getDeliveryFee()}</p>
              </div>
              <hr />
              {promoDiscount > 0 && (
                <>
                  <div className="cart-total-details">
                    <p>Promo Discount ({promoCodeApplied})</p>
                    <p style={{ color: "#22c55e", fontWeight: "600" }}>-₹{promoDiscount}</p>
                  </div>
                  <hr />
                </>
              )}
              {promoCodeApplied === "FREEBY" && (
                <>
                  <div className="cart-total-details">
                    <p>Promo Discount ({promoCodeApplied})</p>
                    <p style={{ color: "#22c55e", fontWeight: "600" }}>Free Delivery</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{getFinalTotal()}</b>
              </div>
            </div>

            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>

      {/* ── Dummy Payment Modal ── */}
      {showPaymentModal && (
        <div className="payment-overlay" onClick={paymentStatus !== "processing" ? closeModal : undefined}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>

            {/* SUCCESS STATE */}
            {paymentStatus === "success" && (
              <div className="payment-result">
                <div className="result-icon success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p>Your order of <strong>₹{getFinalTotal()}</strong> has been placed.</p>
                <p className="order-id-text">Order ID: <span>{savedOrderId}</span></p>
                <button className="done-btn" onClick={() => { closeModal(); navigate("/"); }}>Back to Home</button>
              </div>
            )}

            {/* FAILED STATE */}
            {paymentStatus === "failed" && (
              <div className="payment-result">
                <div className="result-icon fail-icon">✕</div>
                <h2>Payment Failed</h2>
                <p>Something went wrong. Please try again.</p>
                <button className="done-btn retry-btn" onClick={() => setPaymentStatus(null)}>Retry</button>
              </div>
            )}

            {/* PROCESSING STATE */}
            {paymentStatus === "processing" && (
              <div className="payment-result">
                <div className="spinner"></div>
                <h2>Processing Payment...</h2>
                <p>Please wait, do not close this window.</p>
              </div>
            )}

            {/* FORM STATE */}
            {!paymentStatus && (
              <>
                <div className="payment-modal-header">
                  <div className="payment-brand">
                    <span className="brand-icon">🍅</span>
                    <span>Food Delivery</span>
                  </div>
                  <button className="modal-close" onClick={closeModal} type="button">✕</button>
                </div>

                <div className="payment-amount-badge">
                  Total Payable: <strong>₹{getFinalTotal()}</strong>
                </div>

                <div className="payment-tabs">
                  <span
                    className={`tab ${activeTab === "card" ? "active" : ""}`}
                    onClick={() => setActiveTab("card")}
                  >
                    💳 Card
                  </span>
                  <span
                    className={`tab ${activeTab === "netbanking" ? "active" : ""}`}
                    onClick={() => setActiveTab("netbanking")}
                  >
                    🏦 Netbanking
                  </span>
                  <span
                    className={`tab ${activeTab === "upi" ? "active" : ""}`}
                    onClick={() => setActiveTab("upi")}
                  >
                    📱 UPI
                  </span>
                </div>

                <form className="payment-form" onSubmit={handleDummyPayment}>
                  {activeTab === "card" && (
                    <>
                      <div className="card-visual">
                        <div className="card-chip">▬</div>
                        <div className="card-number-display">
                          {paymentData.cardNumber || "•••• •••• •••• ••••"}
                        </div>
                        <div className="card-bottom">
                          <span>{paymentData.cardName || "CARD HOLDER"}</span>
                          <span>{paymentData.expiry || "MM/YY"}</span>
                        </div>
                      </div>

                      <label>Card Number</label>
                      <input
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={onPaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />

                      <label>Name on Card</label>
                      <input
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={onPaymentChange}
                        placeholder="Your Full Name"
                        required
                      />

                      <div className="payment-row">
                        <div>
                          <label>Expiry Date</label>
                          <input
                            name="expiry"
                            value={paymentData.expiry}
                            onChange={onPaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label>CVV</label>
                          <input
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={onPaymentChange}
                            placeholder="•••"
                            maxLength={3}
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "netbanking" && (
                    <div className="netbanking-container">
                      <label className="section-label">Popular Banks</label>
                      <div className="bank-grid">
                        {[
                          { id: "sbi", name: "State Bank of India", short: "SBI", logo: "🏛️" },
                          { id: "hdfc", name: "HDFC Bank", short: "HDFC", logo: "🏦" },
                          { id: "icici", name: "ICICI Bank", short: "ICICI", logo: "🏢" },
                          { id: "axis", name: "Axis Bank", short: "AXIS", logo: "💸" }
                        ].map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            className={`bank-option ${selectedBank === bank.name ? "active" : ""}`}
                            onClick={() => setSelectedBank(bank.name)}
                          >
                            <span className="bank-logo">{bank.logo}</span>
                            <span className="bank-name">{bank.short}</span>
                          </button>
                        ))}
                      </div>

                      <label style={{ marginTop: "12px" }}>Or Select Other Bank</label>
                      <select
                        className="other-banks-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        required
                      >
                        <option value="">-- Select Bank --</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Union Bank of India">Union Bank of India</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="IDFC First Bank">IDFC First Bank</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                      </select>
                      {selectedBank && (
                        <p className="selected-bank-info">
                          Selected Bank: <strong>{selectedBank}</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "upi" && (
                    <div className="upi-container">
                      <div className="upi-choice">
                        <button
                          type="button"
                          className={`upi-choice-btn ${upiMethod === "id" ? "active" : ""}`}
                          onClick={() => setUpiMethod("id")}
                        >
                          UPI ID
                        </button>
                        <button
                          type="button"
                          className={`upi-choice-btn ${upiMethod === "qr" ? "active" : ""}`}
                          onClick={() => setUpiMethod("qr")}
                        >
                          Scan QR Code
                        </button>
                      </div>

                      {upiMethod === "id" ? (
                        <div className="upi-id-form">
                          <label>Enter UPI ID (VPA)</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank / mobile@upi"
                            pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}"
                            title="Please enter a valid UPI ID (e.g. name@okhdfcbank or 1234567890@paytm)"
                            required
                          />
                          <p className="upi-hint">Examples: name@okhdfcbank, name@ybl, 1234567890@paytm</p>
                        </div>
                      ) : (
                        <div className="upi-qr-container">
                          <div className="qr-box-wrapper">
                            <div className="mock-qr-code">
                              <svg width="120" height="120" viewBox="0 0 100 100" className="qr-svg">
                                <path d="M 5 25 L 5 5 L 25 5" fill="none" stroke="tomato" strokeWidth="4" />
                                <path d="M 75 5 L 95 5 L 95 25" fill="none" stroke="tomato" strokeWidth="4" />
                                <path d="M 5 75 L 5 95 L 25 95" fill="none" stroke="tomato" strokeWidth="4" />
                                <path d="M 75 95 L 95 95 L 95 75" fill="none" stroke="tomato" strokeWidth="4" />
                                
                                <rect x="15" y="15" width="22" height="22" fill="#222" />
                                <rect x="19" y="19" width="14" height="14" fill="#fff" />
                                <rect x="22" y="22" width="8" height="8" fill="#222" />

                                <rect x="63" y="15" width="22" height="22" fill="#222" />
                                <rect x="67" y="19" width="14" height="14" fill="#fff" />
                                <rect x="70" y="22" width="8" height="8" fill="#222" />

                                <rect x="15" y="63" width="22" height="22" fill="#222" />
                                <rect x="19" y="67" width="14" height="14" fill="#fff" />
                                <rect x="22" y="70" width="8" height="8" fill="#222" />
                                
                                <rect x="42" y="15" width="5" height="5" fill="#222" />
                                <rect x="50" y="25" width="5" height="5" fill="#222" />
                                <rect x="42" y="35" width="5" height="5" fill="#222" />
                                <rect x="52" y="42" width="5" height="5" fill="#222" />
                                <rect x="15" y="42" width="5" height="5" fill="#222" />
                                <rect x="25" y="42" width="5" height="5" fill="#222" />
                                <rect x="42" y="50" width="5" height="5" fill="#222" />
                                <rect x="50" y="55" width="5" height="5" fill="#222" />
                                <rect x="42" y="65" width="5" height="5" fill="#222" />
                                <rect x="52" y="72" width="5" height="5" fill="#222" />
                                <rect x="63" y="42" width="5" height="5" fill="#222" />
                                <rect x="75" y="42" width="5" height="5" fill="#222" />
                                <rect x="85" y="42" width="5" height="5" fill="#222" />
                                <rect x="63" y="52" width="5" height="5" fill="#222" />
                                <rect x="75" y="52" width="5" height="5" fill="#222" />
                                <rect x="85" y="52" width="5" height="5" fill="#222" />
                                <rect x="63" y="62" width="5" height="5" fill="#222" />
                                <rect x="75" y="62" width="5" height="5" fill="#222" />
                                <rect x="85" y="62" width="5" height="5" fill="#222" />
                              </svg>
                            </div>
                          </div>
                          <p className="qr-instruction">Scan using Google Pay, PhonePe, Paytm or any UPI App</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button type="submit" className="pay-now-btn">
                    {activeTab === "card" && `Pay ₹${getFinalTotal()} Now →`}
                    {activeTab === "netbanking" && `Pay ₹${getFinalTotal()} via Netbanking →`}
                    {activeTab === "upi" && (upiMethod === "id" ? `Pay ₹${getFinalTotal()} via UPI →` : `Confirm QR Code Payment →`)}
                  </button>

                  <p className="secure-note">🔒 256-bit SSL Secured · Dummy Payment (Demo Mode)</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;
