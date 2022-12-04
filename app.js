const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const mymodule = require('./modules/mymodule');
const mycognito = require('./modules/mycognito');
const mycognito2 = require('./modules/mycognito2');
const mycognito3 = require('./modules/mycognito3');


const app = express();
const port = process.env.PORT || 3000;


// Initialization
app.use(cookieParser());

app.use(session({
  name: "democognito",
  secret: "k034803248209SW",
  saveUninitialized: true,
  resave: true,
  //cookie: { secure: true }
}));

app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!' + mymodule.myDateTime());
})

app.get('/cognito/login', function(req, res) {
  res.sendFile(path.join(__dirname+'/html/login.html'));
});
/*
app.post('/cognito/login', function(req, res) {
  console.log(req.body.uname);
  const data = {
    "Name": req.body.uname,
    "Password": req.body.upwd
  }
    //let cresult = mycognito2.cognitoSignIn(req.body.uname, req.body.upwd);
   // let cresult = mycognito3.cognitoSignIn(req.body.uname, req.body.upwd);
    let cresult = {};
    mycognito3.asyncCognitoSignIn(req.body.uname, req.body.upwd, (result => {
      //console.log(">>> " + result.IdToken);
      req.session.token = result.IdToken;
      console.log("SessionToken: " + req.session.token);
    }));
    data.Auth = cresult;
    res.send('Got Parameters!' + mymodule.myDateTime() + " " + JSON.stringify(data));
});
*/
app.post('/cognito/login', async function(req, res) {
  console.log(req.body.uname);
  const data = {
    "Name": req.body.uname,
    "Password": req.body.upwd
  }
    //let cresult = mycognito2.cognitoSignIn(req.body.uname, req.body.upwd);
   // let cresult = mycognito3.cognitoSignIn(req.body.uname, req.body.upwd);
    let cresult = {};
    cresult = await mycognito3.asyncCognitoSignIn(req.body.uname, req.body.upwd, (result => {
      //console.log(">>> " + result.IdToken);
      req.session.token = result.IdToken;
      console.log("SessionToken: " + req.session.token);
    }));
    req.session.token = cresult.IdToken;
    data.Auth = cresult;
    res.send('Got Parameters!' + mymodule.myDateTime() + " " + JSON.stringify(data));
});

app.get('/cognito/info', function(req, res) {

  let data = {
    "Path": '/cognito/info! ',
    "Bar": "Bar",
    "Foo": req.session.foo,
    "IdToken": req.session.token
  };

  res.send(JSON.stringify(data));
});

app.get('/cognito', function(req, res) {
    //res.send('Hello World!' + mycognito.cognitoSignIn());
    req.session.foo = "bar";
    res.send('Hello World!' + req.session.foo);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});