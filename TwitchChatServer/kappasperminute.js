/*
* HACK UCSC 2016
*
* Andrew Cousins
* Kenny Wong
* Travis McQueen
* Kevin Lee
*
* KappasPerMinute Server
* Uses Node.js
*
* Checks Twitch for the top 5 channels,
* monitor their chat for a minute, counting the usage of the Kappa emote,
* Tweets the information
*
* Tweets have 13chars for each name, format is Name: 9999, Name: 9999, ...
*/

// Libraries
var irc = require("irc");
var Twit = require('twit');
var request = require('request');

//Twitch info
var URL = 'https://api.twitch.tv/kraken/streams/';
var numChannels = 25;
//Top channels to read from, max 25
var nameLength = 13;
//consider tweet lengths
var minutes = 5;
var emote = "Kappa";
var channels = [];
var reading = false;
var config,
    bot;

//Twitter info
var T = new Twit({
	consumer_key : '',
	consumer_secret : '',
	access_token : '',
	access_token_secret : ''
});

//setup the twitch bot

//configure the bot
config = {
	channels : channels,
	server : "irc.twitch.tv",
	botName : "justinfan123"
};

// Create the bot
bot = new irc.Client(config.server, config.botName, {
	channels : config.channels
});

console.log("Staring up KappasPerMinute.");
console.log("Finding emote " + emote);
console.log("Checking " + numChannels + " of the top channels");
console.log("Waiting " + minutes + " minutes between tweets");

//start it up
start();

//Starts the timer
function start() {
	console.log("Starting!");
	kappas = [];
	console.log("Getting top channels from twitch...");
	request(URL, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var twitch = JSON.parse(body);
			//console.log(twitch);
			var n = 0;
			while (n < numChannels) {
				channels[n] = "#" + twitch.streams[n].channel.name;
				kappas[n] = 0;
				n++;
			}

			console.log("I found some good channels! " + channels);
			runBot();
		} else {
			console.log("Something went wrong :(");
		}
	})
}

//Runs the twitch bot
function runBot() {
	console.log("Its go time!  Starting the IRC bot.");

	reading = true;

	console.log("Joining Channels");
	var c;
	for ( c = 0; c < channels.length; c++) {
		bot.join(channels[c], {});
	}
	//record the time
	time = new Date().getTime();

	//Add the bot listner that looks for Kappas
	bot.addListener("message", function(from, to, text, message) {
		if(!reading){
			return;
		}
		var message = message.args;
		//A way to debug
		//console.log(message[0]);
		if (message[1].indexOf(emote) > -1) {
			var n = 0;
			while (n < numChannels) {
				var k = 0;
				if (channels[n].indexOf(message[0]) > -1) {
					while (message[1].indexOf(emote) > -1) {
						k++;
						message[1] = message[1].substring(message[1].indexOf(emote) + 5);
					}
					kappas[n] += k;
					console.log("Found " + k + " " + emote + "(s) on " + channels[n] + ", now they have " + kappas[n]);
				}
				n++;
			}
			if (new Date().getTime() > (time + (60000 * minutes))) {
				console.log("Leaving channels");
				reading = false;
				var c;
				for ( c = 0; c < channels.length; c++) {
					bot.part(channels[c], "", {});
				}
				sendTweet();
			}
		}
	})
}

//sends out the tweet
function sendTweet() {
	//find the total Kappas
	var total = 0;
	var count;
	for(count = 0; count < kappas.length; count++){
		total += kappas[count];
	}
	console.log("Total Kappas: " + total);
	
	//Find the 5 highest Kappas
	console.log("Finding the highest Kappa Counts from:");
	console.log(kappas + "\n" + channels);
	var highestK = [0, 0, 0, 0, 0];
	//Kappa Counts
	var highestC = [];
	//Channel Names
	var c;
	//iterate through all kappa counts
	for ( c = 0; c < channels.length; c++) {
		if (highestK.length < 5) {
			highestC[highestK.length] = channels[c];
			highestK[highestK.length] = kappas[c];
			highestK,
			highestC = bubble(highestK, highestC);
		}
		else{
			if(kappas[c] > highestK[4]){
				highestC[4] = channels[c];
				highestK[4] = kappas[c];
				highestK,
				highestC = bubble(highestK, highestC);
			}
		}
	}
	console.log("The highest kappa counts were " + highestK);
	console.log("From the channels " + highestC);
	//tweet
	console.log("Time to tweet out my results!");
	//Write the tweet status
	var status = "";
	var n = 0;
	while (n < 5) {
		//Reduce the channel's name down
		var max = nameLength;
		if (highestC[n].length < 15) {
			max = highestC[n].length
		};
		//add into the status the channel's name and number of Kappas
		status += highestC[n].substring(1, max);
		status += ": ";
		status += highestK[n] / minutes;
		if (n != 4) {
			//add commas between names
			status += ", ";
		}
		n++;
	}
	//Send the tweet
	console.log("I'm sending out a tweet that says: " + status);
	T.post('statuses/update', {
		status : status
	}, function(err, data, response) {
		console.log("post: " + data + err + response)
	});

	//restart
	start();
}

//bubbles up the top 5
function bubble(hk, hc) {
	console.log("Bubble...");
	var c = hk.length;
	while (c > 0) {
		if (hk[c] > hk[c - 1]) {
			var tempk = hk[c];
			var tempc = hc[c];
			hk[c] = hk[c - 1];
			hc[c] = hc[c - 1];
			hk[c - 1] = tempk;
			hc[c - 1] = tempc;
		}
		c--;
	}
	return hk, hc;
}
