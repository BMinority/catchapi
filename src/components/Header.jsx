import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bc-header">
            <nav>
                <ul>
                    <li><Link to="/">Pokémons</Link></li>
                    <li><Link to="/types">Tipos</Link></li>
                    <li><Link to="/abilities">Habilidades</Link></li>
                    <li><Link to="/items">Itens</Link></li>
                    <li><Link to="/moves">Movimentos</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
