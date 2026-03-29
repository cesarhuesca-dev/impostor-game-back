export const safeJsonParse = (value: string) =>  {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}