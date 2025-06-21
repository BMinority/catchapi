import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bc-header">
      <nav className="bc-nav">
        <Link to="/" className="bc-logo-container" onClick={closeMenu}>
          <img
            src="https://img.icons8.com/color/48/insignia-3.png"
            alt="Logotipo Catch API"
            width="48"
            height="48"
          />
          <h1>CatchAPI</h1>
        </Link>

        <button className="bc-menu-toggle" onClick={toggleMenu} aria-label="Abrir ou fechar menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`bc-nav-links ${isOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Pokémons</Link></li>
          <li><Link to="/types" onClick={closeMenu}>Tipos</Link></li>
          <li><Link to="/abilities" onClick={closeMenu}>Habilidades</Link></li>
          <li><Link to="/items" onClick={closeMenu}>Itens</Link></li>
          <li><Link to="/moves" onClick={closeMenu}>Movimentos</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
