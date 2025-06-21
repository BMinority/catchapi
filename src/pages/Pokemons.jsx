import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';
import './Pokemons.scss';
import { FaArrowLeft, FaArrowRight, FaTimes, FaWeight, FaRulerVertical, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Pokemons() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    fetchData('/pokemon?offset=0&limit=100000')
      .then(data => setAllPokemons(data.results))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (search) return;
    setLoading(true);
    fetchData(`/pokemon?offset=${offset}&limit=${limit}`)
      .then(data => setPokemons(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [offset, search]);

  useEffect(() => {
    if (!selectedPokemon) return;
    setLoadingDetails(true);
    fetchData(`/pokemon/${selectedPokemon.name}`)
      .then(data => setPokemonDetails(data))
      .catch(console.error)
      .finally(() => setLoadingDetails(false));
  }, [selectedPokemon]);

  const handlePrev = () => {
    if (offset > 0) setOffset(offset - limit);
  };

  const handleNext = () => {
    setOffset(offset + limit);
  };

  const currentPage = offset / limit + 1;

  const filteredPokemons = search
    ? allPokemons.filter(p => p.name.includes(search))
    : pokemons;

  const formatName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="bc-pokemon-page">
      <h2>Lista de Pokémons</h2>

      <input
        type="text"
        placeholder="Buscar por nome"
        value={search}
        onChange={e => setSearch(e.target.value.toLowerCase())}
        className="bc-search-input"
      />

      {loading && !search ? (
        <Loading />
      ) : (
        <>
          <div className="bc-pokemon-grid">
            {filteredPokemons.map((pokemon, i) => (
              <PokemonCard
                key={i}
                name={pokemon.name}
                url={pokemon.url}
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </div>

          {!search && (
            <>
              <div className="bc-pagination">
                <button onClick={handlePrev} disabled={offset === 0}>
                  <FaArrowLeft /> Anterior
                </button>
                <button onClick={handleNext}>
                  Próximo <FaArrowRight />
                </button>
              </div>

              <p className="bc-page-info">Página {currentPage}</p>
            </>
          )}

          {search && filteredPokemons.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              Nenhum Pokémon encontrado.
            </p>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedPokemon && (
          <motion.div
            className="bc-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPokemon(null)}
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
                onClick={() => setSelectedPokemon(null)}
                aria-label="Fechar detalhes do Pokémon"
              >
                <FaTimes />
              </button>

              {loadingDetails || !pokemonDetails ? (
                <Loading />
              ) : (
                <>
                  <h3>{formatName(pokemonDetails.name)}</h3>

                  <img
                    src={
                      pokemonDetails.sprites.other['official-artwork'].front_default ||
                      pokemonDetails.sprites.front_default
                    }
                    alt={pokemonDetails.name}
                    className="bc-pokemon-image"
                  />

                  <p><FaWeight /> Peso: {(pokemonDetails.weight / 10).toFixed(1)} kg</p>
                  <p><FaRulerVertical /> Altura: {(pokemonDetails.height / 10).toFixed(1)} m</p>

                  <p>
                    <FaHeart /> HP: {pokemonDetails.stats.find(s => s.stat.name === 'hp').base_stat}
                  </p>

                  <p>
                    <strong>Tipo:</strong>{' '}
                    {pokemonDetails.types.map(t => (
                      <span key={t.type.name} className={`bc-type bc-type-${t.type.name}`}>
                        {formatName(t.type.name)}
                      </span>
                    ))}
                  </p>

                  <p><strong>Habilidades:</strong> {pokemonDetails.abilities.map(a => formatName(a.ability.name)).join(', ')}</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Pokemons;
