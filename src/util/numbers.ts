export function randomNumber(min: number = 0, max: number = 1) {
  return Math.floor(Math.random() * max) + min;
}

export function clamp(number: number, min = 0, max = 1) {
  if (number < min) return min;
  if (number > max) return max;
  return number;
}
