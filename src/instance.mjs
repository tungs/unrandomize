import { Generator } from './pseudorandom-number-generator.mjs';

export var instance = new Generator();
export var seedableRandom = instance.random.bind(instance);
export var setSeed = instance.setSeed.bind(instance);
export var getSeed = instance.getSeed.bind(instance);
export var seedWithRandom = instance.seedWithRandom.bind(instance);
export var setState = instance.setState.bind(instance);
export var getState = instance.getState.bind(instance);
