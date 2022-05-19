// global variable images
image = "";

function getPokemonByType(typeOfPokemon) {
    $("main").empty();

    for (i = 1; i < 152; i++) {

        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${i}/`,
            type: "GET",
            success: function(data) {
                for (x of data.types) {
                    if (x.type.name == typeOfPokemon) {

                        image =
                            `<div class="image_container">
                            <div style="text-align: center;">${data.id}</div>
                            <div style="text-align: center; class="pokeName">${data.name}</div>
                            <a href="/profile/${data.id}">
                            <img src="${data.sprites.other["official-artwork"].front_default}">
                            </a>
                            </div>`;

                        $("main").append(image);
                    };
                };
            }
        });
    };
};

function getPokemonByName() {
    $("main").empty();

    pokeName = $("#poke_name").val();

    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokeName}/`,
        type: "GET",
        success: function(data) {

            if (pokeName == Number(pokeName)) {
                alert("Please enter a string")
            } else {
                image =
                    `<div class="image_container">
                    <div style="text-align: center;">${data.id}</div>
                    <div style="text-align: center; class="pokeName">${data.name}</div>
                    <a href="/profile/${data.id}">
                    <img src="${data.sprites.other["official-artwork"].front_default}">
                    </a>
                    <button class='delete'>Delete</button>
                    </div>`;

                $("main").append(image);
                insertSearchTimeline();
            };
        }
    });
};

var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function insertTypeTimeline(pokeType) {
    $.ajax({
        url: `http://localhost:3000/timeline/create`,
        type: "PUT",
        data: {
            text: `Client searched by Type: ${pokeType}`,
            time: `At: ${now}`,
            hits: 1
        },
        success: function(r) {
            console.log(r);
        }
    });
};

function insertSearchTimeline(pokeName) {
    pokeName = $("#poke_name").val();
    $.ajax({
        url: `http://localhost:3000/timeline/create`,
        type: "PUT",
        data: {
            text: `Client searched for: ${pokeName}`,
            time: `At: ${now}`,
            hits: 1
        },
        success: function(r) {
            console.log(r);
        }
    });
};

// function to remove pokemon search
function hide() {
    $(this).parent().empty();
};

function setup() {
    // get by type
    $("#poke_type").change(() => {
        pokeType = $("#poke_type option:selected").val();
        getPokemonByType(pokeType);


        insertTypeTimeline(pokeType);
    });

    // search by name
    $("#name_search_button").click(getPokemonByName);

    $("body").on("click", ".delete", hide);
}
// executes when DOM is completely loaded in browser
// callback function to call setup when loaded
$(document).ready(setup);