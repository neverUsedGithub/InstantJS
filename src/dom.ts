import Element from "./element";
import { Fragment } from "./instant";
interface fn {
  (...arg: any): any;
}

let namespaceStack: string[] = [];

function attachFunctionElement(element: Element): (HTMLElement | Text)[] {
  const getHTML = () => getDOMElement((element.name as fn)());
  let lastElements = getHTML();

  element.onReload(() => {
    const newel = getHTML();

    for (let i = 1; i < lastElements.length; i++) {
      lastElements[i].remove();
    }
    for (const newElem of newel)
      (lastElements[0].parentElement as HTMLElement).insertBefore(
        newElem,
        lastElements[0]
      );

    lastElements[0].remove();
    lastElements = newel;
  });

  return lastElements;
}

function addChild(element: HTMLElement, children: Element[] | Element): void {
  const tchildren = getChildElement(children);

  for (const el of tchildren) element.appendChild(el);
}

function getChildElement(
  child: Element[] | Element | string | number | undefined | null
): (HTMLElement | Text)[] {
  if (child instanceof Element) return getDOMElement(child);

  if (typeof child === "string" || typeof child === "number")
    return [document.createTextNode(child.toString())];

  if (Array.isArray(child)) {
    let children: (HTMLElement | Text)[] = [];
    for (const ch of child) children.push(...getChildElement(ch));
    return children;
  }

  if (child === undefined || child === null) return [];

  console.warn("Type:", child, "is not a valid Instant element.");
  throw new Error("Invalid child.");
}

function getDOMElement(element: Element): (HTMLElement | Text)[] {
  if (typeof element.name === "function")
    return attachFunctionElement(element);

  if (element.name === Fragment)
    return getChildElement(element.children);

  if (element.name === "svg") namespaceStack.push("http://www.w3.org/2000/svg");

  let el: HTMLElement;
  if (namespaceStack.length > 0)
    el = document.createElementNS(namespaceStack[namespaceStack.length - 1], element.name as string) as HTMLElement;
  else el = document.createElement(element.name as string);

  addChild(el, element.children);

  for (const [name, value] of Object.entries(element.props)) {
    if (name === "ref") element.props[name](el);
    else if (name.startsWith("on")) {
      const listenerName = name.substring(2);

      el.addEventListener(
        listenerName[0].toLocaleLowerCase() + listenerName.substring(1),
        (e) => (value as fn)(e)
      );
    } else el.setAttribute(name, value);
  }

  if (element.name === "svg") namespaceStack.pop();

  return [el];
}

export function render(element: Element, eroot: HTMLElement) {
  addChild(eroot, element);
}
