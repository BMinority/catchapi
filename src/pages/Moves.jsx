import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';

function Moves() {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData('/move?limit=20')
            .then(data => setMoves(data.results))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="bc-move-page">
            <h2>Movimentos</h2>
            <ul>
                {moves.map((move, i) => (
                    <li key={i}>{move.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Moves;