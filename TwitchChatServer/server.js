var config = {
	channels: ["#twitch", "#summit1g"],
	server: "irc.twitch.tv",
	botName: "justinfan123"
};

// Get the lib
var irc = require("irc");
var fs = require('fs');

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen for any message, say to him/her in the room
bot.addListener('message', function (from, to, text) {
    console.log('\nf:   %s \nt:   %s \ntxt: %s', from, to, text);
    //JSON.stringify(text);
    text = '{ "user": "' + from + '", "text": "' + text + '" }\n'
    var filename = 'chat.json';
    fs.open(filename, 'w', (err) => {
        if (err) throw err;
        //console.log("Opened: " + filename);
    });
    fs.writeFile(filename, text, (err) => {
        if (err) throw err;
        //console.log('It\'s saved!');
    });
});
