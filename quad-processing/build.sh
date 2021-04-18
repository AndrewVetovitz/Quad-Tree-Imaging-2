emcc main.cpp -s MODULARIZE=1 -s 'EXPORT_NAME="createMyModule"'

cp a.out.js ../quad-processing-glue/wasm/
cp a.out.wasm ../quad-processing-glue/wasm/
