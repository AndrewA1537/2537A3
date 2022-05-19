const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.listen(process.env.PORT || 5000, function(err) {
    if (err) console.log(err);
});

// connect to mongoDB
// mongoose.connect('mongodb+srv://COMP1537:comp1537@cluster0.q9ny3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { 
// connect locally
mongoose.connect("mongodb://localhost:27017/timeline", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

    // for online
    // authSource: 'admin',
    // user: 'COMP1537',
    // pass: 'comp1537'

    // for local
    authSource: 'admin',
    user: 'root',
    pass: '1234'
});

const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const eventModel = mongoose.model("timelines", eventSchema);

// test routes for CRUD

// Create or insert
app.put('/timeline/create', function(req, res) {
    console.log(req.body)
    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits

    }, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data from /timeline/create: \n" + data);
        }
        res.json(data);
    });
});

// Read 
app.get('/timeline/getAllEvents', function(req, res) {

    eventModel.find({}, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data from /timeline/getAllEvents: \n" + data);
        }
        res.send(data);
    });
});

// Update
app.get('/timeline/update/:id', function(req, res) {
    console.log(req.params)
    eventModel.updateOne({
            _id: req.params.id
        }, {
            $inc: { hits: 1 }
        },

        function(err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Data from /timeline/update/:id: \n" + data);
            }
            res.send("Update is good");
        });
});

// Update
app.get('/timeline/remove/:id', function(req, res) {
    console.log(req.params)
    eventModel.remove({
        _id: req.params.id
    }, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data from /timeline/remove/:id: \n" + data);
        }
        res.send("Remove is good");
    });
});

// routes

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
                "type": typesArray
            });
        });
    });
});