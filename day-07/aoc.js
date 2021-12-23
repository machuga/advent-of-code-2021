const { parseRawInput, toInt, split, pipe, map, reduce, transpose, zip } = require('../util');
const [filename = 0] = process.argv.slice(2);

// 16,1,2,0,4,2,7,1,2,14
// 0,1,1,2,2,2,4,7,14,16
const sort = (arr) => arr.sort((a, b) => a > b ? 1 : -1);
const avg = (arr) => arr.reduce((acc, e) => acc + e, 0) / arr.length;

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
      const average = avg(list);
      const middle = list[(list.length / 2) - 1];
      const min = list[0];
      const max = list[list.length - 1]
      const grouped = list.reduce((acc, e) => {
        if (!acc.hasOwnProperty(e)) {
          acc[e] = 0;
        }

        acc[e] += 1;

        return acc;
      }, {});

      console.log("average:", average);
      console.log("middle:", middle);
      console.log("min:", min);
      console.log("max:", max);
      //console.log("grouped:", grouped);

      //console.log("Coverage ", middle, grouped);
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

const part2 = () => {
  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    sort,
  ]);

  const result = calculate(filename);

  //console.log(`Part 2: "${result}"`);

};

part1();
part2();
