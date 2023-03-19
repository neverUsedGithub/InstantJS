import Element from './element.js';

declare const Fragment: unique symbol;
interface fn {
    (...arg: any): any;
}
type ComponentProps = Record<string, any>;
type FunctionComponent = {
    (props: ComponentProps): Element;
};
declare function createElement(name: string | Symbol | FunctionComponent, properties: ComponentProps, ...children: Element[]): Element;
declare function state<T>(defaultState: T): {
    (value?: T): T | void;
};
declare function effect(callback: {
    (): fn;
}, dependecies: any[]): void;
declare function ref<T>(defaultState: T): {
    (value?: T): T | void;
};

export { ComponentProps, Fragment, FunctionComponent, createElement, effect, ref, state };
