export const generateTargetGameOdds = () => {
  const maxElapsedTime = 80000;
  const randomElapsedTime = Math.random() * maxElapsedTime;
  return Math.exp(0.00006 * randomElapsedTime).toFixed(2);
};
