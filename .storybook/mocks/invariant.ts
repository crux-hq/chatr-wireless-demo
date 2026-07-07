function invariant(
  condition: unknown,
  format?: string,
  ...args: unknown[]
): asserts condition {
  if (!condition) {
    if (format === undefined) {
      throw new Error('Invariant violation');
    }

    let index = 0;
    throw new Error(format.replace(/%s/g, () => String(args[index++])));
  }
}

export default invariant;
