export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));
}

export async function mockApiCall<T>(data: T, ms?: number): Promise<T> {
  await delay(ms);
  return data;
}
