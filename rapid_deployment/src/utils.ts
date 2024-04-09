export function generate() {
  const id = Math.random().toString(36).substring(2, 7);
  return id;
}