const express = require('express');
const app = express();

const webpush = require('web-push');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
    throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

var cors = require('cors');

const corsOptions = {
    origin: ["https://ngseo.netlify.app", "http://localhost:4200"]
};

app.use(cors(corsOptions));

const vapidKeys = {
    "publicKey":"BCNVbiY2W4wbKEIEoA7ChkmtKWUB5M4NQ-dN4M1acfFJSPEB2gJpNYbb0AnXT2--pcrGDOOclKh3z6si76qfpto",
    "privateKey":"i1MxC-K9kvs8St3o2prBNvwz5Uzd7sZNm_MW8wXTYBE"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
    );

const checkJwt = jwt({
    // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

const ping = express.Router();
ping.get('/', checkJwt, (req, res) => {
    console.log(req.baseUrl);
    const json = JSON.stringify({
        "notification": {
            "title": "ping"
        }
    });
    res.send(json);
})

const subscribe = express.Router();
subscribe.post('/', (req, res) => {
    const subscription = req.body;
    const payload = JSON.stringify({
        "notification": {
            "title": "Angular News",
            "body": "Check out today's weather while you grab a coffee!",
            "icon": "assets/icon-72x72.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    });
    console.log(subscription);
    let pushRes = webpush.sendNotification(subscription, payload).then(result => {
        console.log("then");
        console.log(result);
        return result;
    }).catch(error => {
        console.log("catch");
        console.log(error);
        return error;
    });
    res.status(202).send(pushRes);
})

const weather = express.Router();
// weather.get('/', checkJwt, (req, res) => {
weather.get('/', (req, res) => {
    console.log(req.baseUrl);
    
    let json = {};
    const apiKey = process.env.WEATHER_KEY;

    let data = req.query;

    let lat = data["lat"];
    let lon = data["lon"];
    let city = data["q"];

    let apiCallUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&cnt=7&appid=" + apiKey;

    if (lat && lon) {
        apiCallUrl += "&lat=" + lat + "&lon=" + lon;
    } else if (city) {
        apiCallUrl += "&q=" + city;
    }
    
    

    let request = new XMLHttpRequest();
    request.open("GET", apiCallUrl, false);
    request.send();

    if (request.status == 200)
        json = JSON.parse(request.responseText);
    else
        json = {error: "Request Failed"};

    res.status(request.status).send(json);
})

app.use('/subscribe', subscribe);
app.use('/ping', ping);
app.use('/weather', weather);

app.get('/private', checkJwt, function(req, res) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log('server started'));
