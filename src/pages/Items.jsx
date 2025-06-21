import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';

function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData('/item?limit=20')
            .then(data => setItems(data.results))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="bc-item-page">
            <h2>Itens</h2>
            <ul>
                {items.map((item, i) => (
                    <li key={i}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Items;