import Element from "./element";
import { Fragment } from "./instant";
let namespaceStack = [];
function attachFunctionElement(element) {
  const getHTML = () => getDOMElement(element.name());
  let lastElements = getHTML();
  element.__onEvent("ui.reload", () => {
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
        listenerName.toLocaleLowerCase(),
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
export {
  render
};
