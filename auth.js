//load environment variables
var dotenv = require('dotenv');
dotenv.load();


/**
* Add your authentication apis here with example like the bottom
*/
/**
//add instagram api setup
var ig = require('instagram-node-lib');
ig.set('client_id', process.env.instagram_client_id);
ig.set('client_secret', process.env.instagram_client_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;
**/

var conf = {
	client_id: '616452641773191'
	, client_secret: 'ef64c9bd218a24b5bd83cf67bcb39bd3'
	, scope: 'read_stream'
	, redirect_uri: 'http://fierce-eyrie-2881.herokuapp.com/'
	};

/**
* Add your authentication apis here with example like the bottom
*/

//Add Facebook API Setup
var graph = require('fbgraph');



//Facebook authentication using Oauth
var authUrl = graph.getOauthUrl({
	"client_id": process.env.facebook_app_id
	, "client_secret": process.env.facebook_app_secret 
	, "redirect_uri": process.env.redirect_uri //change this to heroku website later in .env
});

res.redirect(authUrl);

graph.authorize({
	"client_id": process.env.facebook_app_id
	, "redirect_uri": process.env.redirect_uri
	, "client_secret": process.env.facebook_app_secret
	, "code": req.query.code
}, function(err, facebookRes) {
	res.redirect('/loggedIn');
});