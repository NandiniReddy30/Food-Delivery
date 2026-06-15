import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken, searchQuery, setSearchQuery, setCategory } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      if (location.hash === "#explore-menu") {
        setMenu("menu");
      } else if (location.hash === "#app-download") {
        setMenu("mobile-app");
      } else if (location.hash === "#footer") {
        setMenu("contact-us");
      } else {
        setMenu("home");
      }
    } else {
      setMenu("");
    }
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" onClick={() => { setCategory("All"); setSearchQuery(""); }}>
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => {
            setMenu("home");
            setCategory("All");
            setSearchQuery("");
          }}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <Link
          to="/#explore-menu"
          onClick={() => {
            setMenu("menu");
            setCategory("All");
            setSearchQuery("");
            const element = document.getElementById("explore-menu");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </Link>
        <Link
          to="/#app-download"
          onClick={() => {
            setMenu("mobile-app");
            const element = document.getElementById("app-download");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </Link>
        <Link
          to="/#footer"
          onClick={() => {
            setMenu("contact-us");
            const element = document.getElementById("footer");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </Link>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-container">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== "/" && e.target.value.trim() !== "") {
                navigate("/");
                setTimeout(() => {
                  const element = document.getElementById("food-display");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }, 150);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const element = document.getElementById("food-display");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            className="navbar-search-input"
          />
          <img
            src={assets.search_icon}
            alt=""
            className="navbar-search-btn-icon"
            onClick={() => {
              const element = document.getElementById("food-display");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/cart")}>
                <img src={assets.bag_icon} alt="" />
                <p>My Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
