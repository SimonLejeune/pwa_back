const express = require('express');
const app = express();

const webpush = require('web-push');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var cors = require('cors');

app.use(cors({
    origin: ["https://ngseo.netlify.app", "http://localhost:4200"]
}));

const vapidKeys = {
    "publicKey":"BCNVbiY2W4wbKEIEoA7ChkmtKWUB5M4NQ-dN4M1acfFJSPEB2gJpNYbb0AnXT2--pcrGDOOclKh3z6si76qfpto",
    "privateKey":"i1MxC-K9kvs8St3o2prBNvwz5Uzd7sZNm_MW8wXTYBE"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
    );


const subscribe = express.Router();
const ping = express.Router();
ping.get('/', (req, res) => {
    console.log(req.baseUrl);
    const json = JSON.stringify({
        "notification": {
            "title": "Angular News",
            "body": "Newsletter Available!",
            "icon": "assets/main-page-logo-small-hat.png",
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
    res.send(json);
})
subscribe.post('/', (req, res) => {
    const subscription = req.body;
    const payload = JSON.stringify({
        "notification": {
            "title" : "ping"
    }
});
    console.log(subscription);
    webpush.sendNotification(subscription, payload).then(result => {
        console.log("then");
        console.log(result);
    }).catch(error => {
        console.log("catch");
        console.log(error);
    });
})

app.use('/subscribe', subscribe);
app.use('/ping', ping);

const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
    throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}


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

const port = process.env.PORT || 80;

app.listen(port, () => console.log('server started'));
