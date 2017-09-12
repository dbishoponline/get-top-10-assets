"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.getTop10 = exports.getCountsObject = undefined;

var _data = require("./data");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-register");
require("babel-polyfill");

var getCountsObject = exports.getCountsObject = function getCountsObject(logs) {
  return logs.split('\n').sort().reduce(function (acc, i) {
    var arr = i.split(" ");
    var asset = arr[3];
    var status = parseInt(arr[5]);
    var requestType = arr[2].substring(1); // removes first character

    if (status >= 200 && status <= 299 && requestType == "GET") {
      var count = acc.hasOwnProperty(asset) ? acc[asset].count + 1 : 1;

      acc[asset] = {
        asset: asset,
        requestType: requestType,
        status: status,
        bytes: parseInt(arr[6]),
        count: count,
        totalBytes: parseInt(arr[6]) * count
      };
    }
    return acc;
  }, []);
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