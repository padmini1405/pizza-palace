import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import PizzaCard from "../Components/PizzaCard";
import Features from "../Components/Features";
import Footer from "../Components/Footer";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../config/api";


const Home = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetchPizza();
  }, []);

  const fetchPizza = async () => {
    try {

      const response = await fetch(
        `${API_URL}/api/pizzas`
      );

      const data = await response.json();

      if (data.success) {
        setPizzas(data.pizza);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      {/* Featured Pizza Section */}
      <section id="menu" className="container featured-section" style={{ padding: "60px 0" }} >
        <div className="featured-header">
          <h2>Featured Pizzas</h2>
          <Link to="/menu" className="view-more-btn">
            View More
          </Link>
        </div>
        <div className="pizza-grid">
          {pizzas.slice(0, 4).map((pizza) => (
            <PizzaCard
              key={pizza._id}
              pizza={pizza}
            />
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about">
        <Features />
      </section>

      <Footer />
    </>
  );
};

export default Home;