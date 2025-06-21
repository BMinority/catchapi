import { useEffect, useState, useRef } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';
import PokemonCard from '../components/PokemonCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

function Abilities() {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAbility, setSelectedAbility] = useState(null);
  const [abilityPokemons, setAbilityPokemons] = useState([]);
  const [loadingPokemons, setLoadingPokemons] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const resultRef = useRef(null);

  useEffect(() => {
    fetchData('/ability?limit=20')
      .then(data => setAbilities(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (abilityName, url) => {
    if (abilityName === selectedAbility) {
      setSelectedAbility(null);
      setAbilityPokemons([]);
      setCurrentPage(1);
      return;
    }

    setSelectedAbility(abilityName);
    setLoadingPokemons(true);
    setCurrentPage(1);

    fetchData(url)
      .then(data => {
        console.log('Dados da habilidade:', data);
        const pokemons = data.pokemon.map(p => p.pokemon);
        setAbilityPokemons(pokemons);

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      })
      .catch(console.error)
      .finally(() => setLoadingPokemons(false));
  };

  // Paginação de pokemons
  const totalPages = Math.ceil(abilityPokemons.length / ITEMS_PER_PAGE);
  const paginatedPokemons = abilityPokemons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <Loading />;

  return (
    <div className="bc-ability-page">
      <h2>Habilidades Principais</h2>

      <div className="bc-ability-buttons">
        {abilities.map((ability, i) => (
          <button
            key={i}
            className={`bc-ability-button ${ability.name === selectedAbility ? 'active' : ''}`}
            onClick={() => handleClick(ability.name, ability.url)}
          >
            {ability.name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedAbility && (
          <motion.div
            className="bc-ability-results"
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Pokémons com a habilidade <span>{selectedAbility}</span>:</h3>

            {loadingPokemons ? (
              <Loading />
            ) : (
              <>
                <div className="bc-pokemon-grid">
                  {paginatedPokemons.length > 0 ? (
                    paginatedPokemons.map(pokemon => (
                      <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
                    ))
                  ) : (
                    <p>Nenhum Pokémon encontrado.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="bc-pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      ‹ Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Próximo ›
                    </button>
                  </div>
                )}

                <button
                  className="bc-back-to-top"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  ⬆ Voltar ao Topo
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Abilities;
