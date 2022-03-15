import { builtInRandom } from './built-in-random.mjs';
import { Generator } from './pseudorandom-number-generator.mjs';
import { seedableRandom } from './instance.mjs';
export { setSeed, getSeed, seedWithRandom, getState, setState } from './instance.mjs';
export { setBigIntState, getBigIntState } from './big-int.mjs';
export { Generator, builtInRandom, seedableRandom };
export function useBuiltInRandom() {
  Math.random = builtInRandom;
}
export function useSeedableRandom() {
  Math.random = seedableRandom;
}
export function random() {
  return Math.random();
}
export var generator = Generator;
useSeedableRandom();