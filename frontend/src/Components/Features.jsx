import "../Styles/Features.css";
import { FiTarget } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlineRestaurant } from "react-icons/md";

const Features = () => {
  const features = [
    {
      icon: <FiTarget />,
      title: "Fresh Ingredients",
      desc: "We source only the finest local organic vegetables and imported Italian specialty meats.",
    },

    {
      icon: <FaShippingFast />,
      title: "Fast Delivery",
      desc: "Our specialized logistics ensure your pizza arrives hot and fresh within 30 minutes.",
    },

    {
      icon: <MdOutlineRestaurant />,
      title: "Authentic Recipes",
      desc: "Generations of culinary secrets brought to life by our certified Neapolitan pizzaiolos.",
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <h2>Why Choose Pizza Palace</h2>

        <div className="features-grid">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;