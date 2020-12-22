import { AocDay } from '.';
import { readFile } from './utils';

export default class Day21 implements AocDay {
  private parseInput(input: string): [number[], number[]] {
    const player1Deck: number[] = [];
    const player2Deck: number[] = [];

    const lines = input.split('\n');

    let i = 1;
    for (i; i < lines.length && lines[i] !== ''; i++) {
      player1Deck.push(Number(lines[i]));
    }
    i++; i++;
    for (i; i < lines.length; i++) {
      player2Deck.push(Number(lines[i]));
    }

    return [player1Deck, player2Deck];
  }

  async run() {
    const input = await readFile('input/day22.input');

    const [player1Deck, player2Deck] = this.parseInput(input);

    // Part 1
    const part1 = (player1Deck: number[], player2Deck: number[]) => {
      while (player1Deck.length !== 0 && player2Deck.length !== 0) {
        const [player1Card, player2Card] = [player1Deck.shift() as number, player2Deck.shift() as number];
        if (player1Card > player2Card) {
          player1Deck.push(player1Card, player2Card);
        } else {
          player2Deck.push(player2Card, player1Card);
        }
      }
  
      const winningDeck = player1Deck.length !== 0 ? player1Deck : player2Deck;
      console.log(
        winningDeck.reduce((acc, card, i) => acc + (winningDeck.length - i) * card, 0)
      );
    };
    part1([...player1Deck], [...player2Deck]);

    // Part 2
    const part2 = (player1Deck: number[], player2Deck: number[]) => {
      interface GameData {
        winningPlayer: number;
        winningDeck: number[];
      }
  
      const playGame = (player1Deck: number[], player2Deck: number[]): GameData => {
        const result = {
          winningPlayer: -1,
          winningDeck: [-1]
        };

        const previousDecks = new Set<string>();
        while (player1Deck.length !== 0 && player2Deck.length !== 0) {
          const currentDeck = player1Deck.map(card => `${card}`).join(',');
          if (previousDecks.has(currentDeck)) {
            result.winningPlayer = 1;
            result.winningDeck = player1Deck;
            return result;
          } else {
            previousDecks.add(currentDeck);
          }
  
          const [player1Card, player2Card] = [player1Deck.shift() as number, player2Deck.shift() as number];
          if (player1Deck.length >= player1Card && player2Deck.length >= player2Card) {
            const subGameResult = playGame(
              player1Deck.slice(0, player1Card),
              player2Deck.slice(0, player2Card)
            );
            if (subGameResult.winningPlayer === 1) {
              player1Deck.push(player1Card, player2Card);
            } else {
              player2Deck.push(player2Card, player1Card);
            }
          } else {
            if (player1Card > player2Card) {
              player1Deck.push(player1Card, player2Card);
            } else {
              player2Deck.push(player2Card, player1Card);
            }
          }
        }
  
        result.winningPlayer = player1Deck.length !== 0 ? 1 : 2;
        result.winningDeck = player1Deck.length !== 0 ? player1Deck : player2Deck;
        return result;
      }

      const winningDeck = playGame(player1Deck, player2Deck).winningDeck;
      console.log(
        winningDeck.reduce((acc, card, i) => acc + (winningDeck.length - i) * card, 0)
      );
    };
    part2([...player1Deck], [...player2Deck]);
  }
}
