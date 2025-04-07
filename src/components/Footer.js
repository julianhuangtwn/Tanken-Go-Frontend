"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const homeURL = window.location.origin; 
      await navigator.clipboard.writeText(homeURL); 
      setCopied(true);

      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
       
      <div className="footer-links">
          <div className="footer-link"><Link href="/explore">Start Planning</Link></div>
          <div className="footer-link"><Link href="/community">Community</Link></div>
          <div className="footer-link"><Link href="/guide">Guide</Link></div>
          <div className="footer-link"><Link href="/account">Account</Link></div>
        </div>

        <div className="footer-title">
          <h2 className="animate-title">Tanken-GO</h2>
        </div>

        <div className="footer-share" onClick={handleShare} style={{ cursor: 'pointer' }}>
          <Image 
            src="/heart.png"
            alt="Share" 
            width={50} 
            height={50} 
            className={copied ? "bumping-heart" : ""} 
          />
          <span>{copied ? 'Link Ready' : 'Share Link!'}</span>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2025 Tanken-GO. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
