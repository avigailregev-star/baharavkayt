export function parsePrice(value) {
  const match = String(value ?? '').trim().match(/^(\d+(?:\.\d{1,2})?)(?:\s*[-–—]\s*(\d+(?:\.\d{1,2})?))?$/);
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2] ?? match[1]);
  return Number.isFinite(min) && Number.isFinite(max) && max >= min ? { min, max } : null;
}

function formatRange(min, max) {
  const low = Number(min.toFixed(2));
  const high = Number(max.toFixed(2));
  return low === high ? String(low) : `${low}-${high}`;
}

export function priceTotal(value, quantity = 1) {
  const range = parsePrice(value);
  return range ? formatRange(range.min * quantity, range.max * quantity) : '0';
}

export function sumPrices(items, field = 'price') {
  const total = items.reduce((sum, item) => {
    const range = parsePrice(item[field]);
    return {
      min: sum.min + (range?.min ?? 0) * item.quantity,
      max: sum.max + (range?.max ?? 0) * item.quantity,
    };
  }, { min: 0, max: 0 });
  return formatRange(total.min, total.max);
}

export function comparePrices(a, b) {
  return (parsePrice(a.price)?.min ?? 0) - (parsePrice(b.price)?.min ?? 0);
}
