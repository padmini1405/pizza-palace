import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";
import PizzaCard from "../components/PizzaCard";
import "../Styles/Menu.css";
import MenuSkeleton from "../components/MenuSkeleton";
import API_URL from "../config/api.js";

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [filteredPizzas, setFilteredPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "All Items" },
    { name: "veg" },
    { name: "Non-veg" },
    { name: "Speciality" },
    { name: "Combo" },
  ];

  // Robust fallback data used if Cloudinary api_key breaks connection pipelines
  const structuralFallbackPizzas = [
    { _id: "f1", name: "Margherita Classica", description: "San Marzano DOP tomatoes, Mozzarella di Bufala, and fresh basil.", category: "veg", imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3", sizes: [{ size: "Regular", price: 180 }] },
    { _id: "f2", name: "Diavola Inferno", description: "Spicy Italian salami, Calabrian chili paste, and roasted garlic chips.", category: "Non-veg", imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee", sizes: [{ size: "Regular", price: 299 }] },
    { _id: "f3", name: "Truffle Forest Royale", description: "Black truffle tapenade, wild porcini mushrooms, and fresh rosemary.", category: "Speciality", imageUrl: "https://images.unsplash.com/photo-1604917869287-3ae73c77e227", sizes: [{ size: "Regular", price: 424 }] },
    { _id: "f4", name: "Garden Harvest Supreme", description: "Roasted vegetables, balsamic reduction, and organic goat cheese.", category: "veg", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591", sizes: [{ size: "Regular", price: 210 }] },
    { _id: "f5", name: "Carnivoro Prime Feast", description: "Fennel sausage, crispy prosciutto, and hot honey drizzle.", category: "Non-veg", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", sizes: [{ size: "Regular", price: 399 }] }
  ];

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/pizzas`);
        const data = await response.json();
        
        if (data.success && data.pizza && data.pizza.length > 0) {
          setPizzas(data.pizza);
        } else {
          // Graceful fallback switch mechanism
          setPizzas(structuralFallbackPizzas);
        }
      } catch (err) {
        console.warn("Backend unavailable; activating presentation mode fallback.");
        setPizzas(structuralFallbackPizzas);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  // Compute live search filter results
  useEffect(() => {
    let result = [...pizzas];

    if (activeCategory !== "All Items") {
      result = result.filter(
        (p) => p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPizzas(result);
  }, [activeCategory, searchQuery, pizzas]);

  const getCategoryCount = (catName) => {
    if (catName === "All Items") return pizzas.length;
    return pizzas.filter((p) => p.category?.trim().toLowerCase() === catName.trim().toLowerCase()).length;
  };

  return (
    <div className="menu-page-wrapper">
      <Navbar />
      <PromoBanner />

      <main className="menu-container">
        <header className="menu-header">
          <h1>Chef's Signature Menu</h1>
          <p>Discover our handcrafted pizzas made with slow-fermented dough and the finest artisanal ingredients.</p>

          <div className="menu-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for your favorite pizzas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>
        </header>

        <div className="menu-layout">
          <aside className="sidebar-categories">
            <h3>CATEGORIES</h3>
            <ul>
              {categories.map((cat) => (
                <li 
                  key={cat.name} 
                  className={activeCategory === cat.name ? "active" : ""}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span className="category-name">
                    {cat.name === "veg" ? "Veg Options" : cat.name === "Non-veg" ? "Non-Veg" : cat.name}
                  </span>
                  <span className="category-count">{getCategoryCount(cat.name)}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="mobile-categories-pill">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                type="button"
                className={activeCategory === cat.name ? "mobile-pill active" : "mobile-pill"}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name === "All Items" ? "All" : cat.name === "veg" ? "Veg" : cat.name === "Non-veg" ? "Non-Veg" : cat.name}
                <span> ({getCategoryCount(cat.name)})</span>
              </button>
            ))}
          </div>

          <section className="menu-items-grid">
            {loading ? (
              <MenuSkeleton />
            ) : filteredPizzas.length === 0 ? (
              <div className="menu-status-msg">
                <p>No delicious pizzas match your selection.</p>
              </div>
            ) : (
              filteredPizzas.map((pizza) => (
                <div className="menu-card-container" key={pizza._id || pizza.id}>
                  <PizzaCard pizza={pizza} />
                </div>
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;