var userId = 1;

// function to load pokemons
async function loadPokemonById(pokemonId) {
    // try catch block to catch error if necessary
    try {
        // try to get pokemon 
        const pokemon = await $.get(`/pokemon/${pokemonId}/`, function() {});
        // return pokemon
        return pokemon[0];
        // catch error 
    } catch {
        let tmp = `
            <p>Pokemon #${pokemonId} error</p>
                `
        $("#results").html(tmp);
    };
};

// function to load pokemons by name
async function loadPokemonByName(pokemonName) {
    // try to get pokemon 
    try {
        const pokemon = await $.get(`/name/${pokemonName}/`, function() {});
        // return pokemon
        return pokemon[0];
        // catch error 
    } catch {
        let tmp = `
            <p>${pokemonName} error</p>
                `
        $("#results").html(tmp);
    };
};

// function to load pokemons by type
async function loadPokemonListByType(type) {
    // try to get pokemon 
    try {
        // return pokemon
        return await $.get(`/type/${type}/`, function() {});
        // catch error 
    } catch {
        let tmp = `
            <p>Did not find any pokemon of type ${type}.</p>
                `
        $("#results").html(tmp);
    };
};

// function to load timeline of user
async function loadTimeline() {
    // try to load timeline
    try {
        const timeline = await $.get(`/timeline/`, function() {});
        // return timeline
        return timeline;
        // catch
    } catch {
        return null;
    };
};

// function to get pokemon data for the client
async function getPokemonData(name) {
    let pokemon = await loadPokemonByName(name);
    // set the gathered data
    let tmp = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprite,
        price: pokemon.price
    };
    return tmp;
}

// function to get pokemon data for the client
async function getPokemonDataById(id) {
    let pokemon = await loadPokemonById(id);
    // set the gathered data
    let tmp = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprite,
        price: pokemon.price
    };
    return tmp;
}

// function to search pokemon by name and display html for it
async function searchByName(name = $("#search-box").val()) {
    await getPokemonData(name).then((pokemon) => {
        let tmp = `
                <div id="grid">
                `;
        // iterate through and display pokemon
        for (row = 0; row < 1; row++) {
            tmp += `<div class="row">`;
            for (col = 0; col < 1; col++) {
                index = 0;
                tmp += `
                    <div class="img-container">
                        <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%"
                            onclick="location.href='pokemon.html?id=${pokemon.id}'" class="pokemon-image">
                        <div class="pokemon-buy-panel row">
                            <h3 class="col card-price">$${pokemon.price}</h3>
                            <h3 class="col card-quantity" id="card-quantity-${pokemon.id}">1</h3>
                            <button class="col card-quantity-button" onclick="decreaseQuantity(${pokemon.id})">-</button>
                            <button class="col card-quantity-button" onclick="increaseQuantity(${pokemon.id})">+</button>
                            <button class="col add-to-cart-button" onclick="addToCart(${pokemon.id})">Add To Cart</button>
                        </div>
                    </div> 
                    `;
            };
            tmp += `</div>`;
        };
        tmp += `</div>`;
        $("#results").html(tmp);
    });
    loadTimelineHandler();
};

// function to search pokemon by type and display html for it
async function searchByType(type = $("#search-box").val()) {
    let resultList = await loadPokemonListByType(type);
    let numberOfResults = resultList.length;
    let rows = Math.ceil(numberOfResults / 3);
    let tmp = `
            <div id="grid">
            `;
    // iterate through and display pokemon
    let index = 0;
    for (row = 0; row < rows; row++) {
        tmp += `<div class="row">`;
        for (col = 0; col < 3; col++) {
            if (index >= numberOfResults) {
                break;
            }
            pokemonJSON = resultList[index++];
            await getPokemonDataById(pokemonJSON.id).then((pokemon) => {
                tmp += `
                    <div class="img-container">
                        <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%"
                            onclick="location.href='pokemon.html?id=${pokemon.id}'" class="pokemon-image">
                        <div class="pokemon-buy-panel row">
                            <h3 class="col card-price">$${pokemon.price}</h3>
                            <h3 class="col card-quantity" id="card-quantity-${pokemon.id}">1</h3>
                            <button class="col card-quantity-button" onclick="decreaseQuantity(${pokemon.id})">-</button>
                            <button class="col card-quantity-button" onclick="increaseQuantity(${pokemon.id})">+</button>
                            <button class="col add-to-cart-button" onclick="addToCart(${pokemon.id})">Add To Cart</button>
                        </div>
                    </div> 
                    `;
            });
        };
        tmp += `</div>`;
    };
    tmp += `</div>`;
    $("#results").html(tmp);
    loadTimelineHandler();
};

// function to timeline
async function loadTimelineHandler() {
    await loadTimeline().then((timeline) => {
        // empty timeline before
        $("#timeline ul").empty();
        let tmp = ""
        timeline.forEach(entry => {
            let timeData = entry.timestamp.split("T")
                // create html of timeline data
            tmp += `<li onclick="parseQuery('${entry.query}')">Query: ${entry.query}<br>${timeData[0]} ${timeData[1].substring(0,8)}</li>`
        });
        $("#timeline ul").append(tmp);
    })
}

// funtion to parse pokemon data query
async function parseQuery(query) {
    let routes = query.split("/")
        // split by name
    if (routes[1] === "name") {
        await searchByName(routes[2])
            // split by type
    } else if (routes[1] === "type") {
        await searchByType(routes[2])
    } else {
        // print error message
        console.log("Error")
    }
}

// funtion to increase quantity of pokemon card to be added to cart
function increaseQuantity(pokemonId) {
    let quantityElement = document.getElementById(`card-quantity-${pokemonId}`);
    quantityElement.innerHTML = parseInt(quantityElement.innerHTML) + 1
}

// funtion to decrease quantity of pokemon card to be added to cart
function decreaseQuantity(pokemonId) {
    let quantityElement = document.getElementById(`card-quantity-${pokemonId}`);
    quantityElement.innerHTML = Math.max(0, parseInt(quantityElement.innerHTML) - 1)
}

// function to add pokemon card and data to cart
function addToCart(pokemonId) {
    let quantity = parseInt(document.getElementById(`card-quantity-${pokemonId}`).innerHTML)
    let data = {
        userId: userId,
        pokemonId: pokemonId,
        quantity: quantity
    }
    // fetch promise
    fetch('/addtocart', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then( () => {
        alert(`Added to cart`)
    });
};
loadTimelineHandler();