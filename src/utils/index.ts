import BN from 'bn.js';
import * as fs from 'fs/promises';

export async function readFile(filename: string): Promise<string> {
  const input = await fs.readFile(filename);
  return input.toString();
}

export function bn(n: string | number | BN): BN {
  return new BN(n);
}
