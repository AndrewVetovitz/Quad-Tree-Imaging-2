import fs from 'fs';
import path from 'path';
import { WASI } from 'wasi';

const wasi = new WASI({

});

const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

(async () => {
    const filePath: string = __dirname + path.sep + 'a.out.wasm';
    // console.log(path);
    const module: WebAssembly.Module = await WebAssembly.compile(fs.readFileSync(filePath));
    const instance = await WebAssembly.instantiate(module, importObject);
    // const main = instance.exports.testingARealFunction as CallableFunction;
    // console.log(main());
    wasi.start(instance);

    console.log("hereeeeeeeeeee");
    console.log(instance);
})();

class QuadTreeImaging {
    constructor() {

    }

    setImage(file: any) {
        console.log(file);
    }

    testPrint() {
        console.log("calling function");

        // import(__dirname + "/a.out.wasm").then(instance => {
        //     const func = instance.__Z20testingARealFunctionv;
        //     // console.log(func());
        //     console.log(instance.exports);
        // });
    }
}

let s: QuadTreeImaging = new QuadTreeImaging();
s.testPrint();

export default QuadTreeImaging;