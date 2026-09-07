import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePrice, priceTotal, sumPrices, comparePrices } from './price.js';

test('accepts existing numeric prices and editable ranges', () => {
  assert.deepEqual(parsePrice(150), { min: 150, max: 150 });
  assert.equal(priceTotal(' 150 - 200 '), '150-200');
  assert.equal(priceTotal('150–200'), '150-200');
  assert.equal(priceTotal('0'), '0');
  for (const value of ['', ' ', '150-', '200-150', '-150', 'abc', '150-200-300', '1.234']) {
    assert.equal(parsePrice(value), null);
  }
});

test('cart totals preserve both bounds and decimal accuracy', () => {
  assert.equal(priceTotal('150-200', 2), '300-400');
  assert.equal(sumPrices([{ price: '150-200', quantity: 2 }, { price: 50, quantity: 1 }]), '350-450');
  assert.equal(sumPrices([{ price_at_time: 0.1, quantity: 3 }], 'price_at_time'), '0.3');
  assert.equal(sumPrices([]), '0');
  assert.equal(priceTotal('150-150'), '150');
});

test('catalog sorts ranges by their lower price', () => {
  assert.deepEqual([{ price: '150-200' }, { price: 50 }, { price: null }].sort(comparePrices).map(p => p.price), [null, 50, '150-200']);
});
