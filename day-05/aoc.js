const { parseInput, toInt, split, pipe, map, reduce, transpose, zip } = require('../util');
const [filename = 0] = process.argv.slice(2);

const drawMap = (hits = {}) => (coords) => {
  const [maxX, maxY] = coords.reduce(([maxX, maxY], [[fromX, fromY], [toX,toY]]) => [
    Math.max(fromY, toX, maxX),
    Math.max(fromX, toY, maxY),
  ], [0, 0]).map(val => val+1);

  const map = new Array(maxY).fill('').map((row, rowIndex) =>
    new Array(maxX).fill('.').map((col, colIndex) =>
      getNode(hits, [colIndex, rowIndex])
    ).join('')
  ).join('\n');

  console.log(`Map: "\n${map}"`);

  return coords;
};

const lineToCoords = 
  pipe([
    split(' -> '),
    map(pipe([
      split(','),
      map(toInt),
    ])),
  ]);


const getKey = ([x,y]) => `${x},${y}`;
const getNode = (hits, [x,y]) => hits[getKey([x,y])] || '.';
const incrementNode = (map, key) => {
  if (!map[key]) {
    map[key] = 0;
  }

  map[key] += 1;

  return;
};

const nextNum = (start, end, current) => {
  if (current === end) {
    return current;
  }

  if (start >= end) {
    return current - 1;
  }

  return current + 1;
};

const getDangerCount = (hits) => Object.keys(hits).filter(index => hits[index] >= 2).length;

const converge = ([[startX, startY], [endX, endY]], onNode, ignoreDiagonals = false) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.max(Math.abs(deltaX), Math.abs(deltaY)) + 1;

  if (ignoreDiagonals && deltaY !== 0 && deltaX !== 0) {
    return;
  }

  let nextX = startX;
  let nextY = startY;

  onNode([nextX, nextY])
  while(nextX !== endX || nextY !== endY) {
    nextX = nextNum(startX, endX, nextX);
    nextY = nextNum(startY, endY, nextY);

    onNode([nextX, nextY])
  }

  return [];
};

// How to get from 0,9 to 5,9
const part1 = () => {
  const hits = {};
  const calculate = pipe([
    parseInput,
    map(lineToCoords),
    map((coordPair) => {
      converge(coordPair, (coords) => {
        incrementNode(hits, getKey(coords));
      }, true);
      return coordPair;
    }),
  ]);

  const result = calculate(filename);

  console.log(`Part 1: "\n${getDangerCount(hits)}"`);
};

const part2 = () => {
  const hits = {};
  const calculate = pipe([
    parseInput,
    map(lineToCoords),
    map((coordPair) => {
      converge(coordPair, (coords) => {
        incrementNode(hits, getKey(coords));
      });
      return coordPair;
    }),
  ]);

  const result = calculate(filename); 

  console.log(`Part 2: "\n${getDangerCount(hits)}"`);
};

part1();
part2();
