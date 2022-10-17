const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

const mymodule = require('./modules/mymodule');
const mycognito = require('./modules/mycognito');


const app = express();
const port = process.env.PORT || 3000;

app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.get('/', (req, res) => {
  res.send('Hello World!' + mymodule.myDateTime());
})

app.get('/cognito', function(req, res) {
    res.send('Hello World!' + mycognito.cognitoSignIn());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});