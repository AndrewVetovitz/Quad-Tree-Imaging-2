#include <iostream>
#include <emscripten/emscripten.h>


// int main() {
//   printf("hello, world!\n");
//   return 0;
// }

EMSCRIPTEN_KEEPALIVE 
void testingARealFunction() {
  printf("hello, world!\n");
}