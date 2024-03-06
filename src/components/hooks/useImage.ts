
import React, {useState} from 'react'
export const useImage = (src: string) => {
  const [image] = useState(() => {
    const img = new Image();
    img.src = src;
    return img;
  });
  return image;
};
