import { AocDay } from '.';
import { readFile } from './utils';

export default class Day15 implements AocDay {
  private simulateGame(numbers: number[], untilTurn: number): number {
    const lastSpoken: number[] = Array(30000000);

    let turn = 0;
    for (const number of numbers) {
      lastSpoken[number] = turn;
      turn++;
    }

    let nextNumber = 0;
    while (turn < untilTurn - 1) {
      const nextNumberCopy = nextNumber;
      if (lastSpoken[nextNumber] !== undefined) {
        nextNumber = turn - lastSpoken[nextNumber];
      } else {
        nextNumber = 0;
      }
      lastSpoken[nextNumberCopy] = turn++;
    }

    return nextNumber;
  }

  async run() {
    const input = await readFile('input/day15.input');

    const numbers = input.split(',').map(Number);

    // Part 1
    console.log(this.simulateGame(numbers, 2020));

    // Part 2
    console.log(this.simulateGame(numbers, 30000000));
  }
}
