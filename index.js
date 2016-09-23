'use strict';

var extend = require('extend-shallow');
var mdlink = require('markdown-link');
var parse = require('parse-mentions');
var url = require('url');

var renderers = {
  md: mdlink,
  html: htmlLink
};

/**
 * Turn @ mentions in a string into links. Defaults to markdown links but allows html and custom link renders. See the [example](./example.js) for more details.
 *
 * ```js
 * // defaults to github urls
 * console.log(toMention('- @doowb\n- @jonschlinkert'));
 * //=> - [doowb](https://github.com/doowb)
 * //=> - [jonschlinkert](https://github.com/jonschlinkert)
 *
 * // use custom url
 * console.log(toMention('- @doowb\n- @jonschlinkert', {url: 'https://twitter.com'}));
 * //=> - [doowb](https://twitter.com/doowb)
 * //=> - [jonschlinkert](https://twitter.com/jonschlinkert)
 * ```
 * @param  {String} `str` Input string containing @ mentions.
 * @param  {Options} `options` Additional options to control url and link rendering.
 * @param  {String} `options.url` Specify the url to be used. Defaults to "https://github.com"
 * @param  {String|Function} `options.title` Specify the title to be used. May be a function that takes the parsed @ mention and returns a title string.
 * @param  {String|Function} `options.renderer` Specify the link renderer to use. Must be a rendered on the [renderers](#renderers) object. May be a function that takes the mention, url, and title to be rendered. Defaults to "md".
 * @return {String} Transformed string with @ mentions as links.
 * @api public
 */

function toMention(str, options) {
  var opts = extend({
    renderer: 'md',
    url: 'https://github.com'
  }, options);

  var title = function() { return; };
  var renderer = function(mention) {
    return mention;
  };

  if (typeof opts.title === 'string') {
    title = function() { return opts.title; };
  }

  if (typeof opts.title === 'function') {
    title = opts.title;
  }

  if (typeof opts.renderer === 'string') {
    if (!renderers.hasOwnProperty(opts.renderer)) {
      throw new Error(`expected "renderer" to be one of the following [${Object.keys(renderers).join(', ')}]`);
    }
    renderer = renderers[opts.renderer];
  }

  if (typeof opts.renderer === 'function') {
    renderer = opts.renderer;
  }

  return parse(str, function(mention) {
    return renderer(`@${mention}`, join(opts.url, mention), title(mention));
  });
}

/**
 * HTML Link renderered based on the logic from [markdown-link][]
 *
 * @param  {String} `mention` Mention string that will be seen as text.
 * @param  {String} `href` href to use for link
 * @param  {String} `title` optional title to use for alt attribute
 * @return {String} rendered html link
 */

function htmlLink(mention, href, title) {
  if (typeof mention !== 'string') {
    throw new TypeError('expected mention to be a string.');
  }
  if (typeof href !== 'string') {
    throw new TypeError('expected href to be a string.');
  }

  title = title ? ' alt="' + title + '"' : '';
  return `<a href="${href}"${title}>${mention}</a>`;
}

/**
 * Create a formated url using the given url prefix and mention string.
 * This is based on a snippet from @jonschlinkert
 *
 * @param  {String} `prefix` URL prefix to use.
 * @param  {String} `mention` Name to append to the URL prefix
 * @return {String} Formated url useful in link tags.
 */

function join(prefix, mention) {
  var obj = extend({}, url.parse(prefix), {pathname: mention});
  return url.format(obj);
}

/**
 * Exposes `toMention`
 */

module.exports = toMention;

/**
 * Exposes `.renderers` object.
 */

module.exports.renderers = renderers;
