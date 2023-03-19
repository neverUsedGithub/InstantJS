var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var instant_exports = {};
__export(instant_exports, {
  Fragment: () => Fragment,
  createElement: () => createElement,
  effect: () => effect,
  ref: () => ref,
  state: () => state
});
module.exports = __toCommonJS(instant_exports);
var import_element = __toESM(require("./element"));
const Fragment = Symbol();
let __FRAMEWORK_CURRENT = null;
function createElement(name, properties, ...children) {
  const el = new import_element.default(name, properties || {}, children);
  if (typeof name === "function") {
    el.name = wrapComponent(name, el);
  }
  return el;
}
function compareHookTypes(last, new_) {
  if (last.length !== new_.length)
    return false;
  for (let i = 0; i < last.length; i++)
    if (last[i].type !== new_[i].type)
      return false;
  return true;
}
function wrapComponent(toWrap, element) {
  return () => {
    __FRAMEWORK_CURRENT = element;
    element.__lastHooks = element.__hooks;
    element.__hooks = [];
    const value = toWrap(Object.assign({}, element.props, {
      children: element.children
    }));
    if (element.__lastHooks && !compareHookTypes(element.__lastHooks, element.__hooks))
      throw new Error(`Hook order changed between renders.
Last: ${element.__lastHooks.map((x) => x.type).join(", ")}
New:  ${element.__hooks.map((x) => x.type).join(", ")}`);
    __FRAMEWORK_CURRENT = null;
    return value;
  };
}
function state(defaultState) {
  const el = __FRAMEWORK_CURRENT;
  let value = defaultState;
  let hookId = el.__hooks.length;
  if (el.__lastHooks && el.__lastHooks[hookId])
    value = el.__lastHooks[hookId].value;
  el.__hooks.push({ value, type: "state" });
  return (newValue) => {
    if (newValue === void 0)
      return value;
    if (typeof newValue === "function")
      value = newValue(value);
    else
      value = newValue;
    el.__hooks[hookId].value = value;
    el.__triggerReload();
  };
}
const arraysEqual = (a, b) => {
  if (a.length !== b.length)
    return false;
  for (var i = 0; i < a.length; i++)
    if (a[i] !== b[i])
      return false;
  return true;
};
function effect(callback, dependecies) {
  const el = __FRAMEWORK_CURRENT;
  let hookId = el.__hooks.length;
  const last = (el.__lastHooks || [])[hookId] || {};
  let destroy = last.destroy;
  if (!last.deps || !arraysEqual(last.deps, dependecies)) {
    if (destroy && typeof destroy === "function")
      destroy();
    destroy = callback();
  }
  el.__hooks.push({
    type: "effect",
    destroy,
    deps: dependecies
  });
}
function ref(defaultState) {
  const el = __FRAMEWORK_CURRENT;
  let value = defaultState;
  let hookId = el.__hooks.length;
  if (el.__lastHooks && el.__lastHooks[hookId])
    value = el.__lastHooks[hookId].value;
  el.__hooks.push({ value, type: "ref" });
  return (newValue) => {
    if (newValue === void 0)
      return value;
    if (typeof newValue === "function")
      value = newValue(value);
    else
      value = newValue;
    el.__hooks[hookId].value = value;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fragment,
  createElement,
  effect,
  ref,
  state
});
