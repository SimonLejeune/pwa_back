const express = require('express');
const cors = require('cors')
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
app.use(cors({
 origin: "https://ngseo.netlify.app"
}));
/*app.use(cors());
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "https://ngseo.netlify.app"); // update to match the domain you will make the request from
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});*/

const greet = express.Router();
greet.get('/', (req, res) => {
 console.log(req.baseUrl);
 res.send('Hello World');
})
app.use('/greet', greet);

app.post('/subscribe', (req, res) => {
 const subscription = req.body;
 const payload = JSON.stringify({ title: 'test' });

 console.log(subscription);

 webpush.sendNotification(subscription, payload).catch(error => {
  console.error(error.stack);
 });
});

const port = process.env.PORT || 80;

app.listen(port, err => {
 if(err) throw err;
 console.log("%c Server running", "color: green");
});
