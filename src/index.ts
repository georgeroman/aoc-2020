import Day1 from './day1';
import Day2 from './day2';
import Day3 from './day3';

export interface AocDay {
  run(): Promise<void>;
}

async function main() {
  const days: { [key: string] : AocDay } = {
    'day1': new Day1(),
    'day2': new Day2(),
    'day3': new Day3(),
  };

  const which = process.argv[2];
  if (Object.keys(days).includes(which)) {
    await days[which].run();
  } else {
    console.error('Invalid day');
  }
}

main();
