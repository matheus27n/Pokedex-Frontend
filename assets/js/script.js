const url = 'https://pokeapi.co/api/v2/pokemon/';
const pokemon = [];

// Função assíncrona para buscar a lista inicial de Pokémons
async function fetchPokemonList() {
    try {
        const response = await fetch(url); // Faz a requisição para obter a lista de Pokémons
        const data = await response.json(); // Converte a resposta em JSON
        return data.results; // Retorna os resultados (URLs dos Pokémons)
    } catch (error) {
        console.error('Erro ao buscar a lista de Pokémons:', error); // Lida com erros na requisição
    }
}

// Função assíncrona para buscar detalhes de cada Pokémon
async function fetchPokemonDetails(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl); // Faz a requisição para obter detalhes de um Pokémon
        return await response.json(); // Converte a resposta em JSON e retorna
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error); // Lida com erros na requisição
    }
}

// Função principal para carregar os Pokémons
async function carregaPokemon() {
    const results = await fetchPokemonList(); // Obtém a lista de Pokémons
    const promises = results.map(result => fetchPokemonDetails(result.url)); // Cria promessas para buscar detalhes de cada Pokémon
    
    try {
        const pokemonDetails = await Promise.all(promises); // Aguarda todas as promessas serem resolvidas
        pokemonDetails.forEach(detail => pokemon.push(detail)); // Adiciona os detalhes de cada Pokémon ao array
        console.log(pokemon); // Mostra os dados no console
        displayPokemon(); // Chama a função para exibir os Pokémons
    } catch (error) {
        console.error('Erro ao carregar detalhes dos Pokémons:', error); // Lida com erros ao buscar detalhes
    }
}

// Função para exibir os Pokémons na página
function displayPokemon() {
    const grid = document.querySelector('.pokemon-grid'); // Seleciona o elemento div onde os Pokémon serão exibidos
    
    // Itera sobre cada Pokémon e cria elementos para exibir suas informações
    pokemon.forEach(p => {
        const pokemonElement = document.createElement('div'); // Cria um elemento div para o Pokémon
        pokemonElement.classList.add('pokemon'); // Adiciona a classe 'pokemon'

        //add um ID para cada pokemon
        pokemonElement.setAttribute('data-id', p.id);
        
        const img = document.createElement('img'); // Cria um elemento de imagem
        img.src = p.sprites.front_default; // Define a URL da imagem do Pokémon
        pokemonElement.appendChild(img); // Adiciona a imagem ao elemento Pokémon

        const h2 = document.createElement('h2'); // Cria um elemento h2 para o nome
        h2.textContent = p.name; // Define o texto do nome do Pokémon
        pokemonElement.appendChild(h2); // Adiciona o nome ao elemento Pokémon

        const types = document.createElement('p'); // Cria um elemento p para os tipos
        types.innerHTML = '<b>Tipos: '; // Define o texto inicial
        p.types.forEach(type => {
            types.innerHTML += `${type.type.name} `; // Adiciona cada tipo ao texto
        });
        pokemonElement.appendChild(types); // Adiciona os tipos ao elemento Pokémon

        const abilities = document.createElement('p'); // Cria um elemento p para as habilidades
        abilities.innerHTML = '<b>Habilidades: '; // Define o texto inicial
        p.abilities.forEach(ability => {
            abilities.innerHTML += `${ability.ability.name}, `; // Adiciona cada habilidade ao texto
        });
        pokemonElement.appendChild(abilities); // Adiciona as habilidades ao elemento Pokémon

        const moves = document.createElement('p'); // Cria um elemento p para os golpes
        moves.innerHTML = '<b>Golpes: '; // Define o texto inicial
        for (let i = 0; i < 5 && i < p.moves.length; i++) {
            moves.innerHTML += `${p.moves[i].move.name}, `; // Adiciona os primeiros 5 golpes ao texto
        }
        pokemonElement.appendChild(moves); // Adiciona os golpes ao elemento Pokémon
        
        grid.appendChild(pokemonElement); // Adiciona o elemento Pokémon ao grid
    });
}

//add um evento para filtar os pokemons
const searchInput = document.getElementsByClassName('input-search'); // Seleciona o campo de busca
searchInput[0].addEventListener('keypress', function(event) { // Adiciona um evento de tecla pressionada ao campo de busca
    if (event.keyCode === 13) { // Verifica se a tecla pressionada é Enter (código 13)
        const pokemons = document.querySelectorAll('.pokemon'); // Seleciona todos os elementos com a classe 'pokemon'
        const search = searchInput[0].value.toLowerCase(); // Obtém o valor digitado no campo de busca e converte para minúsculas
        pokemons.forEach(pokemon => {
            // Obtém o nome do Pokémon e converte para minúsculas
            const name = pokemon.querySelector('h2').textContent.toLowerCase();
            // Verifica se o nome do Pokémon inclui o termo de busca
            if (name.includes(search)) {
                pokemon.style.display = 'block'; // Se incluir, mostra o Pokémon
            } else {
                pokemon.style.display = 'none'; // Se não incluir, oculta o Pokémon
            }
        });
    }
});

const logoPokedex = document.querySelector('.logo-pokedex'); // Seleciona o logo da Pokédex
logoPokedex.addEventListener('click', function() { // Adiciona um evento de clique ao logo da Pokédex
    const pokemons = document.querySelectorAll('.pokemon'); // Seleciona todos os elementos com a classe 'pokemon'
    pokemons.forEach(pokemon => {
        pokemon.style.display = 'block'; // Mostra todos os Pokémons
    });
    searchInput[0].value = ''; // Limpa o campo de busca
});
// Inicia o processo de carregamento dos Pokémons
carregaPokemon();
