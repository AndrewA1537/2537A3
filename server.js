// all necessary requirements and uses for the server
const session = require('express-session');
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

// connection to localhost
const port = process.env.PORT || 5000

// funtion to notify in server which port it is on
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

// use body parser to parse json objects if necessary
app.use(bodyparser.json())

// use sessions to be able to keep track if a user is opening the same server in a new session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

app.use(bodyparser.urlencoded({
    extended: true
}));

// gives access to all files in /public
app.use(express.static(__dirname + '/public'));

// create new schema for adding/manipulating pokemons in mongoDB
const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
    types: [String],
    abilities: [String],
    stats: [Object],
    sprite: String
}, {
    // collection name in mongoDB
    collection: 'pokemons'
});

const pokemonModel = mongoose.model("pokemons", pokemonSchema);

// timeline schema to add/manipulate in mongoDB
const timelineSchema = new mongoose.Schema({
    query: String,
    timestamp: Date
}, {
    // collection name in mongoDB
    collection: 'timelines'
});

const timelineModel = mongoose.model("timelines", timelineSchema);

// user schema to add/manipulate in mongoDB
const usersSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    password: String,
    cart: [Object],
    past_orders: [
        [Object]
    ],
    timeline: [Object]
}, {
    // collection name in mongoDB
    collection: 'users'
});

const usersModel = mongoose.model("users", usersSchema);

// connect to mongoDB database through my own private account
mongoose.connect('mongodb+srv://COMP1537:comp1537@cluster0.q9ny3.mongodb.net/pokemon?retryWrites=true&w=majority', {

    useNewUrlParser: true,
    useUnifiedTopology: true,

    // for online
    authSource: 'admin',
    user: 'COMP1537',
    pass: 'comp1537'
});

// home route to check if user is already authenticated
app.get('/', (req, res) => {
    // if yes then send them to langing page
    if (req.session.authenticated) {
        console.log("Authed")
        alert("Authed");
        res.sendFile(__dirname + '/public/shoppingCart.html')
            // if not then send them to login
    } else {
        console.log("Not Authed")
        alert("Not Authed");
        res.redirect('/login')
    };
});

// route to login page
app.get('/login', (req, res) => {
    // if authed send to profile
    if (req.session.authenticated) {
        res.redirect('/profile')
        // if not authed send them to login
    } else {
        res.sendFile(__dirname + '/public/login.html')
    };
});

// route for login page
app.post('/login', async(req, res) => {
    // wait for function call to see if they are already a user
    await authenticateLogin(req.body.username, req.body.password).then(user => {
        req.session.user = user
    });
    // enable the session if they are
    console.log(req.session.user)
    req.session.authenticated = req.session.user != null
    // send message if authenticated
    res.json({
        success: req.session.authenticated,
        user: req.session.user,
        message: req.session.authenticated ? "Auth good" : "Auth bad"
    });
});

// function to get user name and password and see if there is a match in mongoDB
async function authenticateLogin(username, password) {
    const users = await usersModel.find({
        username: username,
        password: password
    });
    // return user
    return users[0]
};

// route to user profile page
app.get('/profile', (req, res) => {
    // if user is in an existing session then redirect to profile
    if (req.session.authenticated) {
        res.sendFile(__dirname + '/public/profile.html')
        // else send to login
    } else {
        res.redirect('/login')
    };
});

// route to get pokemon by their Id attribute
app.get('/pokemon/:pokemonId', (req, res) => {
    pokemonModel.find({
        id: req.params.pokemonId
    }, function(err, pokemon) {
        if (err) {
            console.log("Error " + err)
        }
        res.json(pokemon)
    });
});

// route to get pokemon by pokemon name
app.get('/name/:pokemonName', (req, res) => {
    pokemonModel.find({
        name: req.params.pokemonName
    }, function(err, pokemon) {
        if (err) {
            console.log("Error: " + err)
        }
        // write to timeline
        let entry = {
            query: `/name/${req.params.pokemonName}`,
            timestamp: Date.now()
        }
        timelineModel.insertMany(entry, () => {
            res.json(pokemon)
        })
    });
})

// route to get pokemon by type
app.get('/type/:pokemonType', (req, res) => {
    pokemonModel.find({
        types: {
            $in: req.params.pokemonType
        }
    }, function(err, pokemon) {
        if (err) {
            console.log("Error " + err)
        }
        // Writes an entry object to the timeline
        let entry = {
            query: `/type/${req.params.pokemonType}`,
            timestamp: Date.now()
        }
        timelineModel.insertMany(entry, () => {
            res.json(pokemon)
        });
    });
});

// route for timeline
app.get('/timeline', (req, res) => {
    timelineModel.find({}, (err, entries) => {
        if (err) {
            console.log("Error " + err)
        };
        res.json(entries);
    });
});

// route to add to shopping cart
app.post('/addtocart', async(req, res) => {
    res.json(await updateCart(req.body.userId, req.body.quantity, req.body.pokemonId))
});


// route to post to cart
app.post('/cart', async(req, res) => {
    const user = await usersModel.find({
        user_id: req.body.userId
    })
    return res.json(user[0]);
})

// function to update cart if there are changes
async function updateCart(userId, quantity, pokemonId) {
    await usersModel.updateOne({
        userId: userId
    }, {
        $push: {
            cart: {
                quantity: quantity,
                pokemonId: pokemonId
            }
        }
    }).then(() => {
        return {
            success: true
        };
    });
};