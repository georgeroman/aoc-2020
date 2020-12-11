import { AocDay } from '.';
import { readFile } from './utils';

export default class Day11 implements AocDay {
  private parseSeats(input: string): string[][] {
    const result: string[][] = [];

    for (const line of input.split('\n')) {
      result.push([]);
      for (const seat of line) {
        result[result.length - 1].push(seat);
      }
    }

    return result;
  }

  private numOccupiedAdjacentSeats(seats: string[][], row: number, col: number): number {
    const isValidPosition = (myRow: number, myCol: number): boolean => (
      myRow >= 0 && myRow < seats.length && myCol >= 0 && myCol < seats[myRow].length
    );
    const isSeatOccupied = (myRow: number, myCol: number): boolean => (
      isValidPosition(myRow, myCol) && seats[myRow][myCol] === '#'
    );

    return [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1 ],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1]
    ].filter(([myRow, myCol]) => isSeatOccupied(myRow, myCol)).length;
  }

  private numOccupiedSeenSeats(seats: string[][], row: number, col: number): number {
    const isValidPosition = (myRow: number, myCol: number): boolean => (
      myRow >= 0 && myRow < seats.length && myCol >= 0 && myCol < seats[myRow].length
    );

    return [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ].filter(([rowIncrement, colIncrement]) => {
      let currentRow = row + rowIncrement, currentCol = col + colIncrement;
      while (isValidPosition(currentRow, currentCol) && seats[currentRow][currentCol] === '.') {
        currentRow += rowIncrement;
        currentCol += colIncrement;
      }

      if (isValidPosition(currentRow, currentCol) && seats[currentRow][currentCol] === '#') {
        return true;
      }
      return false;
    }).length;
  }

  private simulate(
    seats: string[][],
    callback: (seats: string[][], seatsCopy: string[][], row: number, col: number) => boolean
  ) {
    let changed = true;
    while (changed) {
      changed = false;
      const seatsCopy = seats.map((row: string[]) => row.slice());
      for (let row = 0; row < seats.length; row++) {
        for (let col = 0; col < seats[row].length; col++) {
          if (callback(seats, seatsCopy, row, col)) {
            changed = true;
          }
        }
      }
      seats = seatsCopy;
    }
    return seats;
  }

  async run() {
    const input = await readFile('input/day11.input');

    const seats = this.parseSeats(input);

    // Part 1
    const part1Callback = (seats: string[][], seatsCopy: string[][], row: number, col: number): boolean => {
      if (seats[row][col] === 'L' && this.numOccupiedAdjacentSeats(seats, row, col) === 0) {
        seatsCopy[row][col] = '#';
        return true;
      } else if (seats[row][col] === '#' && this.numOccupiedAdjacentSeats(seats, row, col) >= 4) {
        seatsCopy[row][col] = 'L';
        return true;
      }
      return false;
    }

    const part1Seats = this.simulate(seats, part1Callback);
    console.log(part1Seats.reduce((sum, row) => (
      sum + row.filter(seat => seat === '#').length
    ), 0));

    // Part 2
    const part2Callback = (seats: string[][], seatsCopy: string[][], row: number, col: number): boolean => {
      if (seats[row][col] === 'L' && this.numOccupiedSeenSeats(seats, row, col) === 0) {
        seatsCopy[row][col] = '#';
        return true;
      } else if (seats[row][col] === '#' && this.numOccupiedSeenSeats(seats, row, col) >= 5) {
        seatsCopy[row][col] = 'L';
        return true;
      }
      return false;
    }

    const part2Seats = this.simulate(seats, part2Callback);
    console.log(part2Seats.reduce((sum, row) => (
      sum + row.filter(seat => seat === '#').length
    ), 0));
  }
}
