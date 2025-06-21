function PokemonCard({ name, url, onClick }) {
  const id = url.split('/').at(-2);
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div
      className="bc-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      aria-label={`Ver detalhes do Pokémon ${name}`}
    >
      <img src={image} alt={name} />
      <h3 style={{ textTransform: 'capitalize' }}>{name}</h3>
    </div>
  );
}

export default PokemonCard;
