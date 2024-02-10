import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/about">Hakkımızda</Link></li>
        <li><Link to="/products">Ürünler</Link></li>
        <li><Link to="/contact">İletişim</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;