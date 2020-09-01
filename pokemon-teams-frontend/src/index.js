const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

let _trainers;
let _pokemons;
document.addEventListener("DOMContentLoaded", () => {
    //fetches return promises (which are objects). We take those fetches and put them in an array because
    //due to asychrony, we want to make sure trainers_url is returned before pokemons_url, so pokemons will have trainer cards to attach to

    const trainerPromise = fetch(TRAINERS_URL).then((r) => r.json());
    const pokePromise = fetch(POKEMONS_URL).then((r) => r.json());

    Promise.all([trainerPromise, pokePromise]).then(data => {
        [_trainers, _pokemon] = data;
        renderTrainers(_trainers);
        renderPokemons(_pokemons);
    });
});



    function renderTrainers(data) {
        data.forEach(renderTrainer)//#alternative: data.forEach((trainer) => renderTrainer(trainer));
    }

    function renderTrainer(trainer) {
        const list = document.querySelector('main')
        const card = document.createElement("div")
        card.classList.add('card'); // same as: card.setAttribute('class', 'card')
        card.setAttribute('data-id', trainer.id);


        card.innerHTML = `
        <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
        </ul>
        `;
        const button = card.querySelector('button')// finding the 'add pokemon' button and assigning it to a variable
        button.addEventListener('click', () => addPokemon(trainer.id));
        list.append(card);
    }

    function renderPokemons(data) {
        data.forEach(poke => renderpokemon(poke));
    }

    function renderpokemon(poke) {
        const trainer = document.querySelector(`[data-id='${poke.trainer_id}']`); // we're finding the trainer that the poke belongs to 
        const li = document.createElement('li')
        li.innerHTML = `${poke.nickname} (${poke.species}) 
        <button class="release" data-pokemon-id="${poke.id}">Release</button>`;

        const button = li.querySelector('button');
        button.addEventListener('click', () => releasePokemon(poke.id));

        trainer.append(li);

    }

    function addPokemon(trainerId) {
        //we're checking to see if the selected trainer has less than 6 pokemon, if so we evoke the fetch
        if (_pokemons.filter((e) => parseInt(e.trainer_id) == trainerId).length < 6) {
            fetch(POKEMONS_URL, {
                method: 'POST',
                headers: {
                    Accepts: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ trainerId }),
            })
                .then((res) => res.json())
                .then((json) => {
                    _pokemons.push(json); //we're adding the new poke to our pokemons list
                    renderPokemon(json);
                });
        }
    }

    function releasePokemon(id) {
        document.querySelector(`[data-pokemon-id='${id}']`).parentNode.remove()//removes pokemon from  DOM
        _pokemons = _pokemons.filter((e) => e.id !== id);
        fetch(`POKEMONS_URL/${id}`, {
            method: 'DELETE',
            headers: {
                Accepts: 'application/json',
                'Content-type': 'application/json',
            },
        });
    }




