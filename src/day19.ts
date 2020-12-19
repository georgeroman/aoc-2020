import { AocDay } from '.';
import { readFile } from './utils';

export default class Day19 implements AocDay {
  private rules: { [key: number]: number[][] | string } = {};
  private messages: string[] = [];

  private parseInput(input: string) {
    const lines = input.split('\n');

    let i = 0;
    while (i < lines.length && lines[i] !== '') {
      const [ruleNo, rules] = lines[i].split(': ');
      if (rules.startsWith('"')) {
        this.rules[Number(ruleNo)] = rules[1];
      } else if (rules.includes('|')) {
        const [first, second] = rules.split(' | ');
        this.rules[Number(ruleNo)] = [
          first.split(' ').map(Number),
          second.split(' ').map(Number)
        ];
      } else {
        this.rules[Number(ruleNo)] = [rules.split(' ').map(Number)];
      }
      i++;
    }

    i++;
    while (i < lines.length) {
      this.messages.push(lines[i]);
      i++;
    }
  }

  async run() {
    const input = await readFile('input/day19.input');

    this.parseInput(input);

    const matches = (message: string, ruleNo: number): boolean => {
      const getMessageIfMatching = (message: string, ruleNo: number): string => {
        if (typeof this.rules[ruleNo] === 'string') {
          return this.rules[ruleNo] === message[0] ? message[0] : '';
        } else {
          for (const ruleNosToMatch of this.rules[ruleNo] as number[][]) {
            let messageCopy = message;
            let match = '';
            let matchesAllRules = true;

            for (const ruleNoToMatch of ruleNosToMatch) {
              const matchingPart = getMessageIfMatching(messageCopy, ruleNoToMatch);
              if (matchingPart === '') {
                matchesAllRules = false;
                break;
              } else {
                match += matchingPart;
                messageCopy = messageCopy.slice(matchingPart.length);
              }
            }

            if (matchesAllRules) {
              return match;
            }
          }

          return '';
        }
      };
      return getMessageIfMatching(message, ruleNo) === message;
    };

    // Part 1
    console.log(this.messages.filter(msg => matches(msg, 0)).length);

    // Part 2
    let count = 0;
    for (const message of this.messages) {
      const numParts = message.length / 8;
      for (let i = 2 - numParts % 2; i <= numParts - 2; i++) {
        const customRule = [];
        // Rules corresponding to rule 8's loop
        for (let count42 = 0; count42 < i; count42++) {
          customRule.push(42);
        }
        // Rules corresponding to rule 11's loop
        for (let count42 = 0; count42 < (numParts - i) / 2; count42++) {
          customRule.push(42);
        }
        for (let count31 = 0; count31 < (numParts - i) / 2; count31++) {
          customRule.push(31);
        }

        this.rules[999] = [customRule];
        if (matches(message, 999)) {
          count++;
          break;
        }
      }
    }
    console.log(count);
  }
}
