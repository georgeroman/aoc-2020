import BN from 'bn.js';

import { AocDay } from '.';
import { readFile } from './utils';

export default class Day9 implements AocDay {
  async run() {
    const input = await readFile('input/day9.input');

    const numbers = input.split('\n').map(Number);

    // Part 1
    let invalid: number = -1;
    const preamble = new Set<number>(numbers.slice(0, 25));
    for (const number of numbers.slice(25)) {
      let valid = false;
      for (const x of preamble) {
        if (preamble.has(number - x)) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        invalid = number;
        break;
      }
      preamble.delete(preamble.values().next().value);
      preamble.add(number);
    }
    console.log(invalid);

    // Part 2
    const partialSums: BN[] = [new BN(numbers[0])];
    for (let i = 1; i < numbers.length; i++) {
      partialSums.push(partialSums[i - 1].add(new BN(numbers[i])));
    }

    let i = 0, j = 1;
    while (j < numbers.length) {
      const diff = partialSums[j].sub(partialSums[i]);
      if (diff.lt(new BN(invalid))) {
        j++;
      } else if (diff.gt(new BN(invalid))) {
        i++;
      } else {
        const sequence = numbers.slice(i, j + 1);
        console.log(Math.min(...sequence) + Math.max(...sequence));
        break;
      }
    }
  }
}
