export = createMyModule;
declare function createMyModule(createMyModule: any, ...args: any[]): any;
declare namespace createMyModule {
    export { createMyModule };
}
