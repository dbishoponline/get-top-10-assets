"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.getTop10 = exports.reduceLogs = exports.getCountsObject = undefined;

var _data = require("./data");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Write a script that, given a web server log file, returns the 10 most frequently 
// requested objects and their cumulative bytes transferred. Only include GET requests 
// with Successful (HTTP 2xx) responses. Resolve ties however you’d like.

// Log format:
// - request date, time, and time zone
// - request line from the client
// - HTTP status code returned to the client
// - size (in bytes) of the returned object

// Given this input data:
// ```
// [01/Aug/1995:00:54:59 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511
// [01/Aug/1995:00:55:04 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 200 3635
// [01/Aug/1995:00:55:06 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 403 298
// [01/Aug/1995:00:55:09 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 200 3635
// [01/Aug/1995:00:55:18 -0400] "GET /images/opf-logo.gif HTTP/1.0" 200 32511
// [01/Aug/1995:00:56:52 -0400] "GET /images/ksclogosmall.gif HTTP/1.0" 200 3635```

// The result should be:
// ```
// /images/ksclogosmall.gif 10905
// /images/opf-logo.gif 65022
// ```

// (You may tweak the output format as you'd like)

require("babel-register");
require("babel-polyfill");

var getCountsObject = exports.getCountsObject = function getCountsObject(logs) {
  return logs.split('\n').sort().reduce(reduceLogs, []);
};

var reduceLogs = exports.reduceLogs = function reduceLogs(acc, i) {
  var arr = i.split(" ");
  var asset = arr[3];
  var status = parseInt(arr[5]);
  var requestType = arr[2].substring(1);
  var bytes = parseInt(arr[6]);

  if (status >= 200 && status <= 299 && requestType == "GET") {
    var count = acc.hasOwnProperty(asset) ? acc[asset].count + 1 : 1;
    var totalBytes = parseInt(arr[6]) * count;

    acc[asset] = {
      asset: asset,
      requestType: requestType,
      status: status,
      bytes: bytes,
      count: count,
      totalBytes: totalBytes
    };
  }
  return acc;
};

var getTop10 = exports.getTop10 = function getTop10(obj) {
  return Object.entries(obj).sort(compareCounts).reverse().slice(0, 10);
};

var compareCounts = function compareCounts(a, b) {
  if (a[1].count < b[1].count) return -1;
  if (a[1].count > b[1].count) return 1;
  return 0;
};

var log = exports.log = function log(arr) {
  return arr.map(function (i) {
    return console.log(i[0], ' ', i[1].totalBytes);
  });
};

log(getTop10(getCountsObject(_data2.default)));