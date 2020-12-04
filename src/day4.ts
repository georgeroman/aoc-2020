import { AocDay } from '.';
import { readFile } from './utils';

export default class Day4 implements AocDay {
  private allRequiredFieldsArePresent(passport: any): boolean {
    if (passport.byr
        && passport.iyr
        && passport.eyr
        && passport.hgt
        && passport.hcl
        && passport.ecl
        && passport.pid
    ) {
      return true;
    } else {
      return false;
    }
  }

  private allRequiredFieldsAreValid(passport: any): boolean {
    if (!this.allRequiredFieldsArePresent(passport)) {
      return false;
    }

    const byr = Number(passport.byr);
    const validByr = !Number.isNaN(byr) && byr >= 1920 && byr <= 2002;
    if (!validByr) {
      return false;
    }

    const iyr = Number(passport.iyr);
    const validIyr = !Number.isNaN(iyr) && iyr >= 2010 && iyr <= 2020;
    if (!validIyr) {
      return false;
    }

    const eyr = Number(passport.eyr);
    const validEyr = !Number.isNaN(eyr) && eyr >= 2020 && eyr <= 2030;
    if (!validEyr) {
      return false;
    }

    const validHgtSuffix = passport.hgt.endsWith('cm') || passport.hgt.endsWith('in');
    if (!validHgtSuffix) {
      return false;
    }

    if (passport.hgt.endsWith('cm')) {
      const hgt = Number(passport.hgt.slice(0, -2));
      const validHgt = !Number.isNaN(hgt) && hgt >= 150 && hgt <= 193;
      if (!validHgt) {
        return false;
      }
    } else {
      const hgt = Number(passport.hgt.slice(0, -2));
      const validHgt = !Number.isNaN(hgt) && hgt >= 59 && hgt <= 76;
      if (!validHgt) {
        return false;
      }
    }

    const validHcl = passport.hcl.match(/^#[0-9a-f]{6}$/);
    if (!validHcl) {
      return false;
    }

    const validEcl = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl);
    if (!validEcl) {
      return false;
    }

    const validPid = passport.pid.match(/^[0-9]{9}$/);
    if (!validPid) {
      return false;
    }

    return true;
  }

  private parsePassports(input: string): any[] {
    const lines = input.split('\n');
    lines.push('');

    const passports: any[] = [];

    let currentPassport: any = {};
    for (const line of lines) {
      if (line === '') {
        passports.push(currentPassport);
        currentPassport = {};
      } else {
        for (const data of line.split(' ')) {
          const [field, value] = data.split(':');
          currentPassport[field] = value;
        }
      }
    }

    return passports;
  }

  async run() {
    const input = await readFile('input/day4.input');

    const passports = this.parsePassports(input);

    // Part 1
    console.log(passports.reduce((numValid, passport) => {
      return numValid + (this.allRequiredFieldsArePresent(passport) ? 1 : 0);
    }, 0));
    
    // Part 2
    console.log(passports.reduce((numValid, passport) => {
      return numValid + (this.allRequiredFieldsAreValid(passport) ? 1 : 0);
    }, 0));
  }
}
