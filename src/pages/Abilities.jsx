import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';

function Abilities() {
    const [abilities, setAbilities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData('/ability?limit=20')
            .then(data => setAbilities(data.results))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="bc-ability-page">
            <h2>Habilidades</h2>
            <ul>
                {abilities.map((ability, i) => (
                    <li key={i}>{ability.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Abilities;