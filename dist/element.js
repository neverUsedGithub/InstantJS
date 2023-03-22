var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var element_exports = {};
__export(element_exports, {
  default: () => Element
});
module.exports = __toCommonJS(element_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
