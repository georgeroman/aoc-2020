import { AocDay } from '.';
import { readFile } from './utils';

export default class Day5 implements AocDay {
  private parseBoardingPass(boardingPass: string): number {
    let index;

    index = 0;
    let loRow = 0, hiRow = 128;
    const rows = boardingPass.slice(0, 7);
    while (loRow < hiRow && index < 7) {
      if (rows[index] === 'F') {
        hiRow -= (hiRow - loRow) / 2;
      } else {
        loRow += (hiRow - loRow) / 2;
      }
      index++;
    }

    index = 0;
    let loCol = 0, hiCol = 8;
    const cols = boardingPass.slice(7, 10);
    while (loCol < hiCol && index < 3) {
      if (cols[index] === 'L') {
        hiCol -= (hiCol - loCol) / 2;
      } else {
        loCol += (hiCol - loCol) / 2;
      }
      index++;
    }

    return loRow * 8 + loCol;
  }

  async run() {
    const input = await readFile('input/day5.input');

    const lines = input.split('\n');

    // Part 1
    console.log(Math.max(...lines.map(line => this.parseBoardingPass(line))));

    // Part 2
    const seats = lines.map(line => this.parseBoardingPass(line));
    seats.sort();
    for (let i = 0; i < seats.length - 1; i++) {
      if (seats[i] === seats[i + 1] - 2) {
        console.log(seats[i] + 1);
        break;
      }
    }
  }
}
