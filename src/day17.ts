import { AocDay } from '.';
import { readFile } from './utils';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

const point3DToString = (point: Point3D): string => (
  `${point.x},${point.y},${point.z}`
);

const point4DToString = (point: Point4D): string => (
  `${point.x},${point.y},${point.z},${point.w}`
);

const stringToPoint3D = (string: string): Point3D => {
  const [x, y, z] = string.split(',').map(Number);
  return { x, y, z };
};

const stringToPoint4D = (string: string): Point4D => {
  const [x, y, z, w] = string.split(',').map(Number);
  return { x, y, z, w };
};

const getBounds = (nums: number[]): number[] => (
  [Math.min(...nums) - 1, Math.max(...nums) + 1]
);

export default class Day17 implements AocDay {
  private parsePoints3D(input: string): Point3D[] {
    const result: Point3D[] = [];

    const lines = input.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '#') {
          result.push({
            x: j,
            y: i,
            z: 0
          });
        }
      }
    }

    return result;
  }

  private parsePoints4D(input: string): Point4D[] {
    const result: Point4D[] = [];

    const lines = input.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '#') {
          result.push({
            x: j,
            y: i,
            z: 0,
            w: 0
          });
        }
      }
    }

    return result;
  }

  private getNeighbors3D(point: Point3D): Point3D[] {
    const result: Point3D[] = [];

    for (let xDiff = -1; xDiff <= 1; xDiff++) {
      for (let yDiff = -1; yDiff <= 1; yDiff++) {
        for (let zDiff = -1; zDiff <= 1; zDiff++) {
          if (xDiff !== 0 || yDiff !== 0 || zDiff !== 0) {
            result.push({
              x: point.x + xDiff,
              y: point.y + yDiff,
              z: point.z + zDiff
            });
          }
        }
      }
    }

    return result;
  }

  private getNeighbors4D(point: Point4D): Point4D[] {
    const result: Point4D[] = [];

    for (let xDiff = -1; xDiff <= 1; xDiff++) {
      for (let yDiff = -1; yDiff <= 1; yDiff++) {
        for (let zDiff = -1; zDiff <= 1; zDiff++) {
          for (let wDiff = -1; wDiff <= 1; wDiff++) {
            if (xDiff !== 0 || yDiff !== 0 || zDiff !== 0 || wDiff !== 0) {
              result.push({
                x: point.x + xDiff,
                y: point.y + yDiff,
                z: point.z + zDiff,
                w: point.w + wDiff
              });
            }
          }
        }
      }
    }

    return result;
  }

  async run() {
    const input = await readFile('input/day17.input');

    // Part 1
    const initialPoints3D = this.parsePoints3D(input);
    
    let activeCubes3D = new Set<string>();
    for (const cube of initialPoints3D) {
      activeCubes3D.add(point3DToString(cube));
    }

    for (let i = 0; i < 6; i++) {
      const points = [...activeCubes3D.keys()].map(stringToPoint3D);
      const [minX, maxX] = getBounds(points.map(({ x }) => x));
      const [minY, maxY] = getBounds(points.map(({ y }) => y));
      const [minZ, maxZ] = getBounds(points.map(({ z }) => z));
      
      const activeCubes3DCopy = new Set<string>(activeCubes3D);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            const currentPoint = { x, y, z };
            const neighbors = this.getNeighbors3D(currentPoint);
            const numActiveNeighbors =
              neighbors
                .filter(neighbor => activeCubes3D.has(point3DToString(neighbor)))
                .length;

            if (activeCubes3D.has(point3DToString(currentPoint))) {
              if (numActiveNeighbors !== 2 && numActiveNeighbors !== 3) {
                activeCubes3DCopy.delete(point3DToString(currentPoint));
              }
            } else if (numActiveNeighbors === 3) {
              activeCubes3DCopy.add(point3DToString(currentPoint));
            }
          }
        }
      }

      activeCubes3D = activeCubes3DCopy;
    }

    console.log(activeCubes3D.size);

    // Part 2
    const initialPoints4D = this.parsePoints4D(input);
    
    let activeCubes4D = new Set<string>();
    for (const cube of initialPoints4D) {
      activeCubes4D.add(point4DToString(cube));
    }

    for (let i = 0; i < 6; i++) {
      const points = [...activeCubes4D.keys()].map(stringToPoint4D);
      const [minX, maxX] = getBounds(points.map(({ x }) => x));
      const [minY, maxY] = getBounds(points.map(({ y }) => y));
      const [minZ, maxZ] = getBounds(points.map(({ z }) => z));
      const [minW, maxW] = getBounds(points.map(({ w }) => w));
      
      const activeCubes4DCopy = new Set<string>(activeCubes4D);
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            for (let w = minW; w <= maxW; w++) {
              const currentPoint = { x, y, z, w };
              const neighbors = this.getNeighbors4D(currentPoint);
              const numActiveNeighbors =
                neighbors
                  .filter(neighbor => activeCubes4D.has(point4DToString(neighbor)))
                  .length;

              if (activeCubes4D.has(point4DToString(currentPoint))) {
                if (numActiveNeighbors !== 2 && numActiveNeighbors !== 3) {
                  activeCubes4DCopy.delete(point4DToString(currentPoint));
                }
              } else if (numActiveNeighbors === 3) {
                activeCubes4DCopy.add(point4DToString(currentPoint));
              }
            }
          }
        }
      }

      activeCubes4D = activeCubes4DCopy;
    }

    console.log(activeCubes4D.size);
  }
}
