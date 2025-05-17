// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

export function rgbToHex(red: number, green: number, blue: number) {
  // Return the RGB values as hex
  return "#" + componentTo2DigitHex(red) + componentTo2DigitHex(green) + componentTo2DigitHex(blue);
}

function componentTo2DigitHex(x: number) {
  const hex = x.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
