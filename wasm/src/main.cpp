#include <stdio.h>
#include <emscripten/emscripten.h>

int main() {
    printf("Hello World\n");
    return 0;
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE void myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
}

  // drawBorder(startx: number, starty: number, endx: number, endy: number, hexColor: string) {
  //   const { red, green, blue } = hexToRgb(hexColor);

  //   this.drawRect(startx, starty, startx + 1, endy, red, green, blue); // top
  //   this.drawRect(endx - 1, starty, endx, endy, red, green, blue); // bottom
  //   this.drawRect(startx, starty, endx, starty + 1, red, green, blue); // left
  //   this.drawRect(startx, endy - 1, endx, endy, red, green, blue); // right
  // }

  // drawRect(startx: number, starty: number, endx: number, endy: number, red: number, green: number, blue: number) {
  //   for (let x = startx; x < endx; x++) {
  //     for (let y = starty; y < endy; y++) {
  //       const index = (x * this.canvasWidth + y) * 4;

  //       this.imageData.data[index] = red;
  //       this.imageData.data[index + 1] = green;
  //       this.imageData.data[index + 2] = blue;
  //     }
  //   }
  // }