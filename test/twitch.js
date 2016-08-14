var glob = require('glob');
var assert = require('assert');
var fs = require('fs');

describe('twitch', function () {

  it('should have over 9000 files', function (done) {
    glob('build/twitch/*.json', function (err, files) {
      assert.ok(files.length > 9000);
      done();
    });
  });

  it('should have global.json and have Kappa in it', function (done) {
    var fpath = 'build/twitch/global.json';
    glob(fpath, function (err, files) {
      assert.ok(files.length === 1);
      fs.readFile(fpath, function (err, file) {
        assert.ok(file.includes('Kappa'));
        done();
      });
    });
  });

  it('should have betterttv.json and have over 90 emotes in it', function (done) {
    var fpath = 'build/twitch/betterttv.json';
    glob(fpath, function (err, files) {
      assert.ok(files.length === 1);
      fs.readFile(fpath, function (err2, file) {
        try {
          var json = JSON.parse(file);
          assert.ok(json.icons.length > 90);
          done();
        } catch (e) {
          throw e;
        }
      });
    });
  });

});
