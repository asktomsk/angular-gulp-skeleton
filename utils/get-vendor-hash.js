'use strict';

var fs              = require('fs');
var md5             = require('md5');

module.exports = function (vendorsPaths) {
  var hashes = [];
  vendorsPaths.forEach(function (path) {
    var hash = md5(fs.readFileSync(path, { encoding: 'utf8' }));
    hashes.push(hash);
  });

  var resultHash = md5(hashes.join(''));

  return resultHash;
};