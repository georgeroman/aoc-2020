import { AocDay } from '.';
import { readFile } from './utils';

interface Node {
  value: number;
  next: Node | null;
}

export default class Day23 implements AocDay {
  private simulate(cups: number[], numMoves: number): number[] {
    const initialCupsLength = cups.length;

    let currentCup = cups[0];
    for (let i = 0; i < numMoves; i++) {
      let currentCupIdx = cups.indexOf(currentCup);

      const threeCups: number[] = [];
      for (let k = 0; k < 3; k++) {
        threeCups.push(cups.splice((currentCupIdx + 1) % cups.length, 1)[0]);
        currentCupIdx = cups.indexOf(currentCup);
      }

      let destinationCup = currentCup - 1 > 0 ? currentCup - 1 : initialCupsLength;
      while (threeCups.includes(destinationCup)) {
        destinationCup = destinationCup - 1 > 0 ? destinationCup - 1 : initialCupsLength;
      }

      cups.splice(cups.indexOf(destinationCup) + 1, 0, ...threeCups);

      currentCupIdx = cups.indexOf(currentCup);
      currentCup = cups[(currentCupIdx + 1) % cups.length];
    }

    return cups;
  }

  private simulateFast(cupToNode: Map<number, Node>, numMoves: number, initialCup: number) {
    let currentCup = cupToNode.get(initialCup) as Node;
    for (let i = 0; i < numMoves; i++) {
      const initialCurrentCup = currentCup;

      const threeCups: number[] = [];
      for (let k = 0; k < 3; k++) {
        threeCups.push((currentCup.next as Node).value);
        currentCup = currentCup.next as Node;
      }
      currentCup = currentCup.next as Node;
      const threeCupsStart = cupToNode.get(threeCups[0]) as Node;
      const threeCupsEnd = cupToNode.get(threeCups[2]) as Node;

      let destinationCup = initialCurrentCup.value - 1 > 0 ? initialCurrentCup.value - 1 : cupToNode.size;
      while (threeCups.includes(destinationCup)) {
        destinationCup = destinationCup - 1 > 0 ? destinationCup - 1 : cupToNode.size;
      }

      initialCurrentCup.next = currentCup;
      threeCupsEnd.next = (cupToNode.get(destinationCup) as Node).next;
      (cupToNode.get(destinationCup) as Node).next = threeCupsStart;
    }
  }

  async run() {
    const input = await readFile('input/day23.input');

    const cups = input.split('').map(Number);

    // Part 1
    console.log(
      this.simulate([...cups], 100)
        .map(num => `${num}`)
        .join('')
        .split('1')
        .reverse()
        .join('')
    );

    // Part 2
    const cupToNode = new Map<number, Node>();

    const head: Node = {
      value: -1,
      next: null
    };

    let current = head;
    for (const cup of cups) {
      current.next = {
        value: cup,
        next: null
      };
      current = current.next;
      cupToNode.set(cup, current);
    }
    for (let cup = 10; cup <= 1000000; cup++) {
      current.next = {
        value: cup,
        next: null
      };
      current = current.next;
      cupToNode.set(cup, current);
    }
    current.next = cupToNode.get(cups[0]) as Node;

    this.simulateFast(cupToNode, 10000000, cups[0]);
    console.log(
      ((cupToNode.get(1) as Node).next as Node).value
      * (((cupToNode.get(1) as Node).next as Node).next as Node).value
    );
  }
}
