import BN from 'bn.js';

import { AocDay } from '.';
import { bn, readFile } from './utils';

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
    const congruences = busesWithIndex.map(([b, i]) => bn(b - i % b));
    const moduli = busesWithIndex.map(([b, ]) => bn(b));
    
    const invmod = (a: BN, n: BN): BN  => {
      let [t, newT, r, newR] = [bn(0), bn(1), n, a.mod(n)];
      while (!newR.eq(bn(0))) {
        let q = r.div(newR);
        [newT, t] = [t.sub(q.mul(newT)), newT];
        [newR, r] = [r.sub(q.mul(newR)), newR];
      }
      if (r.gt(bn(1))) {
        throw new Error('Modular inverse does not exist');
      }
      if (t.lt(bn(0))) {
        t = t.add(n);
      }
      return t;
    };

    const moduliProduct = moduli.reduce((acc, m) => acc.mul(bn(m)), bn(1));

    let result: BN = bn(0);
    for (let i = 0; i < busesWithIndex.length; i++) {
      const x = moduliProduct.div(bn(moduli[i]));
      result = result.add(congruences[i].mul(x).mul(invmod(x, moduli[i])));
    }
    result = result.mod(moduliProduct);
    
    console.log(result.toString());
  }
}
