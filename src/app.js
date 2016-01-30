/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

// Construct URL
//var channelName = 'twitch';
var URL = 'https://api.twitch.tv/kraken/streams/';

//counter for top streams
var top = 0;

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Twitch Channels',
  subtitle:'Fetching...'
});

//call the thing
display();


card.on('click', 'down', function() {
        console.log("clicked down");
        top++;
        if(top > 24){top = 0};
        display();
        });

card.on('click', 'up', function() {
        console.log("clicked down");
        top--;
        if(top < 0){top = 24};
        display();
        });
    
//This calls twitch and displays the channel at the 'top'
//displays rank, name, game, and viewers
function display(){
  console.log("Running Display for " + top);
  // Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched twitch data!');
    //update the info
    card.title((top + 1) + ". " + data.streams[top].channel.name);
    card.subtitle(data.streams[top].game + '\nViewers: ' + data.streams[top].viewers);
    
  },
  function(error) {
    // Failure!
    console.log('Failed fetching twitch data: ' + error);
    card.subtitle('We didnt do it :(');
  }
  );
  // Display the Card
  card.show();
}
