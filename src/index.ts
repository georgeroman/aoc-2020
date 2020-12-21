import Day1 from './day1';
import Day2 from './day2';
import Day3 from './day3';
import Day4 from './day4';
import Day5 from './day5';
import Day6 from './day6';
import Day7 from './day7';
import Day8 from './day8';
import Day9 from './day9';
import Day10 from './day10';
import Day11 from './day11';
import Day12 from './day12';
import Day13 from './day13';
import Day14 from './day14';
import Day15 from './day15';
import Day16 from './day16';
import Day17 from './day17';
import Day18 from './day18';
import Day19 from './day19';
import Day20 from './day20';
import Day21 from './day21';

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
    'day7': new Day7(),
    'day8': new Day8(),
    'day9': new Day9(),
    'day10': new Day10(),
    'day11': new Day11(),
    'day12': new Day12(),
    'day13': new Day13(),
    'day14': new Day14(),
    'day15': new Day15(),
    'day16': new Day16(),
    'day17': new Day17(),
    'day18': new Day18(),
    'day19': new Day19(),
    'day20': new Day20(),
    'day21': new Day21(),
  };

  const which = process.argv[2];
  if (Object.keys(days).includes(which)) {
    await days[which].run();
  } else {
    console.error('Invalid day');
  }
}

main();
