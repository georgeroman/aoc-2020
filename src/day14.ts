import BN from 'bn.js';

import { AocDay } from '.';
import { bn, readFile } from './utils';

interface Mask {
  type: 'Mask';
  value: string;
}

interface Memory {
  type: 'Memory';
  address: BN;
  value: BN;
}

export default class Day14 implements AocDay {
  private parseInstructions(input: string): (Mask | Memory)[] {
    const result: (Mask | Memory)[] = [];

    for (const line of input.split('\n')) {
      if (line.startsWith('mask')) {
        const matches = /^mask = (\w+)$/.exec(line);
        if (matches) {
          result.push({
            type: 'Mask',
            value: matches[1]
          } as Mask);
        }
      } else {
        const matches = /^mem\[(\d+)\] = (\d+)$/.exec(line);
        if (matches) {
          result.push({
            type: 'Memory',
            address: bn(matches[1]),
            value: bn(matches[2])
          } as Memory);
        }
      }
    }

    return result;
  }

  async run() {
    const input = await readFile('input/day14.input');

    const instructions = this.parseInstructions(input);

    let memory: { [key: string]: BN };

    // Part 1
    memory = {};

    const computeOrValue = (mask: Mask): BN => (
      bn(parseInt(mask.value.replace(/X/g, '0'), 2))
    );
    const computeAndValue = (mask: Mask): BN => (
      bn(parseInt(mask.value.replace(/X/g, '1'), 2))
    );

    let [orValue, andValue] = [bn(0), bn(0)];
    for (const instruction of instructions) {
      if (instruction.type === 'Mask') {
        [orValue, andValue] = [computeOrValue(instruction), computeAndValue(instruction)];
      } else {
        memory[instruction.address.toString()] = instruction.value.or(orValue).and(andValue);
      }
    }

    console.log((Object.values(memory).reduce((acc, value) => acc.add(value), bn(0))).toString());

    // Part 2
    const writes: { maskedAddress: string, value: BN }[] = [];

    const maskAddress = (mask: Mask, address: BN): string => {
      let addressStr = address.toString(2, 36);
      for (let i = 0; i < mask.value.length; i++) {
        if (mask.value[i] === '1' || mask.value[i] === 'X') {
          addressStr = addressStr.slice(0, i) + mask.value[i] + addressStr.slice(i + 1);
        }
      }
      return addressStr;
    };

    const generateAddresses = (maskedAddress: string): string[] => {
      const result: string[] = [];

      const xCount = bn((maskedAddress.match(new RegExp('X', 'g')) || []).length);
      for (let i = bn(0); i.lt(bn(2).pow(xCount)); i = i.add(bn(1))) {
        const binaryString = i.toString(2, xCount.toNumber());
        
        let address = '', binaryI = 0;
        for (let maskedI = 0; maskedI < maskedAddress.length; maskedI++) {
          address += maskedAddress[maskedI] !== 'X' ? maskedAddress[maskedI] : binaryString[binaryI++];
        }

        result.push(address);
      }

      return result;
    };

    let currentMask: Mask = { type: 'Mask', value: '' };
    for (const instruction of instructions) {
      if (instruction.type === 'Mask') {
        currentMask = instruction;
      } else {
        writes.push({
          maskedAddress: maskAddress(currentMask, instruction.address),
          value: instruction.value
        });
      }
    }

    memory = {};
    for (const { maskedAddress, value } of writes) {
      for (const address of generateAddresses(maskedAddress)) {
        memory[address] = value;
      }
    }

    console.log((Object.values(memory).reduce((acc, value) => acc.add(value), bn(0))).toString());
  }
}
