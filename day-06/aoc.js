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

const modelForDays = (days) => (numbers) => {
  let nums = numbers;
  //console.log("Initial State: ", numbers.join(','));
  for (let i = 0; i < days; ++i) {
    nums = generateNextSequence(nums);
    //console.log(`After ${i + 1} days: `, nums.join(','));
  }

  return nums.length;
};

const part1 = () => {
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
    for (let i = 0; i < days; ++i) {
      let newFish = 0;

      for (let fish = 0; fish < numbers.length; ++fish) {
        if (numbers[fish] === 0) {
          newFish += 1;
          numbers[fish] = 6;
        } else {

          numbers[fish] = numbers[fish] - 1;
        }
      }

      for (let nextFish = 0; nextFish < newFish; ++nextFish) {
        numbers.push(8);
      }
    }

    return numbers.length;
  };

  const calculate = pipe([
    parseRawInput,
    split(','),
    map(toInt),
    modelForDays(200)
  ]);

  const result = calculate(filename);

  console.log(`Part 2: "${result}"`);

};

part1();
part2();
