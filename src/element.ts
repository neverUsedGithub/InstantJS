interface fn { (...arg: any): any }

export default class Element {
  #listeners: Record<string, fn[]>;
  name: string | fn | Symbol;
  props: Record<string, any>;
  children: Element[];
  __hooks: any[];
  __lastHooks: null | any[];

  constructor(name: string | fn | Symbol, props: Record<string, any>, children: Element[]) {
    this.name = name;
    this.props = props;
    this.children = children;
    this.#listeners = {};
  }

  __onEvent(name: string, callback: fn) {
    if (!this.#listeners[name])
      this.#listeners[name] = [ callback ]
    else
      this.#listeners[name].push(callback);
  }

  __triggerEvent(name: string) {
    if (this.#listeners[name])
      for (const listener of this.#listeners[name])
        listener();
  }
}