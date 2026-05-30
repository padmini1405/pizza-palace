import "../Styles/Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <div className="container newsletter-wrapper">
        <div>
          <h2>Join the Pizza Club</h2>

          <p>
            Get 20% off your first order and exclusive weekly deals.
          </p>
        </div>

        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />

          <button>Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;