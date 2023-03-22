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
    this.#listeners = [];
  }
  onReload(callback) {
    this.#listeners.push(callback);
  }
  __triggerReload() {
    for (const listener of this.#listeners)
      listener();
  }
}
export {
  Element as default
};
