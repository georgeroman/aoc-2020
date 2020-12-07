import { AocDay } from '.';
import { readFile } from './utils';

type Bags = { [key: string]: { name: string, quantity: number}[] };

export default class Day7 implements AocDay {
  private parseInput(input: string): Bags {
    const result: Bags = {};

    for (const line of input.split('\n')) {
      const words = line.trim().split(' ');

      const name = `${words[0]} ${words[1]}`;
      result[name] = [];
      if (words[4] !== 'no') {
        let currentIndex = 4;
        do {
          result[name].push({
            name: `${words[currentIndex + 1]} ${words[currentIndex + 2]}`,
            quantity: Number(words[currentIndex]),
          });
          currentIndex += 4;
        } while (currentIndex < words.length);
      }
    }

    return result;
  }

  private canHoldCache: { [key: string]: boolean } = {};
  private canHoldBag(bags: Bags, holdingBag: string, holdedBag: string): boolean {
    const cacheKey = `${holdingBag}:${holdedBag}`;
    if (this.canHoldCache[cacheKey]) {
      return true;
    }

    for (const { name } of bags[holdingBag]) {
      if (name === holdedBag) {
        this.canHoldCache[cacheKey] = true;
        return true;
      } else {
        const result = this.canHoldBag(bags, name, holdedBag);
        this.canHoldCache[cacheKey] = result;
        if (result) {
          return true;
        }
      }
    }

    this.canHoldCache[cacheKey] = false;
    return false;
  }

  private getNumBags(bags: Bags, holdingBag: string): number {
    let result = 0;
    for (const { name, quantity } of bags[holdingBag]) {
      result += quantity + quantity * this.getNumBags(bags, name);
    }
    return result;
  }

  async run() {
    const input = await readFile('input/day7.input');

    const bags = this.parseInput(input);

    // Part 1
    let result = 0;
    for (const holdingBag of Object.keys(bags)) {
      if (holdingBag !== 'shiny gold' && this.canHoldBag(bags, holdingBag, 'shiny gold')) {
        result++;
      }
    }
    console.log(result);

    // Part 2
    console.log(this.getNumBags(bags, 'shiny gold'));
  }
}
