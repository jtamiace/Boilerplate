//dependencies for each module used
var auth = require('./auth.js');
var express = require('express');
var dotenv = require('dotenv');
dotenv.load();
var http = require('http');
var likes = require('./routes/likes');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var twit = require('twit');
var graph = require('fbgraph');

var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.twitter_app_id
  , consumer_secret:      process.env.twitter_app_secret
  , access_token:         process.env.twitter_access_token
  , access_token_secret:  process.env.twitter_access_token_secret
});

//route files to load
var index = require('./routes/index');

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



//routes

//GETS
app.get('/', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.get('/auth/facebook', function(req, res) {
 
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     process.env.facebook_app_id
      , "redirect_uri":  process.env.redirect_uri
      , "scope":         process.env.scope
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
      "client_id":      process.env.facebook_app_id
    , "redirect_uri":   process.env.redirect_uri
    , "client_secret":  process.env.facebook_app_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
  	console.log("after auth :" + JSON.stringify(facebookRes))
  	console.log("access token set :" + graph.getAccessToken())
    res.redirect('http://localhost:3000/me/likes');
  });

  
});

app.get('/me/likes', function(req,response){ 
  // get the likes that the user has
graph.get('/me/likes', function(err, res) {
  fblikes = { likes: res };
  console.log(fblikes);
  response.render('index', fblikes);
 
})

});


var stream = T.stream('statuses/filter', { track: 'lol' })

stream.on('tweet', function (tweet) {
  console.log(tweet);
})


//export graph to be used as parameter by other methods
exports.graph = graph;


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  res.render("http://localhost:3000/", { title: "Logged In" });
});

//POSTS
app.post('/*', function(request, response) {
  response.redirect('/');
});

app.post('/likes', function(req, res) {
  console.log('likes');
})


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});