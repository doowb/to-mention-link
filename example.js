'use strict';

var toMention = require('./');
var input = '- @doowb\n- @jonschlinkert';

console.log('=== REPLACE WITH GITHUB URL ===');
console.log(toMention(input));
console.log();

console.log('=== REPLACE WITH TWITTER URL ===');
console.log(toMention(input, {url: 'https://twitter.com'}));
console.log();

console.log('=== USE HTML LINK RENDERER ===');
console.log(toMention(input, {renderer: 'html'}));
console.log();

console.log('=== USE CUSTOM TITLE ===');
console.log(toMention(input, {title: 'Assemble maintainers'}));
console.log();

console.log('=== USE CUSTOM TITLE FUNCTION===');
var users = {
  doowb: 'Brian Woodward',
  jonschlinkert: 'Jon Schlinkert'
};
console.log(toMention(input, {
  title: function(mention) {
    return users[mention];
  }
}));
console.log();
console.log(toMention(input, {
  renderer: 'html',
  title: function(mention) {
    return users[mention];
  }
}));
console.log();

