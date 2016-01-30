/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

// Construct URL
var channelName = 'twitch';
var URL = 'http://www.twitch.tv/' + channelName + '/chat?popout=';

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Twitch Chat',
  subtitle:'Fetching...'
});

// Make the request
ajax(
  {
    url: URL,
    type: 'html'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched twitch data!');
    card.subtitle('We did it!');
  },
  function(error) {
    // Failure!
    console.log('Failed fetching twitch data: ' + error);
    card.subtitle('We didnt do it :(');
  }
);


// Display the Card
card.show();