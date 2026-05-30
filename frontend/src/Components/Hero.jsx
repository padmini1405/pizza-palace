import "../Styles/Hero.css";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/pizza1.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>
            Authentic Italian Flavors
            <br />
            Delivered to Your Door
          </h1>

          <p>
            Experience the art of pizza making.
            Hand-stretched dough,
            premium ingredients and authentic
            Italian flavors.
          </p>

          <button
            type="button"
            onClick={() => navigate("/menu")}
          >
            View Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;