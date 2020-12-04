import { AocDay } from '.';
import { readFile } from './utils';

export default class Day3 implements AocDay {
  private parseInput(input: string): string[][] {
    const result: string[][] = [];
    for (const line of input.split('\n')) {
      result.push([]);
      for (const char of line) {
        result[result.length - 1].push(char);
      }
    }
    return result;
  }

  private getNumTreesHit(map: string[][], rowOffset: number, colOffset: number): number {
    let numTrees = 0;
    let row = 0, col = 0;
    while (row < map.length) {
      if (map[row][col] === '#') {
        numTrees++;
      }
      row = row + rowOffset;
      col = (col + colOffset) % map[0].length;
    }
    return numTrees;
  }

  async run() {
    const input = await readFile('input/day3.input');

    const map = this.parseInput(input);
    
    // Part 1
    console.log(this.getNumTreesHit(map, 1, 3));

    // Part 2
    console.log(
      this.getNumTreesHit(map, 1, 1)
      * this.getNumTreesHit(map, 1, 3)
      * this.getNumTreesHit(map, 1, 5)
      * this.getNumTreesHit(map, 1, 7)
      * this.getNumTreesHit(map, 2, 1)
    );
  }
}
