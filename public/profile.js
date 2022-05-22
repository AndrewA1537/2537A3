var userId = 1;

// function to load the profile of user
function loadProfile() {
    let data = { userId: userId }

    // fetch promise to response objects
    fetch('/cart', {
        // method type
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
        // .then to handle asynchronous call
    }).then(response => response.json()).then((data) => {
        // diplay data to server
        console.log(data);
        // inject the username div with the users data from mongoDB
        $("#username").text(data.username);
        // collect data of past orders from db and iterate through
        data.past_orders.forEach(order => {
            let tmp = `<h2>${order[0].order_id}</h2><h3>${order[0].timestamp}</h3>
                    `
            order[0].cart.forEach(pokemon => {
                tmp += `<p>${pokemon.pokemonId} ${pokemon.quantity}</p>`;
            })
            // add tmp html data to div
            $("#past-orders").html(tmp);
        });
    });
};

loadProfile();