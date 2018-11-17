import methods from 'methods';
import Layer from './layer';

var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

class Router {

  constructor() {
    this.stack = [];
    this.methods = {};

    this.supportMethods()
    this.normalize()
    this.registerMeshod()
  }

  supportMethods() {
    this.methods = {
      get: "GET",
      post: "POST",
      delete: "DELETE",
      put: "PUT",
      head: "HEAD",
      patch: "PATCH"
    }
  }

  normalize() {

    if (toString.call(this.methods) !== '[object Object]') {
      throw new Error('override supportMethods methods must be the Array Type')
    }
    let methods = Object.keys(this.methods);
    for (var i = 0; i < methods.length; i++) {
      // make upper case
      let key = methods[i];
      let value = this.methods[key];
      delete this.methods[key];
      value = value.toUpperCase();
      this.methods[key] = value;
    }
  }

  registerMeshod() {
    let methods = Object.keys(this.methods);
    let router = this;
    methods.forEach(method => {
      Router.prototype[method] = function (path, opts, fn) {
        router.register(method, path, opts, fn)
      }
    });
  }

  register(path, opts, fn) {
    opts = opts || {};
    let method = opts.method ? opts.method.toLowerCase() : 'get';

    if (!(method in this.methods)) {
      throw new Error('not support the method', method);
    }
    // create route
    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: true,
      ...opts,
    }, fn);

    this.stack.push(layer);
    // 
    this.stack.sort((a, b) => {
      return b.regexp.toString().length - a.regexp.toString().length;
    })

    return this;
  }

  match(path, method = 'GET') {
    let matched = [];
    let stack = this.stack;
    for (let ind = 0; ind < stack.length; ind++) {
      const layer = stack[ind];
      if (layer.match(path, method)) {
        matched.push(layer)
      }
    }
    return matched;
  }
}

export default Router;