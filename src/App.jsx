import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Pokemons from './pages/Pokemons.jsx';
import Types from './pages/Types.jsx';
import Abilities from './pages/Abilities.jsx';
import Items from './pages/Items.jsx';
import Moves from './pages/Moves.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Pokemons />} />
        <Route path="/types" element={<Types />} />
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/items" element={<Items />} />
        <Route path="/moves" element={<Moves />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
