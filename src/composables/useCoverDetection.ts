import cv from '@techstark/opencv-js';

/**
 * Detect faces from the input image.
 * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
 * @param {cv.Mat} img Input image
 * @returns the modified image with detected faces drawn on it.
 */
export const detectCover = (img: cv.Mat): cv.Mat => {
  // const newImg = img.clone();
  const newImg = img;

  cv.cvtColor(newImg, newImg, cv.COLOR_RGBA2GRAY, 0);

  cv.adaptiveThreshold(newImg, newImg, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 2, 0);

  const tmp = new cv.Mat();
  const contours = new cv.MatVector();
  cv.findContours(newImg, contours, tmp, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  cv.drawContours(newImg, contours, 0, [0, 255, 0, 255], 2);

  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
  const opening = new cv.Mat();
  cv.morphologyEx(newImg, opening, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 4);

  const finalContours = new cv.MatVector();
  cv.findContours(opening, finalContours, tmp, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  cv.drawContours(newImg, finalContours, 0, [0, 255, 255, 255], 2);
  return newImg;
};

export const onImageLoaded = async (image: HTMLCanvasElement): Promise<void> => {
  try {
    image.getContext('2d')?.drawImage(document.querySelector('img')!, 0, 0, 300, 150);
    const img = cv.imread(image);
    cv.imshow(image, detectCover(img));

    img.delete();
  } catch (error) {
    console.log(error);
  }
};
