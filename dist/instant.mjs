import Element from "./element";
const Fragment = Symbol();
let __FRAMEWORK_CURRENT = null;
function createElement(name, properties, ...children) {
  const el = new Element(name, properties || {}, children);
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
export {
  Fragment,
  createElement,
  effect,
  ref,
  state
};
