export const generateGameMultiplier = () => {
  const maxElapsedTime = 30000;
  const randomElapsedTime = Math.random() * maxElapsedTime;
  return Math.exp(0.00006 * randomElapsedTime).toFixed(2);

};
