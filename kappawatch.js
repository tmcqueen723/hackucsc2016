/*
* HACK UCSC 2016
*
* Andrew Cousins
* Kenny Wong
* Travis McQueen
* Kevin Lee
*
* KappasPerMinute Server
*
* Checks Twitch for the top 5 channels,
* monitor their chat for a minute, counting the usage of the Kappa emote,
* Tweets the information
*
* Tweets have 15chars for each name, format is Name: 9999, Name: 9999, ...
* 
* Currently uses 5 preset channels, counts for two minutes, and then tweets out.
*/

// Get the lib
var irc = require("irc");
var Twit = require('twit');
var request = require('request');

//TWITCH
var URL = 'https://api.twitch.tv/kraken/streams/';
var channels = ["#lirik", "#forsenlol", "#twitch", "#sing_sing", "#paxarena"];
var config,
    bot;

update();
// request(URL, function(error, response, body) {
	// if (!error && response.statusCode == 200) {
		// var twitch = JSON.parse(body);
		// var n = 0;
		// while (n < 5) {
			// channels[n] = "#" + twitch.streams[n].channel.name;
			// console.log(twitch.streams[n].channel.name)
			// n++;
		// }
	// }
// })
config = {
	channels : channels,
	server : "irc.twitch.tv",
	botName : "justinfan123"
};

// Create the bot name
bot = new irc.Client(config.server, config.botName, {
	channels : config.channels
});

// TWITTER
var T = new Twit({
	//REMOVED KEYS/TOKENS FOR GITHUB
	consumer_key : '',
	consumer_secret : '',
	access_token : '',
	access_token_secret : ''
});

// T.post('statuses/update', { status: 'Kappa Kappa' }, function(err, data, response) {
// console.log("post: " + data + err + response)
// });

T.get('statuses/user_timeline.json?screen_name=KappasPerMinute&count=1', {}, function(err, data, response) {
	console.log("get: " + data[0].text)
});

// Listen for any message, say to him/her in the room
time = new Date().getTime();
console.log(time);
bot.addListener("message", function(from, to, text, message) {
	var message = message.args;
	//console.log(message[0]);
	if (message[1].indexOf("Kappa") > -1) {
		var n = 0;
		while (n < 5) {
			var k = 0;
			if (channels[n].indexOf(message[0]) > -1) {
				while (message[1].indexOf("Kappa") > -1) {
					k++;
					message[1] = message[1].substring(message[1].indexOf("Kappa") + 5);
				}
				kappas[n] += k;
				console.log("Found " + k + " kappa(s) on " + channels[n] + ", now they have " + kappas[n]);
			}
			n++;
		}
		//console.log("Found a Kappa!");
	}
	if (new Date().getTime() > (time + 120000)) {
		//tweet
		console.log("Oh man I gotta tweet this!");
		var status = "";
		var n = 0;
		while (n < 5) {
			var max = 15;
			if (channels[n].length < 15) {
				max = channels[n].length
			};
			status += channels[n].substring(1, max);
			status += ": ";
			status += kappas[n] / 2;
			if (n != 4) {
				status += ", ";
			}
			n++;
		}
		T.post('statuses/update', {
			status : status
		}, function(err, data, response) {
			console.log("pos	t: " + data + err + response)
		});
		update();
	}
});

function update() {
	console.log("Updating");
	kappas = [0, 0, 0, 0, 0];
	time = new Date().getTime();

}

