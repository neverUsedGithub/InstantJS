interface fn { (...arg: any): any }

export default class Element {
  #listeners: fn[];
  name: string | fn | Symbol;
  props: Record<string, any>;
  children: Element[];
  __hooks: any[];
  __lastHooks: null | any[];

  constructor(name: string | fn | Symbol, props: Record<string, any>, children: Element[]) {
    this.name = name;
    this.props = props;
    this.children = children;
    this.#listeners = [];

  }

  onReload(callback: fn) {
    this.#listeners.push(callback);
  }

  __triggerReload() {
    for (const listener of this.#listeners)
      listener();
  }
}