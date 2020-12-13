import BN from 'bn.js';

import { AocDay } from '.';
import { readFile } from './utils';

export default class Day13 implements AocDay {
  async run() {
    const input = await readFile('input/day13.input');

    const lines = input.split('\n');
    const timestamp = Number(lines[0]);
    const busesNoIndex = lines[1].split(',')
      .filter(b => b !== 'x')
      .map(Number);
    const busesWithIndex = lines[1].split(',')
      .map((b, i) => [Number(b), i])
      .filter(([b, ]) => !Number.isNaN(b));

    // Part 1
    const busTimes = busesNoIndex.map((b) => (
      timestamp % b === 0
        ? [timestamp, b]
        : [(Math.floor(timestamp / b) + 1) * b, b]
    ));
    const [earliestTimestamp, earliestBus] = busTimes.reduce((earliest: number[], current: number[]) => {
      const [earliestTimestamp, ] = earliest;
      const [currentTimestamp, ] = current;

      if (currentTimestamp < earliestTimestamp) {
        return current;
      }
      return earliest;
    }, busTimes[0]);
    console.log((earliestTimestamp - timestamp) * earliestBus);

    // Part 2
    const congruences = busesWithIndex.map(([b, i]) => new BN(b - i % b));
    const moduli = busesWithIndex.map(([b, ]) => new BN(b));
    
    const invmod = (a: BN, n: BN): BN  => {
      let [t, newT, r, newR] = [new BN(0), new BN(1), n, a.mod(n)];
      while (!newR.eq(new BN(0))) {
        let q = r.div(newR);
        [newT, t] = [t.sub(q.mul(newT)), newT];
        [newR, r] = [r.sub(q.mul(newR)), newR];
      }
      if (r.gt(new BN(1))) {
        throw new Error('Modular inverse does not exist');
      }
      if (t.lt(new BN(0))) {
        t = t.add(n);
      }
      return t;
    };

    const moduliProduct = moduli.reduce((acc, m) => acc.mul(new BN(m)), new BN(1));

    let result: BN = new BN(0);
    for (let i = 0; i < busesWithIndex.length; i++) {
      const x = moduliProduct.div(new BN(moduli[i]));
      result = result.add(congruences[i].mul(x).mul(invmod(x, moduli[i])));
    }
    result = result.mod(moduliProduct);
    
    console.log(result.toString());
  }
}
