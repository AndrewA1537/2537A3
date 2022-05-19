// global variable images
image = "";

function getPokemonByType(typeOfPokemon) {
    $("main").empty();

    for (i = 1; i < 151; i++) {

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
        "success": function(data) {

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
            };
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
    })

    // search by weight
    //$('#poke_weight').click(getPokemonByWeight);

    // search by height
    //$('#poke_height').click(getPokemonByHeight);

    // search by name
    $("#name_search_button").click(getPokemonByName);

    $("body").on("click", ".delete", hide);
}
// executes when DOM is completely loaded in browser
// callback function to call setup when loaded
$(document).ready(setup);