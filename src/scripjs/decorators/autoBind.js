"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoBind = autoBind;
function autoBind(_1, _2, descriptor) {
  var method = descriptor.value;
  var createDescriptor = {
    configurable: true,
    get: function get() {
      return method.bind(this);
    }
  };
  return createDescriptor;
}