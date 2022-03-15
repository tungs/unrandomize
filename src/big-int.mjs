/* global BigInt */
import { Generator } from './pseudorandom-number-generator.mjs';
import { instance } from './instance.mjs';

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

export var setBigIntState = instance.setBigIntState.bind(instance);
export var getBigIntState = instance.getBigIntState.bind(instance);