import { AocDay } from '.';
import { readFile } from './utils';

export default class Day18 implements AocDay {
  async run() {
    const input = await readFile('input/day18.input');

    // Part 1
    const parseSamePrecendence = (expr: string): number => {
      expr = expr.replace(/\s/g, '');

      let i = 0;

      const parseParentheses = (): number => {
        i++;
        const result = parseOperations();
        i++;
        return result;
      };

      const combine = (op: string, x: number, y: number) => (
        op === '+'
          ? x + y
          : x * y
      );

      const parseOperations = (): number => {
        let current: number;
        if (expr[i] === '(') {
          current = parseParentheses();
        } else {
          current = Number(expr[i++]);
        }
        
        while (i < expr.length && expr[i] !== ')') {
          const op = expr[i];
          if (expr[i + 1] === '(') {
            i = i + 1;
            current = combine(op, current, parseParentheses());
          } else {
            current = combine(op, current, Number(expr[i + 1]));
            i = i + 2;
          }
        }

        return current;
      }

      return parseOperations();
    };

    console.log(
      input.split('\n')
        .map(parseSamePrecendence)
        .reduce((sum, curr) => sum + curr, 0)
    );

    // Part 2
    const parseDifferentPrecendence = (expr: string): number => {
      expr = expr.replace(/\s/g, '');

      let i = 0;

      const parseParentheses = (): number => {
        i++;
        const result = parseOperations();
        i++;
        return result;
      };

      const combine = (op: string, x: number, y: number) => (
        op === '+'
          ? x + y
          : x * y
      );

      const parseOperations = (): number => {
        let current: number;
        if (expr[i] === '(') {
          current = parseParentheses();
        } else {
          current = Number(expr[i++]);
        }
        
        while (i < expr.length && expr[i] !== ')') {
          const op = expr[i];
          if (expr[i + 1] === '(') {
            i = i + 1;
            if (op === '+') {
              current = combine(op, current, parseParentheses());
            } else {
              current = combine(op, current, parseOperations());
            }
          } else {
            if (op === '+') {
              current = combine(op, current, Number(expr[i + 1]));
              i = i + 2;
            } else {
              i = i + 1;
              current = combine(op, current, parseOperations());
            }
          }
        }

        return current;
      }

      return parseOperations();
    };

    console.log(
      input.split('\n')
        .map(parseDifferentPrecendence)
        .reduce((sum, curr) => sum + curr, 0)
    );
  }
}
