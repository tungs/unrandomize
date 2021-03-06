# unrandomize
`unrandomize` overrides `Math.random` with a seedable pseudorandom number generator. The generator uses the [xorshift128+ algorithm][xorshift], which is the built-in algorithm for [`Math.random()`][Math-random] in common web browsers since around 2015-2016.

### Why use this?
Programs that use [`Math.random()`][Math-random] can produce results that are hard to recreate, because the internal state used to generate those numbers is not directly accessible. By overriding [`Math.random`][Math-random] with a generator has an assignable and retrievable state, it's easier to recreate results. `unrandomize` uses the same initial state so until its state is seeded or set by the user, it produces the same series of numbers on every rerun.

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
By default, unrandomize already writes over [`Math.random`'s](#api-math-random) built-in pseudorandom number generator. To restore it, use [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random). Like the built-in [`Math.random`][Math-random], the overridden one returns a number between 0 and 1 with a uniform distribution.

To set a state from four 32-bit unsigned integers, use [`unrandomize.setState([state0, state1, state2, state3])`](#api-unrandomize-set-state).

To set a state from an integer or string based seed, use [`unrandomize.setSeed(seed)`](#api-unrandomize-set-seed).

## API
<a name="api-math-random" href="#api-math-random">#</a> **Math.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, based off of the selected number generator. By default, it uses the overridden seedable pseudorandom number generator. It can be changed by calling [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random) or [`unrandomize.useSeedableRandom()`](#api-use-seedable-random).

### <a name="api-class-generator" href="#api-class-generator">#</a> class: unrandomize.Generator
<a name="api-class-generator-constructor" href="#api-class-generator-constructor">#</a> constructor: [`new unrandomize.Generator(seed)`](#api-class-generator)
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the generator. Currently only 32 bits of the number is used.
  * returns: &lt;[Generator](#api-class-generator)&gt; a pseudorandom number generator that has an independent state from other generators

<a name="api-generator-random" href="#api-generator-random">#</a> **generator.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1

<a name="api-generator-set-seed" href="#api-generator-set-seed">#</a> **generator.setSeed(seed)**
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the generator. Currently only 32 bits of the number is used.

<a name="api-generator-set-seed-from-random" href="#api-generator-set-seed-from-random">#</a> **generator.setSeedFromRandom(upperLimit)**
  * `upperLimit` &lt;[number][]&gt; an integer representing the upper limit of the random seed. Defaults to 1000000000.
  * returns &lt;[number][]&gt; The number used as the seed for the generator.

Creates a random seed and then seeds the generator with it. Using [`new unrandomize.Generator(seed)`](#api-class-generator) or [`anotherGenerator.setSeed(seed)`](#api-generator-set-seed) with the returned value should recreate the generator.

<a name="api-generator-get-seed" href="#api-generator-get-seed">#</a> **generator.getSeed()**
  * returns  &lt;[number][] | [string][] | [null][] &gt; The number or string used as the seed for the generator. If there was no value used to seed or if the state was directly set, returns `null`.

<a name="api-generator-set-state" href="#api-generator-set-state">#</a> **generator.setState(state)**
  * state &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that are used as the 128-bit state of the generator.

<a name="api-generator-get-state" href="#api-generator-get-state">#</a> **generator.getState()**
  * returns &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that represent the 128-bit state of the generator.
  
_____

**unrandomize** automatically creates an internally used instance of a generator and maps the instance's methods onto the library. The overridden Math.random() uses this instance of a generator. The exception is [`unrandomize.random`](#api-unrandomize-random) which may use the built-in [`Math.random`][Math-random] if [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random) is called. [`unrandomize.seedableRandom`](#api-unrandomize-seedable-random) always uses the created instance's number generator.

<a name="api-unrandomize-random" href="#api-unrandomize-random">#</a> **unrandomize.random()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the user selected number generator (through [`unrandomize.useBuiltInRandom()`](#api-use-built-in-random) or [`unrandomize.useSeedableRandom()`](#api-use-seedable-random)).

<a name="api-unrandomize-built-in-random" href="#api-unrandomize-built-in-random">#</a> **unrandomize.builtInRandom()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the built-in number generator.

<a name="api-unrandomize-seedable-random" href="#api-unrandomize-seedable-random">#</a> **unrandomize.seedableRandom()**
  * returns: &lt;[number][]&gt; a number between 0 and 1, using the default instance of the seedable pseudorandom number generator.

<a name="api-unrandomize-set-seed" href="#api-unrandomize-set-seed">#</a> **unrandomize.setSeed(seed)**
  * `seed` &lt;[number][] | [string][]&gt; a number or string that serves to seed the state of the default generator. Currently only 32 bits of the number is used.

<a name="api-unrandomize-set-seed-from-random" href="#api-unrandomize-set-seed-from-random">#</a> **unrandomize.setSeedFromRandom(upperLimit)**
  * `upperLimit` &lt;[number][]&gt; an integer representing the upper limit of the random seed. Defaults to 1000000000.
  * returns &lt;[number][]&gt; The number used as the seed for the default generator.

Creates a random seed and then seeds the default generator with it. Using [`new unrandomize.Generator(seed)`](#api-class-generator) or [`anotherGenerator.setSeed(seed)`](#api-generator-set-seed) with the returned value should recreate the generator.

<a name="api-unrandomize-get-seed" href="#api-unrandomize-get-seed">#</a> **unrandomize.getSeed()**
  * returns &lt;[number][] | [string][] | [null][] &gt; The number or string used as the seed for the default generator. If there was no value used to seed or if the state was directly set, returns `null`.

<a name="api-unrandomize-set-state" href="#api-unrandomize-set-state">#</a> **unrandomize.setState(state)**
  * state &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that are used as the 128-bit state of the default generator.

<a name="api-unrandomize-get-state" href="#api-unrandomize-get-state">#</a> **unrandomize.getState()**
  * returns &lt;[Array][]&lt;[number][]&gt;&gt; An array of four 32-bit unsigned integers that represent the 128-bit state of the default generator.

_____

**unrandomize** also provides methods for selecting which pseudorandom number generator that [`Math.random()`](#api-math-random) uses:

<a name="api-use-built-in-random" href="#api-use-built-in-random">#</a> **unrandomize.useBuiltInRandom** reverts [`Math.random`](#api-math-random) to its built in function.

<a name="api-use-seedable-random" href="#api-use-seedable-random">#</a> **unrandomize.useSeedableRandom** overrides [`Math.random`](#api-math-random) to the default number generator instance.


[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#null_type
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[Math-random]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
[xorshift]: https://en.wikipedia.org/wiki/xorshift
