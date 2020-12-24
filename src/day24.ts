import { AocDay } from '.';
import { readFile } from './utils';

export default class Day24 implements AocDay {
  async run() {
    const input = await readFile('input/day24.input');

    const tiles = input.split('\n');

    // Part 1
    const numFlipped = new Map<string, number>();
    for (const tile of tiles) {
      let x = 0, y = 0;

      let i = 0;
      while (i < tile.length) {
        if (tile[i] === 'e') {
          x++; i++;
        } else if (tile[i] === 'w') {
          x--; i++;
        } else if (tile[i] === 's' && tile[i + 1] === 'e') {
          if (y % 2 !== 0) x++;
          y++; i++; i++;
        } else if (tile[i] === 's' && tile[i + 1] === 'w') {
          if (y % 2 === 0) x--;
          y++; i++; i++;
        } else if (tile[i] === 'n' && tile[i + 1] === 'e') {
          if (y % 2 !== 0) x++;
          y--; i++; i++;
        } else if (tile[i] === 'n' && tile[i + 1] === 'w') {
          if (y % 2 === 0) x--;
          y--; i++; i++;
        }
      }

      numFlipped.set(`${x},${y}`, (numFlipped.get(`${x},${y}`) || 0) + 1);
    }

    console.log([...numFlipped.values()].filter(num => num % 2 !== 0).length);

    // Part 2
    const getNeighbors = (x: number, y: number): string[] => {
      if (y % 2 === 0) {
        return [
          `${x - 1},${y}`,
          `${x + 1},${y}`,
          `${x},${y - 1}`,
          `${x},${y + 1}`,
          `${x - 1},${y - 1}`,
          `${x - 1},${y + 1}`
        ]
      } else {
        return [
          `${x - 1},${y}`,
          `${x + 1},${y}`,
          `${x},${y - 1}`,
          `${x},${y + 1}`,
          `${x + 1},${y - 1}`,
          `${x + 1},${y + 1}`
        ]
      }
    };

    for (let day = 0; day < 100; day++) {
      const tilesToFlip: string[] = [];

      let xValues = [...numFlipped.keys()].map(num => num.split(',').map(Number)[0]);
      let yValues = [...numFlipped.keys()].map(num => num.split(',').map(Number)[1]);
      let minX = Math.min(...xValues) - 1;
      let maxX = Math.max(...xValues) + 1;
      let minY = Math.min(...yValues) - 1;
      let maxY = Math.max(...yValues) + 1;

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          const tile = `${x},${y}`;
          const tileColor = numFlipped.get(tile) || 0;

          let numWhite = 0, numBlack = 0;
          for (const neighbor of getNeighbors(x, y)) {
            const [nx, ny] = neighbor.split(',').map(Number);
            if ((numFlipped.get(`${nx},${ny}`) || 0) % 2 === 0) {
              numWhite++;
            } else {
              numBlack++;
            }
          }
          if (tileColor % 2 === 0 && numBlack === 2) {
            tilesToFlip.push(tile);
          } else if (tileColor % 2 !== 0 && (numBlack === 0 || numBlack > 2)) {
            tilesToFlip.push(tile);
          }
        }
      }

      for (const tile of tilesToFlip) {
        numFlipped.set(tile, (numFlipped.get(tile) || 0) + 1);
      }
    }

    console.log([...numFlipped.values()].filter(num => num % 2 !== 0).length);
  }
}
