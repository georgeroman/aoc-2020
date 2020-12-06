import Day1 from './day1';
import Day2 from './day2';
import Day3 from './day3';
import Day4 from './day4';
import Day5 from './day5';
import Day6 from './day6';

export interface AocDay {
  run(): Promise<void>;
}

async function main() {
  const days: { [key: string] : AocDay } = {
    'day1': new Day1(),
    'day2': new Day2(),
    'day3': new Day3(),
    'day4': new Day4(),
    'day5': new Day5(),
    'day6': new Day6(),
  };

  const which = process.argv[2];
  if (Object.keys(days).includes(which)) {
    await days[which].run();
  } else {
    console.error('Invalid day');
  }
}

main();
