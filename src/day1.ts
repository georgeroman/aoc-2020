import { AocDay } from '.';
import { readFile } from './utils';

export default class Day1 implements AocDay {
  private findProductOfNumbersSummingTo(numbers: number[], to: number): number | null {
    // Expects 'numbers' to be sorted

    let lo = 0, hi = numbers.length - 1;
    while (lo < hi) {
      const sum = numbers[lo] + numbers[hi];
      if (sum === to) {
        return numbers[lo] * numbers[hi];
      } else if (sum < to) {
        lo++;
      } else {
        hi--;
      }
    }

    return null;
  }

  async run() {
    const input = await readFile('input/day1.input');

    const numbers = input.split('\n').map(Number);
    numbers.sort((a, b) => a - b);
    
    // Part 1
    console.log(this.findProductOfNumbersSummingTo(numbers, 2020));

    // Part 2
    for (let i = 0; i < numbers.length; i++) {
      const tmpNumbers = [...numbers];
      tmpNumbers.splice(i, 1);

      const product = this.findProductOfNumbersSummingTo(tmpNumbers, 2020 - numbers[i]);
      if (product) {
        console.log(numbers[i] * product);
        break;
      }
    }
  }
}
