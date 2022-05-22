var taxAmount = 0.06;
var subtotal = 0;
let userId = 1;

async function loadPokemon(pokemonId, quantity) {
    let pokemon = await loadPokemonById(pokemonId);
    let tmp = `
                <div class="row">
                    <div class="thumbnail-container">
                        <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%" 
                        onclick="location.href='pokemon.html?id=${pokemon.id}'" class="pokemon-image-thumb">
                    </div>

                    <div class="row pokemon-buy-details">
                        <h3 class="col card-price">${pokemon.name}</h3>
                        <h3 class="col card-price">$${pokemon.price}</h3>
                        <h3 class="col card-quantity" id="card-quantity-${pokemon.id}">Qty: ${quantity}</h3>
                        <h3 class="col card-total-price"> Total: $${(pokemon.price * quantity).toFixed(2)}</h3>
                        <button class="col add-to-cart-button" onclick="removeFromCart(${pokemon.id})">Remove</button>
                    </div>
                </div>
            `
    $("#cart").append(tmp);
    subtotal += parseFloat(pokemon.price) * parseInt(quantity);
}

function loadShoppingCart() {
    let data = {userId: userId}

    fetch('/cart', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-type': 'application/json' }
    }).then(response => response.json()).then((data) => {
        subtotal = 0;
        data.cart.forEach(async (pokemon) => {
            await loadPokemon(pokemon.pokemonId, pokemon.quantity)
            $("#subtotal").text(subtotal.toFixed(2))
            $("#tax").text((subtotal * taxAmount).toFixed(2))
            $("#total").text((subtotal * taxAmount + subtotal).toFixed(2))
        });
    });
};

async function loadPokemonById(pokemonId) {
    const pokemon = await $.get(`/pokemon/${pokemonId}/`, function () {
    });
    return pokemon[0];
}

loadShoppingCart();