import { AocDay } from '.';
import { readFile } from './utils';

type Instruction = {
  name: string,
  offset: number,
  index: number
};

class InfiniteLoopError extends Error {}
class ExitSuccess extends Error {}

class Computer {
  private accumulator: number;
  private instructions: Instruction[];
  private instructionIndex: number;

  constructor(instructions: Instruction[]) {
    this.accumulator = 0;
    this.instructions = instructions;
    this.instructionIndex = 0;
  }

  public run(
    instructionCallback: (accumulator: number, instruction: Instruction) => void
  ): void {
    while (this.instructionIndex < this.instructions.length) {
      const currentInstruction = this.instructions[this.instructionIndex];
      instructionCallback(this.accumulator, currentInstruction);

      if (currentInstruction.name === 'acc') {
        this.accumulator += currentInstruction.offset;
        this.instructionIndex++;
      } else if (currentInstruction.name === 'jmp') {
        this.instructionIndex += currentInstruction.offset;
      } else {
        this.instructionIndex++;
      }
    }
    instructionCallback(this.accumulator, { name: 'exit', offset: 0, index: this.instructionIndex });
  }
}

export default class Day8 implements AocDay {
  private parseInstructions(input: string): Instruction[] {
    const result: Instruction[] = [];

    input.split('\n').forEach((line, index) => {
      const [name, offset] = line.split(' ');
      result.push({
        name,
        offset: Number(offset),
        index
      });
    })

    return result;
  }

  async run() {
    const input = await readFile('input/day8.input');

    const instructions = this.parseInstructions(input);

    // Part 1
    const computer = new Computer(instructions);
    try {
      const metInstructionIndices = new Set<number>();
      computer.run((accumulator, instruction) => {
        if (metInstructionIndices.has(instruction.index)) {
          throw new InfiniteLoopError(accumulator.toString());
        }
        metInstructionIndices.add(instruction.index);
      });
    } catch (error) {
      if (error instanceof InfiniteLoopError) {
        console.log(error.message);
      }
    }

    // Part 2
    const indicesToChange = [];
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].name === 'jmp' || instructions[i].name === 'nop') {
        indicesToChange.push(i);
      }
    }

    for (const i of indicesToChange) {
      const tmpInstructions = [...instructions];
      // Do not mutate the object directly as it will propagate to all instructions
      tmpInstructions[i] = {
        name: instructions[i].name === 'jmp' ? 'nop' : 'jmp',
        offset: instructions[i].offset,
        index: instructions[i].index
      };

      const computer = new Computer(tmpInstructions);
      try {
        const metInstructionIndices = new Set<number>();
        computer.run((accumulator, instruction) => {
          if (instruction.name === 'exit') {
            throw new ExitSuccess(accumulator.toString());
          }
          if (metInstructionIndices.has(instruction.index)) {
            throw new InfiniteLoopError(accumulator.toString());
          }
          metInstructionIndices.add(instruction.index);
        });
      } catch (error) {
        if (error instanceof ExitSuccess) {
          console.log(error.message);
        }
        if (error instanceof InfiniteLoopError) {
          continue;
        }
      }
    }
  }
}
