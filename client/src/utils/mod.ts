/**
 * @return the modulo of a and b, but always positive
 *
 * Examples:
 * mod(3, 5) = 3;
 * mod(-3, 5) = 2, because -3 % 5 = -3, but <0, so we add 5, and get 2
 *
 *  */
export default function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}
