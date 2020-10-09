const express = require('express');
const app = express();

const webpush = require('web-push');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var cors = require('cors');

app.use(cors({
    origin: "https://ngseo.netlify.app"
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
    res.send('ping')
})
subscribe.post('/', (req, res) => {
    const subscription = req.body;
    const payload = JSON.stringify({
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

const port = process.env.PORT || 80;

app.listen(port, () => console.log('server started'));
