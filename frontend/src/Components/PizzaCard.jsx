import "../Styles/PizzaCard.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const PizzaCard = ({ pizza }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleDetails = () => {
    // If your backend uses MongoDB '_id', change this to pizza._id
    const pizzaId = pizza.id || pizza._id; 
    if (pizzaId) {
      navigate(`/product/${pizzaId}`);
    } else {
      console.error("Pizza ID is missing from data object:", pizza);
    }
  };

  return (
    <div className="pizza-card">
      {/* OVERLAY */}
      <div className="card-overlay">
        <button
          type="button"
          className="details-btn"
          onClick={handleDetails}
        >
          Click Here For Details
        </button>
      </div>

      <img
        src={pizza.imageUrl}
        alt={pizza.name}
        className="pizza-image"
      />

      <div className="pizza-content">
        <h3>{pizza.name}</h3>

        <p className="pizza-desc-text">
          {pizza.description && pizza.description.length > 60
            ? `${pizza.description.substring(0, 60)}...`
            : pizza.description || "No description available."}
        </p>

        <div className="card-footer">
          <span className="price">
            ₹{pizza.sizes?.[0]?.price || 0}
          </span>

          <button
            type="button"
            className="add-btn"
            onClick={() =>
              addToCart({
                ...pizza,
                id: pizza.id || pizza._id,
                quantity: 1,
                size: pizza.sizes?.[0]?.size || "Regular",
                price: pizza.sizes?.[0]?.price || 0,
              })
            }
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;