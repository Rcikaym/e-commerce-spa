import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Mono Craft
        </p>
        <div className="footer__links">
          <a href="#about" className="footer__link">About</a>
          <a href="#contact" className="footer__link">Contact</a>
          <a href="#terms" className="footer__link">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
