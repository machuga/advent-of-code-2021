const { readFileSync } = require('fs');

module.exports.parseInput = (filename = 0) =>
  readFileSync(filename).toString().split('\n').filter(Boolean);

module.exports.pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x);

module.exports.map = (fn) => (arr) => arr.map(fn);

module.exports.reduce = (fn, initial = []) => (arr) => arr.reduce(fn, initial);
