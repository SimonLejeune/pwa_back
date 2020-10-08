const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;



const greet = express.Router();
greet.get('/', (req, res) => {
  console.log(req.baseUrl);
  res.send('Hello World');
})

const subscribe = express.Router();
subscribe.get('/', (req, res) => {
  console.log(req.baseUrl);
  res.send('Hello subscribe');
})





app.use('/greet', greet);

app.use('/subscribe', subscribe);



app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
