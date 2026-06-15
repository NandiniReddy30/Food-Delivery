import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExpolreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const { category, setCategory } = useContext(StoreContext);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};

export default Home;
