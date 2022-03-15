# unrandomize
Overrides Math.random with a seedable pseudorandom number generator. The generator uses the [xorshift128+ algorithm](https://en.wikipedia.org/wiki/xorshift), which is the built-in algorithm for [`Math.random()`][] in common web browsers since around 2015-2016. 

### Why use this?
Programs that use [`Math.random()`][] can produce results that are hard to recreate, because the internal state used to generate those numbers is not directly accessible. By overriding `Math.random` with one that has the same initial state, and an assignable and retrievable state, it's easier to recreate results.

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
By default, unrandomize already writes over `Math.random`'s built-in pseudorandom number generator. To restore it, use [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random). Like the built-in `Math.random`, the overridden one returns a number between 0 and 1 with a uniform distribution.

To set a state from four 32-bit unsigned integers, use [`unrandomize.setState([state0, state1, state2, state3])`](#api-unrandomize-set-state).

To set a state from an integer or string based seed, use [`unrandomize.setSeed(seed)`](#api-unrandomize-set-seed).

## API
<a name="api-math-random" href="#api-math-random">#</a> **Math.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, based off of the selected number generator. By default uses the overridden seedable pseudorandom number generator. Can be changed by calling `unrandomize.useBuiltInRandom()` or `unrandomize.useSeedableRandom()`.

### <a name="api-class-generator" href="#api-class-generator">#</a> class: unrandomize.Generator
constructor: `new unrandomize.Generator(seed)`
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the generator. Currently only 32 bits of the number is used.
  * returns: &lt;[Generator](#api-class-generator)&gt; a pseudorandom number generator that has an independent state from other generators

<a name="api-generator-random" href="#api-generator-random">#</a> **generator.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1

<a name="api-generator-set-seed" href="#api-generator-set-seed">#</a> **generator.setSeed(seed)**
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the generator. Currently only 32 bits of the number is used.

<a name="api-generator-set-seed-from-random" href="#api-generator-set-seed-from-random">#</a>**generator.setSeedFromRandom(upperLimit)**
  * `upperLimit` &lt;[number][]&gt; an integer representing the upper limit of the random seed. Defaults to 1000000000.
  * returns &lt;[number][]&gt; The number used as the seed for the generator.

Creates a random seed and then seeds the generator with it. Using `new unrandomize.Generator(seed)` or `anotherGenerator.setSeed(seed)` with the returned value should recreate the generator.

<a name="api-generator-get-seed" href="#api-generator-get-seed">**generator.getSeed()**
  * returns  &lt;[number][] | [string][] | [null][] &gt; The number or string used as the seed for the generator. If there was no value used to seed or if the state was directly set, returns `null`.

<a name="api-generator-set-state" href="#api-generator-set-state">**generator.setState(state)**
  * state &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that are used as the 128-bit state of the generator.

<a name="api-generator-get-state" href="#api-generator-get-state">**generator.getState()**
  * returns &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that represent the 128-bit state of the generator.
  
  
**unrandomize** automatically creates an internally used instance of a generator and maps the instance's methods onto the library. The overridden Math.random() uses this instance of a generator. The exception is [`unrandomize.random`](#api-unrandomize-random) which may use the built-in `Math.random` if [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random) is called. [`unrandomize.seedableRandom`](#api-unrandomize-seedable-random) always uses the created instance's number generator.

<a name="api-unrandomize-random" href="#api-unrandomize-random">#</a> **unrandomize.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the user selected number generator (through `unrandomize.useBuiltInRandom()` or `unrandomize.useSeedableRandom()`).

<a name="api-unrandomize-built-in-random" href="#api-unrandomize-built-in-random">#</a> **unrandomize.builtInRandom()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the built-in number generator.

<a name="api-unrandomize-seedable-random" href="#api-unrandomize-seedable-random">#</a> **unrandomize.seedableRandom()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the default instance of the seedable pseudorandom number generator.

<a name="api-unrandomize-set-seed" href="#api-unrandomize-set-seed">#</a> **unrandomize.setSeed(seed)**
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the default generator. Currently only 32 bits of the number is used.

<a name="api-unrandomize-set-seed-from-random" href="#api-unrandomize-set-seed-from-random">#</a> **unrandomize.setSeedFromRandom(upperLimit)**
  * `upperLimit` &lt;[number][]&gt; an integer representing the upper limit of the random seed. Defaults to 1000000000.
  * returns &lt;[number][]&gt; The number used as the seed for the default generator.

Creates a random seed and then seeds the default generator with it. Using `new unrandomize.Generator(seed)` or `anotherGenerator.setSeed(seed)` with the returned value should recreate the generator.

<a name="api-unrandomize-get-seed" href="#api-unrandomize-get-seed">#</a> **unrandomize.getSeed()**
  * returns &lt;[number][] | [string][] | [null][] &gt; The number or string used as the seed for the default generator. If there was no value used to seed or if the state was directly set, returns `null`.

<a name="api-unrandomize-set-state" href="#api-unrandomize-set-state">#</a> **unrandomize.setState(state)**
  * state &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that are used as the 128-bit state of the default generator.

<a name="api-unrandomize-get-state" href="#api-unrandomize-get-state">#</a> **unrandomize.getState()**
  * returns &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that represent the 128-bit state of the default generator.

**unrandomize** also provides methods for selecting which random generator that `Math.random()` uses:

<a name="api-use-built-in-random" href="#api-use-built-in-random">#</a> **unrandomize.useBuiltInRandom** reverts `Math.random()` to use its built in function.

<a name="api-use-seedable-random" href="#api-use-seedable-random">#</a> **unrandomize.useSeedableRandom** overrides `Math.random()` to use the default number generator instance.


[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#null_type
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[`Math.random()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random