import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';
import './Pokemons.scss';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Pokemons() {
    const [allPokemons, setAllPokemons] = useState([]);
    const [search, setSearch] = useState('');
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchData('/pokemon?offset=0&limit=100000')
            .then(data => setAllPokemons(data.results))
            .catch(console.error);
    }, []);

    //paginacao
    useEffect(() => {
        if (search) return; //em caso de busca, nao deve paginar
        setLoading(true);
        fetchData(`/pokemon?offset=${offset}&limit=${limit}`)
            .then(data => setPokemons(data.results))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [offset, search]);

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

    return (
        <div className="bc-pokemon-page">
            <h2>Lista de Pokémons</h2>

            <input
                type="text"
                placeholder="Buscar por nome"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                className="bc-search-input"
            />

            {loading && !search ? (
                <Loading />
            ) : (
                <>
                    <div className="bc-pokemon-grid">
                        {filteredPokemons.map((pokemon, i) => (
                            <PokemonCard key={i} name={pokemon.name} url={pokemon.url} />
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
        </div>
    );
}

export default Pokemons;
