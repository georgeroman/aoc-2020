import { AocDay } from '.';
import { readFile } from './utils';

interface PasswordData {
  min: number;
  max: number;
  letter: string;
  password: string;
}

export default class Day2 implements AocDay {
  private parseLine(line: string): PasswordData {
    const [min, rest] = line.split('-');
    const [max, tmpLetter, password] = rest.split(' ');
    const letter = tmpLetter[0];

    return {
      min: Number(min),
      max: Number(max),
      letter,
      password,
    };
  }

  async run() {
    const input = await readFile('input/day2.input');

    const passwords = input.split('\n').map(line => this.parseLine(line));

    // Part 1
    let firstValidCount = 0;
    for (const data of passwords) {
      const letterAppearances = (data.password.match(new RegExp(`${data.letter}`, 'g')) || []).length;
      if (letterAppearances >= data.min && letterAppearances <= data.max) {
        firstValidCount++;
      }
    }
    console.log(firstValidCount);

    // Part 2
    let secondValidCount = 0;
    for (const data of passwords) {
      const firstCharacter = data.password[data.min - 1];
      const secondCharacter = data.password[data.max - 1];
      if (firstCharacter === data.letter && secondCharacter !== data.letter) {
        secondValidCount++;
      } else if (secondCharacter === data.letter && firstCharacter !== data.letter) {
        secondValidCount++;
      }
    }
    console.log(secondValidCount);
  }
}
