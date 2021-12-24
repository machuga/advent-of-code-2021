const { parseRawInput, toInt, split, pipe, map, reduce, } = require('../util');
const [filename = 0] = process.argv.slice(2);

const sort = (arr) => arr.sort((a, b) => a > b ? 1 : -1);
const avg = (arr) => Math.floor(arr.reduce((acc, e) => acc + e, 0) / arr.length);
const binomialCoefficient = (num) => Math.floor((num * (num + 1)) / 2)

const calculateTotalFuelConsumption = ({ target, group }) =>
  Object.keys(group)
    .map((position) => Math.abs(target - position) * group[position])
    .reduce((acc, e) => acc + e, 0);

const part1 = () => {
  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    sort,
    (list) => {
      const middle = list[(list.length / 2) - 1];
      const grouped = list.reduce((acc, e) => {
        if (!acc.hasOwnProperty(e)) {
          acc[e] = 0;
        }

        acc[e] += 1;

        return acc;
      }, {});

      return {
        target: middle,
        group: grouped,
      };
    },
    calculateTotalFuelConsumption,

  ]);

  const result = calculate(filename);

  console.log(`Part 1: "${result}"`);
};

const findTotalFor = (num) =>
  pipe([
    map((number) => binomialCoefficient(Math.abs(number - num))),
    reduce((acc, e) => acc + e, 0),
  ]);

const findLowestGasConsumption = (list) => {
  let lowestValue = avg(list);
  let lowestSum = findTotalFor(lowestValue)(list);
  let totalForLower = findTotalFor(lowestValue - 1)(list);
  let totalForHigher = findTotalFor(lowestValue + 1)(list);

  if (totalForLower < lowestSum) {
    while (totalForLower < lowestSum) {
      lowestValue = lowestValue - 1;
      lowestSum = totalForLower;
      totalForLower = findTotalFor(lowestValue - 1)(list);
    }
  }

  if (totalForHigher < lowestSum) {
    while (totalForHigher < lowestSum) {
      lowestValue = lowestValue - 1;
      lowestSum = totalForHigher;
      totalForHigher = findTotalFor(lowestValue - 1)(list);
    }
  }

  return lowestSum;
};

const part2 = () => {
  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    sort,
    findLowestGasConsumption,
  ]);

  const result = calculate(filename);

  console.log(`Part 2: "${result}"`);
};

part1();
part2();
