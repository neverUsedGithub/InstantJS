interface fn {
    (...arg: any): any;
}
declare class Element {
    #private;
    name: string | fn | Symbol;
    props: Record<string, any>;
    children: Element[];
    __hooks: any[];
    __lastHooks: null | any[];
    constructor(name: string | fn | Symbol, props: Record<string, any>, children: Element[]);
    onReload(callback: fn): void;
    __triggerReload(): void;
}

export { Element as default };
