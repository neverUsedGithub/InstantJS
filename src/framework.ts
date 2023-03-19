import Element from "./element.js";
export const Fragment = Symbol();
interface fn { (...arg: any): any }

export type ComponentProps = Record<string, any>;
export type FunctionComponent = { (props: ComponentProps): Element };

let __FRAMEWORK_CURRENT: Element | null = null;

export function createElement(
  name: string | Symbol | FunctionComponent,
  properties: ComponentProps,
  ...children: Element[]
) {
  const el = new Element(name, properties || {}, children);

  if (typeof name === "function") {
    el.name = wrapComponent(name, el);
  }

  return el;
}

function compareHookTypes(last: Record<string, string>[], new_: Record<string, string>[]) {
  if (last.length !== new_.length)
    return false;

  for (let i = 0; i < last.length; i++)
    if (last[i].type !== new_[i].type)
       return false;

  return true;
}

function wrapComponent(toWrap: fn, element: Element) {
  return () => {
    __FRAMEWORK_CURRENT = element;
    element.__lastHooks = element.__hooks;
    element.__hooks = [];
    const value = toWrap(Object.assign({}, element.props, {
      children: element.children
    }));
    if (
      element.__lastHooks && 
      !compareHookTypes(element.__lastHooks, element.__hooks)
    )
      throw new Error(`Hook order changed between renders.
Last: ${element.__lastHooks.map(x => x.type).join(", ")}
New:  ${element.__hooks.map(x => x.type).join(", ")}`)
    __FRAMEWORK_CURRENT = null;
    return value;
  }
}

export function state<T>(defaultState: T): {(value?: T): T | void} {
  const el = __FRAMEWORK_CURRENT as Element;
  let value = defaultState;
  let hookId = el.__hooks.length;

  if (el.__lastHooks && el.__lastHooks[hookId])
    value = el.__lastHooks[hookId].value;
  
  el.__hooks.push({ value: value, type: "state" });

  return (newValue) => {
    if (newValue === undefined)
      return value

    if (typeof newValue === "function")
      value = newValue(value);
    else
      value = newValue;

    el.__hooks[hookId].value = value;
    el.__triggerReload();
  }
}

const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++)
    if (a[i] !== b[i])
      return false;

  return true;
}

export function effect(callback: {(): fn}, dependecies: any[]) {
  const el = __FRAMEWORK_CURRENT as Element;
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
    destroy: destroy,
    deps: dependecies
  });
}

export function ref<T>(defaultState: T): {(value?: T): T | void} {
  const el = __FRAMEWORK_CURRENT as Element;
  let value = defaultState;
  let hookId = el.__hooks.length;

  if (el.__lastHooks && el.__lastHooks[hookId])
    value = el.__lastHooks[hookId].value;
  
  el.__hooks.push({ value: value, type: "ref" });

  return (newValue) => {
    if (newValue === undefined)
      return value

    if (typeof newValue === "function")
      value = newValue(value);
    else
      value = newValue;

    el.__hooks[hookId].value = value;
  }
}