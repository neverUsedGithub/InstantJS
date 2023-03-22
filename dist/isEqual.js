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
var isEqual_exports = {};
__export(isEqual_exports, {
  default: () => isEqual
});
module.exports = __toCommonJS(isEqual_exports);
function isEqual(x, y) {
  if (Array.isArray(x) && !Array.isArray(y) || Array.isArray(y) && !Array.isArray(x))
    return false;
  if (Array.isArray(x)) {
    if (x.length !== y.length)
      return false;
    for (let i = 0; i < x.length; i++)
      if (!isEqual(x[i], y[i]))
        return false;
    return true;
  }
  if (typeof x === "function")
    return Object.is(x, y);
  return x === y;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
