/**
 *
 * MIT License
 *
 * Copyright (c) 2018-2022, Steve Tung
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.unrandomize = {}));
})(this, (function (exports) { 'use strict';

  var builtInRandom = Math.random.bind(Math);

  var shift1 = 23;
  var shift2 = 17;
  var shift3 = 26;
  // unrandomizer seed constants
  // default seed values are only used if all of the seed values end up being 0
  // initial states near 0 yield converted numbers close to 0, so we may want
  // to use bigger seeds to avoid this
  var defaultSeed1 = 10 << 25;
  var defaultSeed2 = 20 << 25;
  var defaultSeed3 = 30 << 25;
  var defaultSeed4 = 40 << 25;
  var randomSeedLimit = 1000000000;
  // initial states set with sparse data seem to be biased toward
  // low numbers initially, so we probably should iterate a few times
  var scrambleIterations = 25;
  var byteLimit = Math.pow(2, 32);
  var mantissaLimit = Math.pow(2, 53);

  function Generator(initState) {
    if (!(this instanceof Generator)) {
      return new Generator(initState);
    }
    this.state = new ArrayBuffer(16);
    this.stateSInts = new Int32Array(this.state);
    this.stateUInt = new Uint32Array(this.state);
    this.setSeed(initState);
  }
  Generator.prototype.verifyState = function () {
    if (!this.stateSInts[0] && !this.stateSInts[1] && !this.stateSInts[2] && !this.stateSInts[3]) {
      // if the states are all zero, it does not advance to a new state
      // in this case, set the states to the default seeds
      this.setState([ defaultSeed1, defaultSeed2, defaultSeed3, defaultSeed4 ]);
    }
  };
  Generator.prototype.xorshift128 = function () {
    let xA = this.stateSInts[2];
    let xB = this.stateSInts[3];
    let yA = this.stateSInts[0];
    let yB = this.stateSInts[1];

    yA = yA ^ ((yA << shift1) | (yB >>> (32 - shift1)));
    yB = yB ^ (yB << shift1);

    yB = yB ^ ((yA << (32 - shift2)) | (yB >>> shift2));
    yA = yA ^ (yA >>> shift2);

    yA = yA ^ xA;
    yB = yB ^ xB;

    yB = yB ^ ((xA << (32 - shift3)) | (xB >>> shift3));
    yA = yA ^ (xA >>> shift3);

    this.stateSInts[0] = xA;
    this.stateSInts[1] = xB;
    this.stateSInts[2] = yA;
    this.stateSInts[3] = yB;
  };
  Generator.prototype.statesToDouble = function () {
    let aSum = this.stateUInt[0] + this.stateUInt[2];
    let bSum = this.stateUInt[1] + this.stateUInt[3];
    if (bSum >= byteLimit) {
      aSum = aSum + 1;
      bSum -= byteLimit;
    }
    aSum = aSum & 0x001FFFFF;
    return (aSum * byteLimit + bSum) / mantissaLimit;
  };
  Generator.prototype.seedWithRandom = function (upperLimit) {
    upperLimit = upperLimit || randomSeedLimit;
    var seed = Math.floor(builtInRandom() * upperLimit) + 1;
    this.setSeed(seed);
    return seed;
  };
  Generator.prototype.setState = function (state) {
    this.seed = null;
    this.stateUInt[0] = state[0] || 0;
    this.stateUInt[1] = state[1] || 0;
    this.stateUInt[2] = state[2] || 0;
    this.stateUInt[3] = state[3] || 0;
    this.verifyState();
  };
  Generator.prototype.getState = function () {
    return [this.stateUInt[0], this.stateUInt[1], this.stateUInt[2], this.stateUInt[3]];
  };
  Generator.prototype.getSeed = function () {
    return this.seed;
  };
  Generator.prototype.setSeed = function (seed) {
    var bytes, i;
    this.seed = seed;
    if (typeof seed === 'number') {
      this.setState([ seed, 0, 0, 0 ]);
      // setState resets seed
      this.seed = seed;
      for (i = 0; i < scrambleIterations; i++) {
        this.xorshift128();
      }
    } else if (typeof seed === 'string') {
      bytes = new Uint8Array(this.state);
      for (i = 0; i < 16; i++) {
        bytes[i] = 0;
      }
      for (i = 0; i < seed.length; i++) {
        bytes[i % 16] = bytes[i % 16] ^ seed.charCodeAt(i);
      }
      for (i = 0; i < scrambleIterations; i++) {
        this.xorshift128();
      }
    }
    this.verifyState();
  };
  Generator.prototype.random = function () {
    this.xorshift128();
    return this.statesToDouble();
  };

  var instance = new Generator();
  var seedableRandom = instance.random.bind(instance);
  var setSeed = instance.setSeed.bind(instance);
  var getSeed = instance.getSeed.bind(instance);
  var seedWithRandom = instance.seedWithRandom.bind(instance);
  var setState = instance.setState.bind(instance);
  var getState = instance.getState.bind(instance);

  /* global BigInt */

  Generator.prototype.setBigIntState = function (bState) {
    // just in case if the environment doesn't support BigInt,
    // we'll try to avoid unnecessary errors by only using it where it's needed
    var maskMod = BigInt(1) << BigInt(32);
    if (typeof bState !== 'bigint') {
      bState = BigInt(bState || 0);
    }
    // can also use BigInt.asUintN(32, bState << BigInt(96));
    this.setState([
      Number((bState >> BigInt(96)) % maskMod),
      Number((bState >> BigInt(64)) % maskMod),
      Number((bState >> BigInt(32)) % maskMod),
      Number(bState % maskMod)
    ]);
  };

  Generator.prototype.getBigIntState = function () {
    var a = (BigInt(this.stateUInt[0]) << BigInt(96));
    var b = (BigInt(this.stateUInt[1]) << BigInt(64));
    var c = (BigInt(this.stateUInt[2]) << BigInt(32));
    var d = (BigInt(this.stateUInt[3]));
    return a + b + c + d;
  };

  var setBigIntState = instance.setBigIntState.bind(instance);
  var getBigIntState = instance.getBigIntState.bind(instance);

  function useBuiltInRandom() {
    Math.random = builtInRandom;
  }
  function useSeedableRandom() {
    Math.random = seedableRandom;
  }
  function random() {
    return Math.random();
  }
  var generator = Generator;
  useSeedableRandom();

  var version = "0.1.0-prerelease";

  exports.Generator = Generator;
  exports.builtInRandom = builtInRandom;
  exports.generator = generator;
  exports.getBigIntState = getBigIntState;
  exports.getSeed = getSeed;
  exports.getState = getState;
  exports.random = random;
  exports.seedWithRandom = seedWithRandom;
  exports.seedableRandom = seedableRandom;
  exports.setBigIntState = setBigIntState;
  exports.setSeed = setSeed;
  exports.setState = setState;
  exports.useBuiltInRandom = useBuiltInRandom;
  exports.useSeedableRandom = useSeedableRandom;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
