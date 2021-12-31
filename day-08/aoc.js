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

const sortSignals = ([signals, outputs]) =>
  [
    signals.map((value) => value.split('').sort((a, b) => a > b ? 1 : -1).join('')),
    outputs.map((value) => value.split('').sort((a, b) => a > b ? 1 : -1).join('')),
  ];

const mapSignalsToSegments = (rawSignals) => {
  console.log("The signals are ", rawSignals);
  const signals = rawSignals.map(signal => signal.split(''));

  const visualTable = {
    0: undefined,
    1: signals.find(signal => signal.length === 2).join(''),
    2: undefined,
    3: undefined,
    4: signals.find(signal => signal.length === 4).join(''),
    5: undefined,
    6: undefined,
    7: signals.find(signal => signal.length === 3).join(''),
    8: signals.find(signal => signal.length === 7).join(''),
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


  // 128 bit number
  // masks
  // a/0: 0000001 => 1
  // b/1: 0000010 => 2
  // c/2: 0000100 => 4
  // d/3: 0001000 => 8
  // e/4: 0010000 => 16
  // f/5: 0100000 => 32
  // g/6: 1000000 => 64
  // 
  // conversions
  // | visual | binary  | decimal |
  // |--------+---------+---------|
  // | 0      | 1110111 | 119     |
  // | 1      | 0100100 | 36      |
  // | 2      | 1011101 | 93      |
  // | 3      | 1101101 | 109     |
  // | 4      | 0101110 | 46      |
  // | 5      | 1101011 | 107     |
  // | 6      | 1111011 | 123     |
  // | 7      | 0100101 | 37      |
  // | 8      | 1111111 | 127     |
  // | 9      | 1101111 | 111     |


  // conversions
  // | visual | binary  | decimal | qty |
  // |--------+---------+---------+-----|
  // | 0      | 1110111 | 119     | 6   |
  // | 1      | 0100100 | 36      | 2   |
  // | 2      | 1011101 | 93      | 5   |
  // | 3      | 1101101 | 109     | 5   |
  // | 4      | 0101110 | 46      | 4   |
  // | 5      | 1101011 | 107     | 5   |
  // | 6      | 1111011 | 123     | 6   |
  // | 7      | 0100101 | 37      | 3   |
  // | 8      | 1111111 | 127     | 7   |
  // | 9      | 1101111 | 111     | 6   |

  // conversions
  // | visual | qty | 
  // |--------+-----|
  // | 1      | 2   | 
  // | 7      | 3   |
  // | 4      | 4   |
  // | 2      | 5   |
  // | 3      | 5   |
  // | 5      | 5   |
  // | 0      | 6   |
  // | 6      | 6   |
  // | 9      | 6   |
  // | 8      | 7   |

  // be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb
  // acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

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

  const findSignalOfLength = (length) =>
    signals.find(signal => signal.length === 2);
  const visualOne = signals.find(signal => signal.length === 2);
  const visualSeven = signals.find(signal => signal.length === 3);
  table[visualSeven.find(el => !visualOne.includes(el))] = 0;
  const visualFour = signals.find(signal => signal.length === 4);
  const diff = visualFour.filter(el => !visualSeven.includes(el));

  const visualThree = pipe([
    filter(signal => signal.length === 5),
    (candidates) => {
      const potentialCombos = diff.map(segment => sort(unique(visualSeven.concat(segment))));

      console.log("The combos are", potentialCombos);
      console.log("The thing", candidates.find(candidate => potentialCombos.find(potential => potential.every(el => candidate.includes(el)))));
      return candidates.find(candidate => potentialCombos.find(potential => potential.every(el => candidate.includes(el))));
    },
  ])(signals);

  visualTable[3] = visualThree.join('');
  table[visualThree.find(segment => !visualFour.includes(segment) && !visualSeven.includes(segment))] = 6;
  const intendedSegment = visualFour.find(segment => !visualThree.includes(segment));
  table[intendedSegment] = 1;
  table[diff.find(el => el !== intendedSegment)] = 3;
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
    //console.log("The visual for ", signal, "is", visual);
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
      console.log("Mapping signals to segments");
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
