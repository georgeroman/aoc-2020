import { AocDay } from '.';
import { readFile } from './utils';

export default class Day12 implements AocDay {
  async run() {
    const input = await readFile('input/day12.input');

    // Part 1
    let x = 0, y = 0;
    let facing = 'E';
    for (const line of input.split('\n')) {
      const action = line[0];
      const value = Number(line.slice(1));

      if (action === 'N') y += value;
      if (action === 'S') y -= value;
      if (action === 'W') x -= value;
      if (action === 'E') x += value;
      if (action === 'L') {
        const directions = ['E', 'N', 'W', 'S'];
        facing = directions[(directions.indexOf(facing) + Math.floor(value / 90)) % directions.length];
      }
      if (action === 'R') {
        const directions = ['E', 'S', 'W', 'N'];
        facing = directions[(directions.indexOf(facing) + Math.floor(value / 90)) % directions.length];
      }
      if (action === 'F') {
        if (facing === 'N') y += value;
        if (facing === 'S') y -= value;
        if (facing === 'W') x -= value;
        if (facing === 'E') x += value;
      }
    }
    console.log(Math.abs(x) + Math.abs(y));

    // Part 2
    let shipX = 0, shipY = 0;
    let waypointX = 10, waypointY = 1;
    for (const line of input.split('\n')) {
      const action = line[0];
      const value = Number(line.slice(1));

      if (action === 'N') waypointY += value;
      if (action === 'S') waypointY -= value;
      if (action === 'W') waypointX -= value;
      if (action === 'E') waypointX += value;
      if (action === 'F') {
        shipX += waypointX * value;
        shipY += waypointY * value;
      }
      if (action === 'L') {
        const rotateCounterClockwise = (x: number, y: number) => [-y, x];
        for (let i = 0; i < Math.floor(value / 90); i++) {
          [waypointX, waypointY] = rotateCounterClockwise(waypointX, waypointY);
        }
      }
      if (action === 'R') {
        const rotateClockwise = (x: number, y: number) => [y, -x];
        for (let i = 0; i < Math.floor(value / 90); i++) {
          [waypointX, waypointY] = rotateClockwise(waypointX, waypointY);
        }
      }
    }
    console.log(Math.abs(shipX) + Math.abs(shipY));
  }
}
