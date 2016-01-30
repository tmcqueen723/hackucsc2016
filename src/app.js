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

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Twitch Channels',
  subtitle:'Fetching...'
});

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
    card.title(data.streams[0].channel.name)
    //card.subtitle(data.streams[0].channel.logo);
    
  },
  function(error) {
    // Failure!
    console.log('Failed fetching twitch data: ' + error);
    card.subtitle('We didnt do it :(');
  }
);


// Display the Card
card.show();