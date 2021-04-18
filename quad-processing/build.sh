emcc main.cpp -s WASM=1 -s SIDE_MODULE=1

cp a.out.js ../quad-processing-glue/wasm/
cp a.out.wasm ../quad-processing-glue/wasm/
