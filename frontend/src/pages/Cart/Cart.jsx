import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    promoCodeApplied,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    getDeliveryFee,
    getFinalTotal,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState({ type: "", message: "" });

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    if (promoCodeApplied) {
      setPromoFeedback({ type: "error", message: "A promo code is already applied. Remove it first." });
      return;
    }

    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoFeedback({ type: "success", message: res.message });
      setPromoInput("");
    } else {
      setPromoFeedback({ type: "error", message: res.message });
    }
  };

  const handlePromoRemove = () => {
    removePromoCode();
    setPromoFeedback({ type: "", message: "" });
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${cartItems[item._id] * item.price}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getDeliveryFee()}</p>
            </div>
            <hr />
            {promoDiscount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Promo Discount ({promoCodeApplied})</p>
                  <p style={{ color: "#22c55e", fontWeight: "600" }}>-${promoDiscount}</p>
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
              <b>
                ${getFinalTotal()}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <p>If you have a promo code, Enter it here</p>
          <form className="cart-promode-input" onSubmit={handlePromoSubmit}>
            <input
              type="text"
              placeholder="promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              disabled={!!promoCodeApplied}
            />
            {promoCodeApplied ? (
              <button type="button" onClick={handlePromoRemove} className="remove-btn">
                Remove
              </button>
            ) : (
              <button type="submit">Submit</button>
            )}
          </form>
          {promoFeedback.message && (
            <p className={`promo-feedback ${promoFeedback.type}`}>
              {promoFeedback.message}
            </p>
          )}
          <div className="available-promos">
            <span>Available codes:</span>
            <span className="code-badge" onClick={() => setPromoInput("SAVE10")}>SAVE10</span>
            <span className="code-badge" onClick={() => setPromoInput("SAVE20")}>SAVE20</span>
            <span className="code-badge" onClick={() => setPromoInput("FOOD20")}>FOOD20</span>
            <span className="code-badge" onClick={() => setPromoInput("FREEBY")}>FREEBY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
