# unrandomize
Overrides Math.random with a seedable pseudorandom number generator. The generator uses the [xorshift128+ algorithm](https://en.wikipedia.org/wiki/xorshift), which is the built-in algorithm for `Math.random()` in common web browsers since around 2015-2016. 

### Why use this?
Exact results from programs using `Math.random()` can be hard to recreate. By overriding `Math.random` with one that has an assignable and retrievable state, it's easier to recreate results.

## Installing
### In Browser
#### From local files:
```
<script src="dist/unrandomize.js"></script>
```
#### From unpkg:
```
<script src="https://unpkg.com/unrandomize"></script>
```
### In Node
```
npm install unrandomize
```
#### Using as a module in CommonJS:
```
const unrandomize = require('unrandomize');
```
#### Using as a module in ECMAScript Modules (ESM):
```
import unrandomize from 'unrandomize';
```

## Usage
By default, unrandomize already writes over `Math.random`'s built-in pseudorandom number generator. To restore it, use `unrandomize.useBuiltInRandom();`. Like the built-in `Math.random`, the overridden one returns a number between 0 and 1 with a uniform distribution.

To set a state from four 32-bit unsigned integers, use `unrandomize.setState([state0, state1, state2, state3]);`

To set a state from an integer or string based seed, use `unrandomize.setSeed(seed)`.
