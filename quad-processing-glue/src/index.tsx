import createMyModule from '../wasm/a.out.js';

let testPrint: Function;

let loadedModule: any = createMyModule().then(function(module: any) {
    testPrint = module.__Z20testingARealFunctionv;
});

class QuadTreeImaging {
    constructor() {}

    async setImage(file: any) {
        await loadedModule;
    }

    async testPrint() {
        await loadedModule;

        testPrint();
    }
}

export default QuadTreeImaging;