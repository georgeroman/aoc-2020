import { AocDay } from '.';
import { readFile } from './utils';

export default class Day6 implements AocDay {
  private parseInputAsAnyone(input: string): Set<string>[] {
    const lines = input.split('\n');
    lines.push('');

    const result: Set<string>[] = [];

    let currentGroup = new Set<string>();
    for (const line of lines) {
      if (line === '') {
        result.push(currentGroup);
        currentGroup = new Set<string>();
      } else {
        for (const question of line.trim()) {
          currentGroup.add(question);
        }
      }
    }

    return result;
  }

  private intersect<T>(sets: Set<T>[]): Set<T> {
    let result = sets[0];
    for (let i = 1; i < sets.length; i++) {
      result = new Set([...result].filter(x => sets[i].has(x)));
    }
    return result;
  }

  private parseInputAsEveryone(input: string): Set<string>[] {
    const lines = input.split('\n');
    lines.push('');

    const result: Set<string>[] = [];

    let currentGroup: Set<string>[] = [];
    for (const line of lines) {
      if (line === '') {
        result.push(this.intersect(currentGroup));
        currentGroup = [];
      } else {
        currentGroup.push(new Set<string>());
        for (const question of line.trim()) {
          currentGroup[currentGroup.length - 1].add(question);
        }
      }
    }

    return result;
  }

  async run() {
    const input = await readFile('input/day6.input');

    // Part 1
    console.log(this.parseInputAsAnyone(input).reduce((sum, group) => sum + group.size, 0));

    // Part 2
    console.log(this.parseInputAsEveryone(input).reduce((sum, group) => sum + group.size, 0));
  }
}
