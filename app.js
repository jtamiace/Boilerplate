//dependencies for each module used

var express = require('express');
var dotenv = require('dotenv');
dotenv.load();
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var twit = require('twit');
var graph = require('fbgraph');
var passport = require('passport-facebook'); 

var Twit = require('twit');

var T = new Twit({
    consumer_key:         'WdTGIeFEg0AINc7EYFHqs079G'
  , consumer_secret:      'aG2ZZ87W8db3hLlqGLB1yCHQt0dxB7xZtWpTT6GGNyfzWvbl0o'
  , access_token:         '2444589391-cGMmKAKw6VDMz72koR1mtO88nYNvwVl2FDkCq4r'
  , access_token_secret:  '8Wyx0PSVMgZp28QeugvoTT4Gp1GE2c3LtWJINOzPk53iM'
});

//route files to load
var index = require('./routes/index');


//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.configure('production', function(){
  app.use(express.errorHandler());
});

graph.setAccessToken(access_token);
graph.setAppSecret(app_secret)



//routes
app.get('/', index.view);

app.get('/', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.post('/*', function(request, response) {
  response.redirect('/');
});



app.get('/auth/facebook', function(req, res) {
 
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });
    

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
       console.log("Access Granted");
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
     
      console.log("Access Denied");
      res.send('access denied');
    }
    return;
  }


  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
  	console.log("after auth :" + JSON.stringify(facebookRes))
  	console.log("access token set :" + graph.getAccessToken())
    res.redirect('http://localhost:3000');
  });



});



// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  res.render("http://localhost:3000", { title: "Logged In" });
});

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});