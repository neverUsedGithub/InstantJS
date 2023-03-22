var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// ../../src/element.ts
var _listeners;
var Element = class {
  constructor(name, props, children) {
    __privateAdd(this, _listeners, void 0);
    this.name = name;
    this.props = props;
    this.children = children;
    __privateSet(this, _listeners, []);
  }
  onReload(callback) {
    __privateGet(this, _listeners).push(callback);
  }
  __triggerReload() {
    for (const listener of __privateGet(this, _listeners))
      listener();
  }
};
_listeners = new WeakMap();

// ../../src/instant.ts
var Fragment = Symbol();
var __FRAMEWORK_CURRENT = null;
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

// ../../src/dom.ts
var namespaceStack = [];
function attachFunctionElement(element) {
  const getHTML = () => getDOMElement(element.name());
  let lastElements = getHTML();
  element.onReload(() => {
    const newel = getHTML();
    for (let i = 1; i < lastElements.length; i++) {
      lastElements[i].remove();
    }
    for (const newElem of newel)
      lastElements[0].parentElement.insertBefore(
        newElem,
        lastElements[0]
      );
    lastElements[0].remove();
    lastElements = newel;
  });
  return lastElements;
}
function addChild(element, children) {
  const tchildren = getChildElement(children);
  for (const el of tchildren)
    element.appendChild(el);
}
function getChildElement(child) {
  if (child instanceof Element)
    return getDOMElement(child);
  if (typeof child === "string" || typeof child === "number")
    return [document.createTextNode(child.toString())];
  if (Array.isArray(child)) {
    let children = [];
    for (const ch of child)
      children.push(...getChildElement(ch));
    return children;
  }
  if (child === void 0 || child === null)
    return [];
  console.warn("Type:", child, "is not a valid Instant element.");
  throw new Error("Invalid child.");
}
function getDOMElement(element) {
  if (typeof element.name === "function")
    return attachFunctionElement(element);
  if (element.name === Fragment)
    return getChildElement(element.children);
  if (element.name === "svg")
    namespaceStack.push("http://www.w3.org/2000/svg");
  let el;
  if (namespaceStack.length > 0)
    el = document.createElementNS(namespaceStack[namespaceStack.length - 1], element.name);
  else
    el = document.createElement(element.name);
  addChild(el, element.children);
  for (const [name, value] of Object.entries(element.props)) {
    if (name === "ref")
      element.props[name](el);
    else if (name.startsWith("on")) {
      const listenerName = name.substring(2);
      el.addEventListener(
        listenerName[0].toLocaleLowerCase() + listenerName.substring(1),
        (e) => value(e)
      );
    } else
      el.setAttribute(name, value);
  }
  if (element.name === "svg")
    namespaceStack.pop();
  return [el];
}
function render(element, eroot) {
  addChild(eroot, element);
}

// main.jsx
function Counter({ initial }) {
  const count = state(initial);
  return /* @__PURE__ */ createElement(Fragment, null, /* @__PURE__ */ createElement("h3", null, "Count is ", count()), /* @__PURE__ */ createElement("button", { onClick: () => count(count() - 1) }, "Decrease to ", count() - 1), /* @__PURE__ */ createElement("button", { onClick: () => count(count() + 1) }, "Increase to ", count() + 1), /* @__PURE__ */ createElement("svg", { fill: "#000000", height: "200px", width: "200px", version: "1.1", id: "Capa_1", xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", viewBox: "0 0 310.285 310.285", "xml:space": "preserve" }, /* @__PURE__ */ createElement("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), /* @__PURE__ */ createElement("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), /* @__PURE__ */ createElement("g", { id: "SVGRepo_iconCarrier" }, " ", /* @__PURE__ */ createElement("path", { d: "M155.143,0.001C69.597,0.001,0,69.597,0,155.143c0,85.545,69.597,155.142,155.143,155.142s155.143-69.597,155.143-155.142 C310.285,69.597,240.689,0.001,155.143,0.001z M244.143,171.498c0,4.411-3.589,8-8,8h-163c-4.411,0-8-3.589-8-8v-32 c0-4.411,3.589-8,8-8h163c4.411,0,8,3.589,8,8V171.498z" }), " ")));
}
function App() {
  return /* @__PURE__ */ createElement(Fragment, null, /* @__PURE__ */ createElement(Counter, { initial: 0 }), /* @__PURE__ */ createElement(Counter, { initial: 5 }), /* @__PURE__ */ createElement(Counter, { initial: 10 }));
}
render(/* @__PURE__ */ createElement(App, null), document.querySelector("#app"));
