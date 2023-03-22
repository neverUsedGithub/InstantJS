class Element {
  #listeners;
  name;
  props;
  children;
  __hooks;
  __lastHooks;
  constructor(name, props, children) {
    this.name = name;
    this.props = props;
    this.children = children;
    this.#listeners = {};
  }
  __onEvent(name, callback) {
    if (!this.#listeners[name])
      this.#listeners[name] = [callback];
    else
      this.#listeners[name].push(callback);
  }
  __triggerEvent(name) {
    if (this.#listeners[name])
      for (const listener of this.#listeners[name])
        listener();
  }
}
export {
  Element as default
};
