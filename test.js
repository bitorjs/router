// 引入模块
let PathToReg = require('path-to-regexp')
// 要使用路径中找到的键填充的数组
let keys = []

let reg = PathToReg('/user/:id', keys, {
  end: false
})
// console.log(keys)
keys = []
let reg1 = PathToReg('/user/:id', keys, {
  end: false
})
// console.log(keys)
keys = []
let reg2 = PathToReg('/user/1/hello2/(.*)', keys, {
  end: false
})
console.log(keys)
let result = '/user/1/hello'.match(reg)
console.log(result, keys)