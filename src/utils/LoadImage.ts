export const loadImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image); 
    image.onerror = () =>
      reject(new Error(`Failed to load image at url: ${url}`));
  });
};
