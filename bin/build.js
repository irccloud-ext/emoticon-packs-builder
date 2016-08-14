/*jslint node: true */

'use strict';

var destFolder = '';
if (process.argv[2] == null) {
  console.log('Directory path must be provided.');
  process.exit(1);
} else {
  destFolder = process.argv[2];
}

var needle = require('needle');
var path = require('path');
var fs = require('graceful-fs')
var q = require('q');
var writeFile = q.nfbind(fs.writeFile);
var mkdirp = q.nfbind(require('mkdirp'));

var apiUrl = {
  global: 'https://twitchemotes.com/api_cache/v2/global.json',
  subscriber: 'https://twitchemotes.com/api_cache/v2/subscriber.json',
  betterttv: 'https://api.betterttv.net/2/emotes'
};

function download(url, callback) {
  var deferred = q.defer();
  needle.get(url, function (error, response) {
    if (!error && response.statusCode === 200) {
      deferred.resolve(response);
    } else {
      deferred.reject(error);
    }
  });
  return deferred.promise;
}

const parserPath = path.join(__dirname, '../lib/parser/');

function parse (parser, data) {
  parser = parser.replace(/\//g, '-');
  return require(path.join(parserPath, parser))(data);
}

function save (filename, data, pretty = false) {
  var dir = path.dirname(filename);
  return mkdirp(dir).then(function () {
    var jsonArgs = [data];
    if (pretty) jsonArgs = jsonArgs.concat([null, 2]);
    return writeFile(filename, JSON.stringify.apply(JSON, jsonArgs));
  });
}

var emotesLoaded = {};

q.all([
  download(apiUrl.global),
  download(apiUrl.subscriber),
  download(apiUrl.betterttv)
]).then(function (res) {
  emotesLoaded['twitch/global'] =  res[0].body;
  emotesLoaded['twitch/sub'] =  res[1].body;
  emotesLoaded['twitch/betterttv'] =  res[2].body;
}).then(function () {
  return Object.keys(emotesLoaded).forEach(function (key) {
    emotesLoaded[key] = parse(key, emotesLoaded[key]);

    // special for sub emotes
    if (key === 'twitch/sub') {
      Object.keys(emotesLoaded[key]).forEach(function (subKey) {
        emotesLoaded[`twitch/${subKey}`] = emotesLoaded[key][subKey];
      });
      delete emotesLoaded[key];
    }
  });
}).then(function () {
  return mkdirp(destFolder);
})
.then(function () {
  var saves = [];
  Object.keys(emotesLoaded).forEach(function (key) {
    saves.push(save(`${destFolder}${key}.json`, emotesLoaded[key]));
  });
  return q.all(saves);
}).then(function () {
  console.log('Emotes saved to:', destFolder);
}).fail(function (err) {
  console.log('Error:', err);
});
