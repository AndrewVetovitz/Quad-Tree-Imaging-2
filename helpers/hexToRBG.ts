// from google search
export function hexToRgb(hex: string) {
  // Remove the '#' if it exists
  hex = hex.replace("#", "");

  // Parse the hex value into decimal red, green, and blue values
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an object
  return { red: red, green: green, blue: blue };
}
