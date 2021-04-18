"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const wasi_1 = require("wasi");
// const bytes = ;
const wasi = new wasi_1.WASI();
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
(() => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = __dirname + path_1.default.sep + 'a.out.wasm';
    // console.log(path);
    const module = yield WebAssembly.compile(fs_1.default.readFileSync(filePath));
    const instance = yield WebAssembly.instantiate(module, importObject);
    // const main = instance.exports.testingARealFunction as CallableFunction;
    // console.log(main());
    wasi.start(instance);
    console.log("hereeeeeeeeeee");
    console.log(instance);
}))();
class QuadTreeImaging {
    constructor() {
    }
    setImage(file) {
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
let s = new QuadTreeImaging();
s.testPrint();
exports.default = QuadTreeImaging;
//# sourceMappingURL=index.js.map