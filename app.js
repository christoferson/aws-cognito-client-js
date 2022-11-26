const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const mymodule = require('./modules/mymodule');
const mycognito = require('./modules/mycognito');


const app = express();
const port = process.env.PORT || 3000;

app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!' + mymodule.myDateTime());
})

app.get('/cognito/login', function(req, res) {
  res.sendFile(path.join(__dirname+'/html/login.html'));
});

app.post('/cognito/login', function(req, res) {
  console.log(req.body.uname);
  const data = {
    "Name": req.body.uname,
    "Password": req.body.upwd
  }
    res.send('Got Parameters!' + mymodule.myDateTime() + " " + JSON.stringify(data));
});

app.get('/cognito', function(req, res) {
    res.send('Hello World!' + mycognito.cognitoSignIn());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});