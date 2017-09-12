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

      if(status >= 200 && status <= 299) {
        const count = acc.hasOwnProperty(asset) ? acc[asset].count + 1 : 1  
        
        acc[asset] = {
          asset,
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