const { parseInput, toInt, tap, split, join, pipe, map, reduce, flatMap, filter, sort, find } = require('../util');
const [filename = 0] = process.argv.slice(2);

// Simple digits => 1, 4, 7, 8
const simpleCounts = [2, 4, 3, 7]

const parseSignals = pipe([
  map(pipe([
    split('|'),
    map((segment) => segment.trim().split(' '))
  ]))
]);

const part1 = () => {
  const calculate = pipe([
    parseInput,
    parseSignals,
    flatMap(([_, outputValues]) => outputValues),
    filter((value) => simpleCounts.includes(value.length)),
    (entries) => entries.length,
  ]);

  const result = calculate(filename);

  console.log(`Part 1: "${result}"`);
};

const signalByLength = new Map([
  [2, 1],
  [3, 7],
  [4, 4],
  [7, 8],
]);

const validGroups = [
  [0, 1, 2, 4, 5, 6], // 0
  [2, 5], // 1
  [0, 2, 3, 4, 6], // 2
  [0, 2, 3, 5, 6], // 3
  [1, 2, 3, 5], // 4
  [0, 1, 3, 5, 6], // 5
  [0, 1, 3, 4, 5, 6], // 6
  [0, 2, 5], // 7
  [0, 1, 2, 3, 4, 5, 6], // 8
  [0, 1, 2, 3, 5, 6], // 9
];

const findOutputForSignal = (signal) => {
  if (signalByLength.has(signal.length)) {
    return signalByLength.get(signal.length);
  }

  return NaN;
};

const standardizeSignals = map(pipe([
  split(''),
  sort,
  join(''),
]));

const sortSignals = ([signals, outputs]) =>
  [
    standardizeSignals(signals),
    standardizeSignals(outputs),
  ];

const mapSignalsToSegments = (rawSignals) => {
  const signals = rawSignals.map(signal => signal.split(''));

  const signalOfLength = (length) => (signal) => signal.length === length;
  const findSignalOfLength = (length) => signals.find(signalOfLength(length));

  const visualTable = {
    0: undefined,
    1: findSignalOfLength(2),
    2: undefined,
    3: undefined,
    4: findSignalOfLength(4),
    5: undefined,
    6: undefined,
    7: findSignalOfLength(3),
    8: findSignalOfLength(7),
    9: undefined,
  };

  const table = {
    a: undefined,
    b: undefined,
    c: undefined,
    d: undefined,
    e: undefined,
    f: undefined,
    g: undefined,
  };

  // conversions
  // | visual | qty | attempt                  | segments    | diff            | reveals                | known   |
  // |--------+-----+--------------------------+-------------+-----------------+------------------------+---------|
  // | 1      | 2   | ab                       | 2 5         | -               | 2:b|e 5:b|e            | -       |
  // | 7      | 3   | abd                      | 0 2 5       | +0              | 0 is d                 | 0
  // | 4      | 4   | abef                     | 1 2 3 5     | -               | 1:c|g 3:c|g            | 0
  // | 3      | 5   | abcdf                    | 0 2 3 5 6   | 03              | 1:missing4, 6:new 3:stay| 0 1 3 6
  // | 2      | 5   | acdfg                    | 0 2 3 4 6   | 03              | 5:missing3 4:new 2:stay| 0 1 2 3 4 5 6 |
  // | 5      | 5   | bcdef                    | 0 1 3 5 6   | 03              | 2:missing3             | 0 1 2 4 5 6 |
  // | 0      | 6   | abcdef | bcdefg | abcdeg | 0 1 2 4 5 6 | -               | all known
  // | 6      | 6   | abcdef | bcdefg | abcdeg | 0 1 3 4 5 6
  // | 9      | 6   | abcdef | bcdefg | abcdeg | 0 1 2 3 5 6
  // | 8      | 7   | abcdefg                  |

  // Step 1:
  // viz 1:[2,5]. a:[2,5] b:[2,5]
  // viz 7:[0,2,5]. d:0, a:[2,5] b:[2,5]
  // viz 4:[1,2,3,5] d:0, a:[2,5], b:[2,5], e:[1,3], f:[1,3]
  // Step 2: For viz 3 - Find the qty of 5 with all segments in 7, one from 4, and one extra: [0,2,3,5,6]: abcdf | abdef
  // viz 3 should have abcdf. This gives us a few more definitives
  // viz 3:[0,2,3,5,6] d:0, e:1, f:3, c:6, a:[2,5], b:[2,5]. Visuals known: 1,7,4,3,8
  // Step 3: How do we find the values of a and b? - We know c,d,e,f: 0,1,3,6. Find the 5 qty with all of these plus one extra: bcdef: 0,1,3,5,6
  // visuals known: 1,7,4,3,5,8
  // viz 5:[0,1,3,5,6]. b is 5, so a is 2. a:2, b:5, c:6, d:0, e:1, f:3
  // Step 6: Given we know a:2, b:5, c:6, d:0, e:1, f:3, we can infer g:4
  // We now know all values

  const unique = (arr) => Array.from(new Set(arr));
  const hasEveryElementOf = (arr1) => (arr2) => arr2.every(el => arr1.includes(el));
  const notInVisual = (visual, segment) => !visual.includes(segment);

  const visualOne = findSignalOfLength(2);
  const visualSeven = findSignalOfLength(3);
  const visualFour = findSignalOfLength(4);

  table[visualSeven.find(el => !visualOne.includes(el))] = 0;

  const segmentsOfFourNotInSeven = visualFour.filter(el => !visualSeven.includes(el));

  const visualThree = pipe([
    map((el) => visualSeven.concat(el)),
    map(pipe([
      unique,
      sort,
    ])),
    reduce((acc, potential) => acc || signals.find((signal) => signal.length === 5 && potential.every(el => signal.includes(el))), 0),
  ])(segmentsOfFourNotInSeven);

  visualTable[3] = visualThree.join('');
  table[visualThree.find(segment => notInVisual(visualFour, segment) && notInVisual(visualSeven, segment))] = 6;
  const intendedSegment = visualFour.find(segment => notInVisual(visualThree, segment));
  table[intendedSegment] = 1;
  table[segmentsOfFourNotInSeven.find(el => el !== intendedSegment)] = 3;
  const allKnown = Object.keys(table).filter(i => table[i] !== undefined);
  const visualFive = signals.find((signal) => signal.length === 5 && allKnown.every(segment => signal.includes(segment)));
  visualTable[5] = visualFive.join('');
  const unknownKey = visualFive.find(segment => !allKnown.includes(segment));
  table[unknownKey] = 5;
  table[Object.keys(table).find(i => table[i] === undefined && !visualFive.includes(i) && visualOne.includes(i))] = 2;
  table[Object.keys(table).find(i => table[i] === undefined)] = 4;

  const areSameArray = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every(el => arr2.includes(el));
  };

  signals.forEach(signal => {
    // Find visual for each segment
    const visual = validGroups.findIndex((group) => areSameArray(signal.map(s => table[s]), group));
    visualTable[visual] = signal.join('');
  });

  return Object.keys(visualTable).reduce((acc, e) => {
    acc[visualTable[e]] = e.toString();

    return acc;
  }, {});
};

const part2 = () => {
  const calculate = pipe([
    parseInput,
    parseSignals,
    map(sortSignals),
    //tap("Here are the sorted signals"),
    map(([signals, outputs]) => {
      const visualTable = mapSignalsToSegments(signals);

      const lookupVisual = (signal) => visualTable[signal];
      return pipe([
        map(pipe([
          split(''),
          sort,
          join(''),
          lookupVisual,
        ])),
        join(''),
        toInt,
      ])(outputs);
    }),
    tap("Here is the mapped list"),
    reduce((total, output) => total + output, 0)
  ]);

  const result = calculate(filename);

  console.log(`Part 2: "${result}"`);
};

part1();
part2();
