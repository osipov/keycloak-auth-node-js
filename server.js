const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const axios = require('axios');
const qs = require('qs');

const kcMemoryStore = new session.MemoryStore();

const kcConfig = {
    realm: 'pub',
    clientId: 'public',
    serverUrl: 'http://localhost:8080',
}
/*
    bearerOnly: true,
    credentials: {
        secret: 'SdYoQCW2vv4aqDM2X2DdRn1NU1wJUtkS'
    }
*/

const kc = new Keycloak({store: kcMemoryStore}, kcConfig);

const app = express();

const PORT = 9090;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.json());

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    store: kcMemoryStore
}))

app.use(kc.middleware());



app.post('pub/signup', (req, res) => {
    res.json({})
})

app.post('/pub/signin', (req, res) => {
    const bodyJson = req.body;

    const data = {
        'username': bodyJson['username'],
        'password': bodyJson['password'],
        'grant_type': 'password',
        'client_id': 'public' 
    };

    axios.post('http://localhost:8080/realms/pub/protocol/openid-connect/token', data, { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }})
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.json(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });    
})

app.post('pub/signout', (req, res) => {
    res.json({})
})

app.get('/api/secure', kc.protect(), (req, res) =>{
    res.json({message: 'Sign In'});
})

app.listen(PORT, () => {
    console.log(`Up and running on http://localhost:${PORT}`);
})