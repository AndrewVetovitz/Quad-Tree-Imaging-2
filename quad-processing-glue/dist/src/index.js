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
const a_out_js_1 = __importDefault(require("../wasm/a.out.js"));
let testPrint;
let loadedModule = a_out_js_1.default().then(function (module) {
    testPrint = module.__Z20testingARealFunctionv;
});
class QuadTreeImaging {
    constructor() { }
    setImage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadedModule;
        });
    }
    testPrint() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loadedModule;
            testPrint();
        });
    }
}
exports.default = QuadTreeImaging;
//# sourceMappingURL=index.js.map