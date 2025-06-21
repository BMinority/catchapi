const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchData(endpoint) {
  const isFullUrl = endpoint.startsWith('http');
  const url = isFullUrl ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar dados da API');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
