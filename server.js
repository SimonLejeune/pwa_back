const express = require('express');
const app = express();

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

 res.send(req.body);
});

const port = process.env.PORT || 80;
 
app.listen(port, err => {
 if(err) throw err;
 console.log("%c Server running", "color: green");
});
