export function generateId(): string {
  const timestamp = Date.now();
  const randomComponent = Math.floor(Math.random() * 1000);
  return `${timestamp}${randomComponent}`.toString();
}

// Example usage:
// const userId = generateSimpleUserId();
// console.log(userId); // Output: something like "1683456789123456"
