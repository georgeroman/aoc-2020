import { AocDay } from '.';
import { readFile } from './utils';

export default class Day10 implements AocDay {
  private countNumArrangementsCache: { [key: number]: number } = {}
  private countNumArrangements(adapters: number[], lastIndex: number): number {
    if (lastIndex in this.countNumArrangementsCache) {
      return this.countNumArrangementsCache[lastIndex];
    }

    if (lastIndex === adapters.length - 1) {
      return 1;
    }

    let count = 0;

    let newIndex = lastIndex + 1;
    while (newIndex < adapters.length) {
      if (adapters[newIndex] - adapters[lastIndex] <= 3) {
        count += this.countNumArrangements(adapters, newIndex);
      }
      newIndex++;
    }

    this.countNumArrangementsCache[lastIndex] = count;
    return count;
  }

  async run() {
    const input = await readFile('input/day10.input');

    const adapters = input.split('\n').map(Number);
    adapters.sort((a, b) => a - b);
    adapters.unshift(0);
    adapters.push(Math.max(...adapters) + 3);

    // Part 1
    let oneJoltageDiff = 0, threeJoltageDiff = 0;
    for (let i = 1; i < adapters.length; i++) {
      const diff = adapters[i] - adapters[i - 1];
      if (diff === 1) {
        oneJoltageDiff++;
      } else if (diff === 3) {
        threeJoltageDiff++;
      }
    }
    console.log(oneJoltageDiff * threeJoltageDiff);

    // Part 2
    console.log(this.countNumArrangements(adapters, 0));
  }
}
