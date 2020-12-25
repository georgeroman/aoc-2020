import BN from 'bn.js';

import { AocDay } from '.';
import { readFile } from './utils';

function powerMod(base: BN, exponent: BN, modulus: BN): BN {
  if (modulus.eq(new BN(1))) {
    return new BN(0);
  }
  let result = new BN(1);
  base = base.mod(modulus);
  while (exponent.gt(new BN(0))) {
    if (exponent.mod(new BN(2)).eq(new BN(1))) {
      result = result.mul(base).mod(modulus);
    }
    exponent = exponent.div(new BN(2));
    base = base.mul(base).mod(modulus);
  }
  return result;
}

export default class Day25 implements AocDay {
  async run() {
    const input = await readFile('input/day25.input');

    const [cardPubKey, doorPubKey] = input.split('\n').map(Number);

    // Part 1
    const transformSubjectNum = (subjectNum: BN, loopSize: BN): BN => (
      powerMod(subjectNum, loopSize, new BN(20201227))
    );

    const findLoopSize = (pubKey: BN): BN => {
      let loopSize = new BN(0);
      let value = new BN(1);
      while (!value.eq(pubKey)) {
        value = value.mul(new BN(7)).mod(new BN(20201227));
        loopSize = loopSize.add(new BN(1));
      }
      return loopSize;
    };

    const cardLoopSize = findLoopSize(new BN(cardPubKey));

    console.log(transformSubjectNum(new BN(doorPubKey), cardLoopSize).toString());
  }
}
