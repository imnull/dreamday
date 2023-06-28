'use strict';

const componentWidget = require('..');
const assert = require('assert').strict;

assert.strictEqual(componentWidget(), 'Hello from componentWidget');
console.info('componentWidget tests passed');
