import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-wrapper">
        <h2>Pizza Palace</h2>

        <div className="footer-links">
          <a href="/">Menu</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">FAQ</a>
        </div>

        <p>© 2024 Pizza Palace. Crafted for culinary excellence.</p>
      </div>
    </footer>
  );
};

export default Footer;