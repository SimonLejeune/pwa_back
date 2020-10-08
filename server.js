const express = require('express');
const app = express();

const webpush = require('web-push');

const vapidKeys = {
 "publicKey":"BCNVbiY2W4wbKEIEoA7ChkmtKWUB5M4NQ-dN4M1acfFJSPEB2gJpNYbb0AnXT2--pcrGDOOclKh3z6si76qfpto",
 "privateKey":"i1MxC-K9kvs8St3o2prBNvwz5Uzd7sZNm_MW8wXTYBE"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const greet = express.Router();
greet.get('/', (req, res) => {
 console.log(req.baseUrl);
 res.send('Hello World');
})
app.use('/greet', greet);

app.post('/subscribe', function(req, res) {
 console.log(req.body);
 const notificationPayload = {
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
 };
 webpush.sendNotification(req.body, JSON.stringify(notificationPayload) );
 res.send(req.body);
});

const port = process.env.PORT || 80;

app.listen(port, err => {
 if(err) throw err;
 console.log("%c Server running", "color: green");
});
