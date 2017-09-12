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

require("babel-register")
require("babel-polyfill")

import data from './data'

export const getCountsObject = (logs) =>
  logs
    .split('\n')
    .sort()
    .reduce((acc, i) => {
      const arr = i.split(" ")
      const asset = arr[3]
      const status = parseInt(arr[5])
      const requestType = arr[2].substring(1) // removes first character

      if(status >= 200 && status <= 299 && requestType == `GET`) {
        const count = acc.hasOwnProperty(asset) ? acc[asset].count + 1 : 1  
        
        acc[asset] = {
          asset,
          requestType,
          status,
          bytes: parseInt(arr[6]),
          count,
          totalBytes:  parseInt(arr[6]) * count,
        }
      }
      return acc
    }, [])

export const getTop10 = (obj) =>
  Object.entries(obj)
    .sort(compareCounts)
    .reverse()
    .slice(0, 10)

const compareCounts = (a,b) => {
  if (a[1].count < b[1].count)
    return -1
  if (a[1].count > b[1].count)
    return 1
  return 0
}

export const log = (arr) =>
  arr.map((i) => console.log(i[0], ' ', i[1].totalBytes))

log(getTop10(getCountsObject(data)))