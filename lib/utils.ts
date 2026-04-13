export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function isEven(number: number) {
  return number % 2 === 0;
}

export function groupInPairs<T>(array: T[]): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += 2) {
    result.push(array.slice(i, i + 2));
  }

  return result;
}
