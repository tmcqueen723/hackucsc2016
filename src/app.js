/**
 * Filename: app.js
 * Developers:
 * Date: 1/29/2016
 * Description: An implementation of Twitch.tv on the Pebble Watch created for the
 *              UCSC 2016 Hackathon.
 */

var UI = require('ui');
var ajax = require('ajax');

// Construct URL
//var channelName = 'twitch';
var URL = 'https://api.twitch.tv/kraken/streams/';
//var URLCHAT = 'https://www.dropbox.com/s/fpqsz9nccjkq3l0/chat.json?raw=1';
//var URLCHAT = 'https://www.dropbox.com/s/fpqsz9nccjkq3l0/chat.json?dl=1';
//var URLCHAT = 'https://dl.dropboxusercontent.com/content_link/ZN5HEHpI6QoVuif0FyEb8Fd5lGVUMq5vv96fnaUaORtE1gFpw6QFjsp5daQ0CZV5/file/';
var URLCHAT = 'http://pastebin.com/raw/4hhNRKCq';
//var URLCHAT = 'http://localhost:8080/chat.json';
//counter for top streams
var top = 0;

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Twitch Channels',
  body:'Fetching...'
});

//call the thing
display();

//On top button press, previous card.
card.on('click', 'up', function() {
        console.log("clicked down");
        top--;
        if(top < 0){top = 24;}
        display();
        });
    
//On middle button press, return to base.
card.on('click', 'select', function() {
  console.log("click select");
  chatDisplay();
});
/*card.on('click', 'select', function() {
        console.log("clicked select");
        top = 0;
        display();
        });*/

//On bottom button press, next card
card.on('click', 'down', function() {
        console.log("clicked down");
        top++;
        if (top > 24) {top = 0;}
        display();
        });

function chatDisplay(){
  console.log("Running Display for chat");
  ajax(
    {
      url: URLCHAT,
      type: 'json'
    },
  function(data) {
    // Success!
    console.log('Successfully fetched twitch chat!');
    //update the info
    card.title(data.user);
    card.body(data.text);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching twitch chat:' + error);
    card.subtitle('We failed chat:(');
  }
  );
  // Display the Card
  card.show();
  }
  
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
    //card.subtitle(data.streams[top].game + '\nViewers: ' + data.streams[top].viewers);
    card.body(data.streams[top].game + '\nViewers: ' + data.streams[top].viewers);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching twitch data: ' + error);
    card.subtitle('We didnt twitch :(');
  }
  );
  // Display the Card
  card.show();
}
