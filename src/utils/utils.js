export function calculatePct(current, total) {
  if (current > total)
    current = total;
  const expression = current / total;
  if (Number.isFinite(expression)) {
    return expression * 100;
  }
  return 0;
}
