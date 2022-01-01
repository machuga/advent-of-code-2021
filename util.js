const { readFileSync } = require('fs');

module.exports.parseInput = (filename = 0) =>
  readFileSync(filename).toString().split('\n').filter(Boolean);

module.exports.parseRawInput = (filename = 0) =>
  readFileSync(filename).toString();

module.exports.toInt = (str) => parseInt(str, 10);

module.exports.split = (separator) => (str) => str.split(separator);

module.exports.join = (separator) => (str) => str.join(separator);

module.exports.pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x);

module.exports.flatMap = (fn) => (arr) => arr.flatMap(fn);

module.exports.map = (fn) => (arr) => arr.map(fn);

module.exports.filter = (fn) => (arr) => arr.filter(fn);

module.exports.reduce = (fn, initial = []) => (arr) => arr.reduce(fn, initial);

module.exports.find = (fn) => (arr) => arr.find(fn);

module.exports.sum = (arr) => arr.reduce((acc, e) => acc + e, 0);

module.exports.transpose = (array) => array[0].map((_, colIndex) => array.map(row => row[colIndex]));

module.exports.zip = (a, b) => a.map((k, i) => [k, b[i]]);

module.exports.sort = (arr) => arr.sort((a, b) => a < b ? -1 : 1);

module.exports.tap = (str) => (value) => {
  console.log(str, value);
  return value;
};
