import { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import Loading from '../components/Loading.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import './Items.scss';

function ItemCard({ name, onClick }) {
    return (
        <motion.div
            className="bc-item-card"
            onClick={onClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
        >
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`}
                alt={name}
            />
            <span>{name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        </motion.div>
    );
}

function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDetails, setItemDetails] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchData(`/item?limit=20&offset=${offset}`)
            .then(data => setItems(prev => [...prev, ...data.results]))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [offset]);

    const handleItemClick = (url) => {
        fetchData(url)
            .then(data => setItemDetails(data))
            .catch(console.error);

        setSelectedItem(true);
    };

    const handleClose = () => {
        setSelectedItem(false);
        setItemDetails(null);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bc-item-page">
            <h2>Itens</h2>

            <input
                type="text"
                className="bc-item-search"
                placeholder="Buscar item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <Loading />}

            <div className="bc-item-grid">
                {filteredItems.map((item, i) => (
                    <ItemCard key={i} name={item.name} onClick={() => handleItemClick(item.url)} />
                ))}
            </div>

            {!loading && (
                <button
                    className="bc-load-more"
                    onClick={() => setOffset(prev => prev + 20)}
                >
                    Carregar mais
                </button>
            )}

            <AnimatePresence>
                {selectedItem && itemDetails && (
                    <motion.div
                        className="bc-popup-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bc-popup-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3>{itemDetails.name}</h3>
                            <p><strong>Categoria:</strong> {itemDetails.category?.name}</p>
                            <p><strong>Custo:</strong> {itemDetails.cost}</p>
                            <p><strong>Efeito:</strong> {itemDetails.effect_entries?.[0]?.short_effect}</p>

                            <button className="bc-close-btn" onClick={handleClose}>✖ Fechar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Items;
