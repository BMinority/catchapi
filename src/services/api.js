const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchData(endpoint) {

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }

}