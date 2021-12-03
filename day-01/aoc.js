const { parseInput } = require('../util');
const [filename = 0] = process.argv.slice(2);
const inputList = parseInput(filename).map(num => parseInt(num, 10));
const BUFFER_SIZE = 3;

const part1 = () => {
  const count = inputList.reduce((acc, e, index) => {
    if (index === 0 || e <= inputList[index - 1]) {
      return acc;
    }

    return acc + 1;
  }, 0);


  console.log(`Part 1: Count is "${count}"`);
};

const part2 = () => {
  const addToRing = (buffer, number) => {
    if (buffer.length >= BUFFER_SIZE) {
      return [...buffer.slice(1), number];
    }

    return [...buffer, number];
  };

  const sumBuffer = (buffer) => buffer.reduce((acc, e) => acc + e, 0);

  const result = inputList.reduce((state, e, index) => {
    if (state.buffer.length < BUFFER_SIZE) {
      const buffer = addToRing(state.buffer, e);

      return {
        buffer,
        count: state.count,
        sum: (buffer.length === BUFFER_SIZE) ? sumBuffer(buffer) : undefined,
      };
    }

    const buffer = addToRing(state.buffer, e);
    const sum = sumBuffer(buffer);
    const count = sum > state.sum ? state.count + 1 : state.count;

    return { buffer, sum, count };
  }, { buffer: [], count: 0, sum: undefined });


  console.log(`Part 2: Count is "${result.count}"`);

};


part1();
part2();
