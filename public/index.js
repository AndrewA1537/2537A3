// global variable
image = "";

// process data from pokemon AJAX request
function processPokeResp(data) {
    image += 
    `<div class="image_container">
    <div style="text-align: center;">${data.id}</div>
    <div style="text-align: center; class="pokeName">${data.name}</div>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </a>
    </div>`;
}

// function to populate 3x3 flex cards on index.html with pokemon
async function loadNineImages() {
    for (i = 1; i <= 9; i++) {
        // only when i = 1,4,7
        if (i % 3 == 1) {
            image += `<div class="images_group">`;
        };

        // generate random number between 1-151 (gen 1 pokemon)
        x = Math.floor(Math.random() * 151) + 1;

        // AJAX request
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}`,
            success: processPokeResp
        });

        // only when i = 3,6,9
        if (i % 3 == 0) {
            image += `</div>`;
        };
    };

    $("main").html(image);
}

// setup function (typically to handle events)
function setup() {
    loadNineImages();
};

// executes when DOM is completely loaded in browser
// callback function to call setup when loaded
$(document).ready(setup);