export function calculatePrice(minutes) {
  if (minutes <= 100) return 50;
  const extra = minutes - 100;
  const blocks = Math.ceil(extra / 30);
  return 50 + blocks * 25;
}
