import { useEffect, useState, useRef } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';
import PokemonCard from '../components/PokemonCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import './Types.scss';

function Types() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [typePokemons, setTypePokemons] = useState([]);
    const [loadingPokemons, setLoadingPokemons] = useState(false);
    const resultRef = useRef(null);

    const typeIcons = {
        fire: <img width="24" height="24" src="https://img.icons8.com/emoji/48/fire.png" alt="fire" />,
        water: <img width="24" height="24" src="https://img.icons8.com/arcade/64/water.png" alt="water" />,
        grass: <img width="24" height="24" src="https://img.icons8.com/color/48/grass.png" alt="grass" />,
        electric: <img width="24" height="24" src="https://img.icons8.com/lollipop/48/lightning-bolt.png" alt="lightning" />,
        psychic: <img width="24" height="24" src="https://img.icons8.com/cotton/64/crystal-ball.png" alt="psychic" />,
        normal: <img width="24" height="24" src="https://img.icons8.com/fluency/48/normal-screen.png" alt="normal" />,
        dark: <img width="24" height="24" src="https://img.icons8.com/emoji/48/new-moon-emoji.png" alt="dark" />,
        ice: <img width="24" height="24" src="https://img.icons8.com/lollipop/48/winter.png" alt="ice" />,
        fighting: <img width="24" height="24" src="https://img.icons8.com/3d-fluency/94/boxing.png" alt="fighting" />,
        flying: <img width="24" height="24" src="https://img.icons8.com/color-glass/48/wings.png" alt="flying" />,
        poison: <img width="24" height="24" src="https://img.icons8.com/external-justicon-lineal-color-justicon/64/external-poison-halloween-justicon-lineal-color-justicon.png" alt="poison" />,
        ground: <img width="24" height="24" src="https://img.icons8.com/external-soft-fill-juicy-fish/60/external-grass-video-game-elements-soft-fill-soft-fill-juicy-fish.png" alt="ground" />,
        rock: <img width="24" height="24" src="https://img.icons8.com/color/48/rock.png" alt="rock" />,
        bug: <img width="24" height="24" src="https://img.icons8.com/color/48/insect.png" alt="bug" />,
        ghost: <img width="24" height="24" src="https://img.icons8.com/external-wanicon-flat-wanicon/64/external-ghost-halloween-costume-avatar-wanicon-flat-wanicon.png" alt="ghost" />,
        steel: <img width="24" height="24" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-steel-tools-and-material-ecommerce-flaticons-lineal-color-flat-icons.png" alt="steel" />,
        dragon: <img width="24" height="24" src="https://img.icons8.com/skeuomorphism/32/dragon.png" alt="dragon" />,
        fairy: <img width="24" height="24" src="https://img.icons8.com/external-icongeek26-outline-gradient-icongeek26/64/external-wings-magic-and-fairy-tale-icongeek26-outline-gradient-icongeek26.png" alt="fairy" />,
        stellar: <img width="24" height="24" src="https://img.icons8.com/emoji/48/alien-emoji.png" alt="stellar" />,
        unknown: <img width="24" height="24" src="https://img.icons8.com/nolan/64/question-mark.png" alt="unknown" />
    };

    useEffect(() => {
        fetchData('/type')
            .then(data => setTypes(data.results))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleTypeClick = (typeName) => {
        if (typeName === selectedType) {
            setSelectedType(null);
            setTypePokemons([]);
            return;
        }

        setSelectedType(typeName);
        setLoadingPokemons(true);
        fetchData(`/type/${typeName}`)
            .then(data => {
                const pokemons = data.pokemon.map(p => p.pokemon);
                setTypePokemons(pokemons);
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            })
            .catch(console.error)
            .finally(() => setLoadingPokemons(false));
    };

    if (loading) return <Loading />;

    return (
        <div className="bc-type-page">
            <h2>Tipos de Pokémon</h2>

            <div className="bc-type-buttons">
                {types.map((type, i) => (
                    <button
                        key={i}
                        onClick={() => handleTypeClick(type.name)}
                        className={type.name === selectedType ? 'active' : ''}
                    >
                        <span>{typeIcons[type.name]} {type.name}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {selectedType && (
                    <motion.div
                        className="bc-type-results"
                        ref={resultRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="bc-close-btn"
                            onClick={() => handleTypeClick(selectedType)}
                        >
                            ✖ Fechar
                        </button>

                        <h3>Pokémons do tipo <span>{selectedType}</span>:</h3>

                        {loadingPokemons ? (
                            <Loading />
                        ) : (
                            <div className="bc-pokemon-grid">
                                <AnimatePresence>
                                    {typePokemons.map((p, i) => (
                                        <motion.div
                                            key={p.name}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <PokemonCard name={p.name} url={p.url} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        <button
                            className="bc-back-to-top"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            ⬆ Voltar ao Topo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Types;
