export const generateGameMultiplier = () => {
  const maxElapsedTime = 30000;
  const randomElapsedTime = Math.random() * maxElapsedTime;
  return parseFloat(Math.exp(0.00006 * randomElapsedTime).toFixed(2));
};
