const express = require("express");
const https   = require("https");
const app     = express();

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.listen(process.env.PORT || 5000, function(err) {
    if (err) console.log(err);

});

app.get('/profile/:id', function(req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    data = ""

    https.get(url, function(https_res) {
        https_res.on("data", function(chunk) {
            data += chunk;
        })

        https_res.on("end", function() {
            data = JSON.parse(data);

            typesArray = data.types.map((objType) => {
                return objType.type.name
            })

            abilitiesArray = data.abilities.map((objAbility) => {
                return objAbility.ability.name
            })

            statsArray = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp";
            }).map((obj2) => {
                return obj2.base_stat
            });

            statsArrayAttack = data.stats.filter((obj_) => {
                return obj_.stat.name == "attack";
            }).map((obj2) => {
                return obj2.base_stat
            });

            statsArrayDefense = data.stats.filter((obj_) => {
                return obj_.stat.name == "defense";
            }).map((obj2) => {
                return obj2.base_stat
            });

            statsArraySpeed = data.stats.filter((obj_) => {
                return obj_.stat.name == "speed";
            }).map((obj2) => {
                return obj2.base_stat
            });

            statsArraySpecialAttack = data.stats.filter((obj_) => {
                return obj_.stat.name == "special-attack";
            }).map((obj2) => {
                return obj2.base_stat
            });

            

            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "height": data.height,
                "weight": data.weight,
                "hp": statsArray[0],
                "attack": statsArrayAttack[0],
                "defense": statsArrayDefense[0],
                "speed": statsArraySpeed[0],
                "specialattack": statsArraySpecialAttack[0],
                "abilities": abilitiesArray,
                "type": typesArray
            });
        });
    });
});