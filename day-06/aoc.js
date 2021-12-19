const { parseRawInput, toInt, split, pipe, map, reduce, transpose, zip } = require('../util');
const [filename = 0, days = 80] = process.argv.slice(2);

const generateNextSequence = (numbers) => {
  let newFish = 0;

  return newNumbers = numbers.map(num => {
    if (num === 0) {
      newFish += 1;
      return 6;
    }

    return num - 1;
  }).concat(new Array(newFish).fill(8))
};

const part1 = () => {
  const modelForDays = (days) => (numbers) => {
    let nums = numbers;

    for (let i = 0; i < days; ++i) {
      nums = generateNextSequence(nums);
    }

    return nums.length;
  };

  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    modelForDays(days)
  ]);

  const result = calculate(filename);

  console.log(`Part 1: "${result}"`);
};

const part2 = () => {
  const modelForDays = (days) => (numbers) => {
    const breedingPeriod = 9;
    const breedingDays = new Array(breedingPeriod).fill(0);

    numbers.forEach((num) => {
      breedingDays[num] += 1;
    });

    for (let day = 0; day < days; ++day) {
      const today = day % breedingPeriod;

      breedingDays[(today + 7) % breedingPeriod] += breedingDays[today];
    }

    return breedingDays.reduce((acc, day) => acc + day, 0);
  };

  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    modelForDays(256)
  ]);

  const result = calculate(filename);

  console.log(`Part 2: "${result}"`);

};

part1();
part2();
