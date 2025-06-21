import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const MOVES_PER_PAGE = 20;

function Moves() {
  const [moves, setMoves] = useState([]);
  const [filteredMoves, setFilteredMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMove, setSelectedMove] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData('/move?limit=1000')
      .then(data => {
        setMoves(data.results);
        setFilteredMoves(data.results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredMoves(moves);
      setCurrentPage(1);
      return;
    }
    const filtered = moves.filter(move =>
      move.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMoves(filtered);
    setCurrentPage(1);
  }, [search, moves]);

  const totalPages = Math.ceil(filteredMoves.length / MOVES_PER_PAGE);
  const currentMoves = filteredMoves.slice(
    (currentPage - 1) * MOVES_PER_PAGE,
    currentPage * MOVES_PER_PAGE
  );

  const [moveDetails, setMoveDetails] = useState(null);

  const handleClick = (move) => {
    setLoadingDetails(true);
    fetchData(move.url)
      .then(data => {
        setMoveDetails(data);
        setSelectedMove(move);
      })
      .catch(console.error)
      .finally(() => setLoadingDetails(false));
  };

  const formatName = (name) =>
    name
      .split('-')
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ');

  if (loading) return <Loading />;

  return (
    <div className="bc-move-page">
      <h2>Movimentos</h2>

      <input
        type="search"
        placeholder="Buscar movimento..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bc-move-search"
      />

      {filteredMoves.length === 0 && <p>Nenhum movimento encontrado.</p>}

      <ul className="bc-move-grid">
        {currentMoves.map((move) => (
          <li key={move.name}>
            <button
              className="bc-move-button"
              onClick={() => handleClick(move)}
            >
              {formatName(move.name)}
            </button>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="bc-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedMove && (
          <motion.div
            className="bc-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMove(null)}
          >
            <motion.div
              className="bc-popup-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="bc-close-btn"
                onClick={() => setSelectedMove(null)}
                aria-label="Fechar detalhes do movimento"
              >
                ✖
              </button>

              {loadingDetails ? (
                <Loading />
              ) : (
                <>
                  <h3>{formatName(selectedMove.name)}</h3>
                  {moveDetails && (
                    <>
                      <p><strong>Tipo:</strong> {formatName(moveDetails.type.name)}</p>
                      <p><strong>Categoria:</strong> {formatName(moveDetails.damage_class.name)}</p>
                      <p><strong>Poder:</strong> {moveDetails.power ?? '—'}</p>
                      <p><strong>Precisão:</strong> {moveDetails.accuracy ?? '—'}</p>
                      <p><strong>PP:</strong> {moveDetails.pp}</p>
                      <p><strong>Efeito:</strong> {moveDetails.effect_entries.find(e => e.language.name === 'en')?.effect ?? 'Nenhum efeito disponível.'}</p>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Moves;
