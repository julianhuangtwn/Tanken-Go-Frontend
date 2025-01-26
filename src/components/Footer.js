import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#">Employee database</a></li>
            <li><a href="#">Payroll</a></li>
            <li><a href="#">Absences</a></li>
            <li><a href="#">Time tracking</a></li>
            <li><a href="#">Shift planner</a></li>
            <li><a href="#">Recruiting</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Information</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About us</a></li>
            <li><Link href="/temas">Teams</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><a href="#">Lift Media</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Tanken-Go. All rights reserved.</p>
        <ul>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
