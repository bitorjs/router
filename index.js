const methods = require('methods')
const Layer = require('./layer');

var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

function pathWeigth(path) {
  const arr = path.split('/');
  let ret = 0;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    let base = 100 / Math.pow(10, i)

    if (item === '*') {
      base *= 1;
    } else {
      let ind = item.indexOf(':');
      if (ind > -1) {
        base *= 0.9;
        base *= Math.pow(0.9, ind);
      } else {
        base *= 0.1;
      }
    }
    ret += base;
  }
  return ret;
}

function Router() {
  this.stack = [];
  this.methods = {};

  this.supportMethods()
  this.normalize()
  this.registerMethod()
}

Router.prototype = {
  constructor: Router,


  supportMethods() {
    this.methods = {
      get: "GET",
      post: "POST",
      delete: "DELETE",
      put: "PUT",
      head: "HEAD",
      patch: "PATCH"
    }
  },

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
  },

  registerMethod() {
    let methods = Object.keys(this.methods);
    let router = this;
    methods.forEach(method => {
      Router.prototype[method] = function (path, opts, fn) {
        router.register(method, path, opts, fn)
      }
    });
  },

  register(path, opts, fn) {
    opts = opts || {};
    let method = opts.method ? opts.method.toLowerCase() : 'get';

    if (!(method in this.methods)) {
      throw new Error('not support the method', method);
    }
    // create route
    var layer = new Layer(path, {
      sensitive: true,
      strict: false,
      end: true,
      ...opts,
    }, fn);




    // 插入后简单排序
    // this.stack.push(layer);
    // this.stack.sort((a, b) => {
    //   return b.regexp.toString().length - a.regexp.toString().length;
    // })

    // 排覆盖排序插入
    let stack = this.stack;
    if (stack.length === 0) {
      stack.push(layer);
    } else {
      let len = stack.length;
      for (let k = 0; k < len; k++) {
        const item = stack[k];
        if (pathWeigth(layer.origin) <= pathWeigth(item.origin)) {
          stack.splice(k, 0, layer);
          break;
        } else if (k == (len - 1)) {
          stack.push(layer);
        }
      }
    }


    return this;
  },

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

module.exports = Router;