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
var dom_exports = {};
__export(dom_exports, {
  render: () => render
});
module.exports = __toCommonJS(dom_exports);
var import_element = __toESM(require("./element"));
var import_instant = require("./instant");
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
  if (child instanceof import_element.default)
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
  if (element.name === import_instant.Fragment)
    return getChildElement(element.children);
  const el = document.createElement(element.name);
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
  return [el];
}
function render(element, eroot) {
  addChild(eroot, element);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  render
});
