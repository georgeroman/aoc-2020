import { AocDay } from '.';
import { readFile } from './utils';

interface TicketData {
  gathered: {
    name: string;
    validRanges: number[][];
  }[],
  mine: number[],
  others: number[][]
}

export default class Day16 implements AocDay {
  private parseTicketData(input: string): TicketData {
    const result: TicketData = {
      gathered: [],
      mine: [],
      others: []
    };

    const lines = input.split('\n');

    let i = 0;
    for (i; i < lines.length; i++) {
      if (lines[i] === '') break;

      const matches = /^([^:]+): (\d+)-(\d+) or (\d+)-(\d+)$/.exec(lines[i]);
      if (matches) {
        result.gathered.push({
          name: matches[1],
          validRanges: [
            [Number(matches[2]), Number(matches[3])],
            [Number(matches[4]), Number(matches[5])]
          ]
        });
      }
    }

    i++; i++;
    result.mine = lines[i].split(',').map(Number);

    i++; i++; i++;
    for (i; i < lines.length; i++) {
      result.others.push(lines[i].split(',').map(Number));
    }

    return result;
  }

  async run() {
    const input = await readFile('input/day16.input');

    const ticketData = this.parseTicketData(input);
    
    // Part 1
    const ranges: number[][] = [];
    for (const { validRanges } of ticketData.gathered) {
      ranges.push(...validRanges);
    }

    let invalidTickets: number[] = [];
    let errorRate = 0;
    for (let i = 0; i < ticketData.others.length; i++) {
      for (const field of ticketData.others[i]) {
        let valid = false;
        for (const [start, end] of ranges) {
          if (start <= field && field <= end) {
            valid = true;
            break;
          }
        }
        if (!valid) {
          errorRate += field;
          invalidTickets.push(i);
        }
      }
    }

    console.log(errorRate);

    // Part 2
    let validTickets = [
      ticketData.mine,
      ...ticketData.others.filter((_, i) => !invalidTickets.includes(i))
    ];
    
    const fieldValues: number[][] = [];
    for (const ticket of validTickets) {
      for (let i = 0; i < ticket.length; i++) {
        if (fieldValues.length <= i) fieldValues.push([]);
        fieldValues[i].push(ticket[i]);
      }
    }
    
    const fieldToMatchingIndices: { [key: string]: number[] } = {};
    for (let i = 0; i < fieldValues.length; i++) {
      for (const { name, validRanges } of ticketData.gathered) {
        let allMatch = true;
        for (const field of fieldValues[i]) {
          let match = validRanges.some(([start, end]) => start <= field && field <= end);
          if (!match) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          if (!(name in fieldToMatchingIndices)) {
            fieldToMatchingIndices[name] = [];
          }
          fieldToMatchingIndices[name].push(i);
        }
      }
    }
    
    const orderedFields = Object.entries(fieldToMatchingIndices)
      .sort(([, aIndices], [, bIndices]) => aIndices.length - bIndices.length);
    
    const fieldToIndex: { [key: string]: number} = {};
    const handledIndices: number[] = [];
    for (const [field, indices] of orderedFields) {
      fieldToIndex[field] = indices.filter(i => !handledIndices.includes(i))[0];
      handledIndices.push(fieldToIndex[field]);
    }

    console.log(
      Object.entries(fieldToIndex).reduce((acc, [field, index]) => (
        field.startsWith('departure') ? acc * ticketData.mine[index] : acc
      ), 1)
    );
  }
}
