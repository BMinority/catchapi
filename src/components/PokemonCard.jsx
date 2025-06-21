function PokemonCard({ name, url }) {
    const id = url.split('/').at(-2);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
        <div className="bc-card">
            <img src={image} alt={name} />
            <h3>{name}</h3>
        </div>
    );
}

export default PokemonCard;