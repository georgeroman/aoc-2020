import { AocDay } from '.';
import { readFile } from './utils';

export default class Day20 implements AocDay {
  private parseTiles(input: string): { [key: number]: string[] } {
    const tiles: { [key: number]: string[] } = {};

    let currentTileId: number = -1;
    let currentTile: string[] = [];
    for (const line of (input + '\n').split('\n')) {
      if (line === '') {
        tiles[currentTileId] = currentTile;
        currentTileId = -1;
        currentTile = [];
      } else if (line.startsWith('Tile')) {
        currentTileId = Number(line.split(' ')[1].slice(0, 4));
      } else {
        currentTile.push(line);
      }
    }

    return tiles;
  }

  async run() {
    const input = await readFile('input/day20.input');

    const tiles = this.parseTiles(input);

    const getBorders = (tile: string[]): string[] => {
      const upperBorder = tile[0];
      const lowerBorder = tile[tile.length - 1];

      let leftBorder = '', rightBorder = '';
      for (const row of tile) {
        leftBorder += row[0];
        rightBorder += row[row.length - 1];
      }

      return [upperBorder, leftBorder, lowerBorder, rightBorder];
    };

    // Part 1
    const tileBorders: { [key: number]: string[] } = {};
    const tileBorderToTileIds: { [key: string]: number[] } = {};
    for (const [tileId, tile] of Object.entries(tiles)) {
      tileBorders[Number(tileId)] = getBorders(tile);
      for (const border of tileBorders[Number(tileId)]) {
        if (!(border in tileBorderToTileIds)) {
          tileBorderToTileIds[border] = [];
        }
        tileBorderToTileIds[border].push(Number(tileId));
      }
    }

    const tilesAtBorder: { [key: number]: string[] } = {};
    let borderProduct = 1;
    for (const tileId of Object.keys(tileBorders)) {
      let uniqueBorders: string[] = [];
      for (const border of tileBorders[Number(tileId)]) {
        const reverseBorder = [...border].reverse().join('');
        if ((tileBorderToTileIds[border].length === 1
              && (tileBorderToTileIds[reverseBorder] || []).length === 0)
            || (tileBorderToTileIds[border].length === 0
              && (tileBorderToTileIds[reverseBorder] || []).length === 1)
        ) {
          uniqueBorders.push(border);
        }
      }
      if (uniqueBorders.length === 2) {
        tilesAtBorder[Number(tileId)] = uniqueBorders;
        borderProduct *= Number(tileId);
      }
    }
    console.log(borderProduct);

    // Part 2
    const rotate = (tile: string[]): string[] => {
      // Rotate 90 degrees clockwise
      const tmpTile = tile.map(row => row.split(''));
      const tmpResult = tmpTile[0].map((_, index) => tmpTile.map(row => row[index]).reverse());
      return tmpResult.map(row => row.join(''));
    };

    const generateFlips = (tile: string[]): string[][] => (
      [
        // No flip
        tile,
        // Flip vertically
        [...tile].reverse(),
        // Flip horizontally
        [...tile].map(row => row.split('').reverse().join(''))
      ]
    );

    const rotateToMatchUpperAndLeftBorder = (
      tile: string[],
      upperBorder: string,
      leftBorder: string
    ): string[] => {
      for (let flipped of generateFlips(tile)) {
        let count = 0;
        let [myUpperBorder, myLeftBorder, ] = getBorders(flipped);
        while (upperBorder !== myUpperBorder && leftBorder !== myLeftBorder && count < 4) {
          flipped = rotate(flipped);
          [myUpperBorder, myLeftBorder, ] = getBorders(flipped);
          count++;
        }
        if (count < 4) {
          return flipped;
        }
      }
      return [];
    };

    const rotateToMatchLeftBorder = (
      tile: string[],
      leftBorder: string
    ): string[] => {
      for (let flipped of generateFlips(tile)) {
        let count = 0;
        let [, myLeftBorder, ] = getBorders(flipped);
        while (leftBorder !== myLeftBorder && count < 4) {
          flipped = rotate(flipped);
          [, myLeftBorder, ] = getBorders(flipped);
          count++;
        }
        if (count < 4) {
          return flipped;
        }
      }
      return [];
    };

    const rotateToMatchUpperBorder = (
      tile: string[],
      upperBorder: string
    ): string[] => {
      for (let flipped of generateFlips(tile)) {
        let count = 0;
        let [myUpperBorder, ] = getBorders(flipped);
        while (upperBorder !== myUpperBorder && count < 4) {
          flipped = rotate(flipped);
          [myUpperBorder, ] = getBorders(flipped);
          count++;
        }
        if (count < 4) {
          return flipped;
        }
      }
      return [];
    };

    const imageSize = Math.sqrt(Object.keys(tiles).length);
    const image: string[][][] = [];
    for (let i = 0; i < imageSize; i++) {
      image.push([]);
      for (let j = 0; j < imageSize; j++) {
        image[i].push([]);
      }
    }

    // Start from a random border tile - it doesn't matter since we can flip & rotate as we want
    let [startTileId, [upperBorder, leftBorder]] = Object.entries(tilesAtBorder)[0];

    const trySolve = (leftBorder: string, upperBorder: string) => {
      image[0][0] = tiles[Number(startTileId)];
      image[0][0] = rotateToMatchUpperAndLeftBorder(image[0][0], upperBorder, leftBorder);
  
      const usedTiles = new Set<string>([startTileId]);
      for (let i = 0; i < imageSize; i++) {
        for (let j = 0; j < imageSize; j++) {
          if (i == 0 && j == 0) {
            continue;
          }
          if (i == 0) {
            const [,,, rightBorder] = getBorders(image[i][j - 1]);
            for (const [tileId, tile] of Object.entries(tiles)) {
              if (usedTiles.has(tileId)) continue;
              const rotated = rotateToMatchLeftBorder(tile, rightBorder);
              if (rotated.length !== 0) {
                image[i][j] = rotated;
                usedTiles.add(tileId);
                break;
              }
            }
          } else if (j == 0) {
            const [,, lowerBorder, ] = getBorders(image[i - 1][j]);
            for (const [tileId, tile] of Object.entries(tiles)) {
              if (usedTiles.has(tileId)) continue;
              const rotated = rotateToMatchUpperBorder(tile, lowerBorder);
              if (rotated.length !== 0) {
                image[i][j] = rotated;
                usedTiles.add(tileId);
                break;
              }
            }
          } else {
            const [,, lowerBorder, ] = getBorders(image[i - 1][j]);
            const [,,, rightBorder] = getBorders(image[i][j - 1]);
            for (const [tileId, tile] of Object.entries(tiles)) {
              if (usedTiles.has(tileId)) continue;
              const rotated = rotateToMatchUpperAndLeftBorder(tile, lowerBorder, rightBorder);
              if (rotated.length !== 0) {
                image[i][j] = rotated;
                usedTiles.add(tileId);
                break;
              }
            }
          }
        }
      }
  
      const removeBorders = (tile: string[]): string[] => (
        tile.map(row => row.slice(1, row.length - 1))
          .slice(1, tile.length - 1)
      );
  
      let imageWithoutBorders: string[] = [];
      for (const row of Object.values(image).map(row => row.map(removeBorders))) {
        const rowWithoutBorders: string[] = [];
        for (let i = 0; i < row[0].length; i++) {
          rowWithoutBorders.push('');
          for (let k = 0; k < row.length; k++) {
            rowWithoutBorders[i] += row[k][i];
          }
        }
        imageWithoutBorders = [...imageWithoutBorders, ...rowWithoutBorders];
      }
  
      const countSeaMonsters = (image: string[]): Set<string> => {
        let seaMonsterIndices = new Set<string>();
        for (let i = 0; i < image.length - 3; i++) {
          for (let j = 0; j < image[i].length - 20; j++) {
            if (image[i][j + 18] === '#'
                && image[i + 1][j] === '#'
                && image[i + 1][j + 5] === '#'
                && image[i + 1][j + 6] === '#'
                && image[i + 1][j + 11] === '#'
                && image[i + 1][j + 12] === '#'
                && image[i + 1][j + 17] === '#'
                && image[i + 1][j + 18] === '#'
                && image[i + 1][j + 19] === '#'
                && image[i + 2][j + 1] === '#'
                && image[i + 2][j + 4] === '#'
                && image[i + 2][j + 7] === '#'
                && image[i + 2][j + 10] === '#'
                && image[i + 2][j + 13] === '#'
                && image[i + 2][j + 16] === '#'
            ) {
              seaMonsterIndices.add(`${i},${j + 18}`);
              seaMonsterIndices.add(`${i + 1},${j}`);
              seaMonsterIndices.add(`${i + 1},${j + 5}`);
              seaMonsterIndices.add(`${i + 1},${j + 6}`);
              seaMonsterIndices.add(`${i + 1},${j + 11}`);
              seaMonsterIndices.add(`${i + 1},${j + 12}`);
              seaMonsterIndices.add(`${i + 1},${j + 17}`);
              seaMonsterIndices.add(`${i + 1},${j + 18}`);
              seaMonsterIndices.add(`${i + 1},${j + 19}`);
              seaMonsterIndices.add(`${i + 2},${j + 1}`);
              seaMonsterIndices.add(`${i + 2},${j + 4}`);
              seaMonsterIndices.add(`${i + 2},${j + 7}`);
              seaMonsterIndices.add(`${i + 2},${j + 10}`);
              seaMonsterIndices.add(`${i + 2},${j + 13}`);
              seaMonsterIndices.add(`${i + 2},${j + 16}`);
            }
          }
        }
        return seaMonsterIndices;
      };
  
      for (let flipped of generateFlips(imageWithoutBorders)) {
        let count = 0;
        let mySeaMonsterIndices = countSeaMonsters(flipped);
        while (mySeaMonsterIndices.size === 0 && count < 4) {
          flipped = rotate(flipped);
          mySeaMonsterIndices = countSeaMonsters(flipped);
          count++;
        }
        if (count < 4) {
          console.log(
            imageWithoutBorders
              .map(row => row.split('').filter(c => c === '#').length)
              .reduce((acc, count) => acc + count, 0)
            - mySeaMonsterIndices.size
          );
          return;
        }
      }

      throw new Error('No solution');
    };

    // There are two options for setting the borders of the first tile
    // Try both of them and pick the one that works
    try {
      trySolve(upperBorder, leftBorder);
    } catch {
      trySolve(leftBorder, upperBorder);
    }
  }
}
