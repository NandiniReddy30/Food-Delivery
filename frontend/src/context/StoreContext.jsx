import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  const url = "https://food-delivery-backend.onrender.com";
  const [token, setToken] = useState("");

  const [food_list, setFoodList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoCodeApplied, setPromoCodeApplied] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [category, setCategory] = useState("All");

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } },
      );
    }
  };
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } },
    );
    setCartItems(response.data.cartData);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "SAVE10") {
      setPromoDiscount(Math.round(getTotalCartAmount() * 0.1));
      setPromoCodeApplied("SAVE10");
      return {
        success: true,
        message: "SAVE10 promo code applied (10% discount)!",
      };
    } else if (cleanCode === "SAVE20") {
      setPromoDiscount(Math.round(getTotalCartAmount() * 0.2));
      setPromoCodeApplied("SAVE20");
      return {
        success: true,
        message: "SAVE20 promo code applied (20% discount)!",
      };
    } else if (cleanCode === "FOOD20") {
      if (getTotalCartAmount() > 50) {
        setPromoDiscount(20);
        setPromoCodeApplied("FOOD20");
        return {
          success: true,
          message: "FOOD20 promo code applied (₹20 discount)!",
        };
      } else {
        return {
          success: false,
          message: "FOOD20 code requires a subtotal greater than ₹50.",
        };
      }
    } else if (cleanCode === "FREEBY") {
      setPromoDiscount(0);
      setPromoCodeApplied("FREEBY");
      return {
        success: true,
        message: "FREEBY promo code applied (Free Delivery)!",
      };
    } else {
      return {
        success: false,
        message: "Invalid promo code. Try SAVE10, SAVE20, FOOD20, or FREEBY.",
      };
    }
  };

  const removePromoCode = () => {
    setPromoCodeApplied("");
    setPromoDiscount(0);
  };

  const getDeliveryFee = () => {
    if (getTotalCartAmount() === 0) return 0;
    if (promoCodeApplied === "FREEBY") return 0;
    return 2;
  };

  const getFinalTotal = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) return 0;
    const fee = getDeliveryFee();
    const finalTotal = subtotal + fee - promoDiscount;
    return finalTotal < 0 ? 0 : finalTotal;
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchQuery,
    setSearchQuery,
    promoCodeApplied,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    getDeliveryFee,
    getFinalTotal,
    category,
    setCategory,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

export { StoreContext };
