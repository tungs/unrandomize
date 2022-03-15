# unrandomize
Overrides Math.random with a seedable pseudorandom number generator. The generator uses the [xorshift128+ algorithm](https://en.wikipedia.org/wiki/xorshift), which is the built-in algorithm for `Math.random()` in 
common web browsers since around 2015-2016.

File can be found in `dist/unrandomize.js`.