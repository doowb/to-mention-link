'use strict';

require('mocha');
var assert = require('assert');
var toMention = require('./');

var input = '- @doowb\n- @jonschlinkert';

describe('to-mention-link', function() {
  it('should export a function', function() {
    assert.equal(typeof toMention, 'function');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      toMention();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      cb();
    }
  });

  it('should return a string with mention links', function() {
    var expected = '- [@doowb](https://github.com/doowb)\n- [@jonschlinkert](https://github.com/jonschlinkert)';
    assert.equal(toMention(input), expected);
  });

  it('should return a string with mention links with a custom url', function() {
    var expected = '- [@doowb](https://twitter.com/doowb)\n- [@jonschlinkert](https://twitter.com/jonschlinkert)';
    assert.equal(toMention(input, {url: 'https://twitter.com'}), expected);
  });

  it('should return a string with mention links with a custom renderer', function() {
    var html = '<ul>\n  <li>\n    @doowb\n  </li>\n  <li>\n    @jonschlinkert\n  </li>\n</ul>';
    var expected = '<ul>\n  <li>\n    <a href="https://github.com/doowb">@doowb</a>\n  </li>\n  <li>\n    <a href="https://github.com/jonschlinkert">@jonschlinkert</a>\n  </li>\n</ul>';
    assert.equal(toMention(html, {renderer: 'html'}), expected);
  });

  it('should return a string with mention links with a custom title', function() {
    var expected = '- [@doowb](https://github.com/doowb "Assemble maintainers")\n- [@jonschlinkert](https://github.com/jonschlinkert "Assemble maintainers")';
    assert.equal(toMention(input, {title: 'Assemble maintainers'}), expected);
  });

  it('should return a string with mention links with a custom title function', function() {
    var users = {
      doowb: 'Brian Woodward',
      jonschlinkert: 'Jon Schlinkert'
    };
    var expected = '- [@doowb](https://github.com/doowb "Brian Woodward")\n- [@jonschlinkert](https://github.com/jonschlinkert "Jon Schlinkert")';
    assert.equal(toMention(input, {title: function(mention) {
      return users[mention];
    }}), expected);
  });
});
