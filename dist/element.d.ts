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
    __onEvent(name: string, callback: fn): void;
    __triggerEvent(name: string): void;
}

export { Element as default };
