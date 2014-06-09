"use strict";

var url = require('url'),
  pathToRegexp = require('path-to-regexp');

// Processing couchapp style rewrites
function rewrite(base, input, rewrites) {
  for (var i = 0; i < rewrites.length; i++) {
    var from = url.resolve('/', rewrites[i].from);
    var keys = [];
    var re = pathToRegexp(from, keys);
    var result = re.exec(input);
    if (result) {
      var toUrl = rewrites[i].to;
      var toQuery = rewrites[i].query;
      if (toUrl.substring(0, 1) == '/') {
        toUrl = toUrl.substring(1);
      }
      toUrl = url.resolve(base, toUrl);
      for (var i = 0; i < keys.length; i++) {
        toUrl = toUrl.replace(':' + keys[i].name, result[i+1]);
        for (var q in toQuery) {
          console.log(toQuery, q);
          toQuery[q] = JSON.parse(JSON.stringify(toQuery[q]).replace(':' + keys[i].name, result[i+1]));
        }
      }
      toUrl = toUrl.replace('*', result[result.length-1]);
      return {
        url: toUrl,
        query: toQuery
      };
    }
  }
  return null;
}

module.exports = rewrite;
