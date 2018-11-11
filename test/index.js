import Router from '../layer';

var router1 = new Router("/asdf/:id/:name/:age", {
  name: 'test'
}, () => {
  console.log()
})
router1.match("/asdf/1/3/5")

var router2 = new Router("*", {
  name: 'test'
}, () => {
  console.log()
})
router2.match("/asdf/1/3/5")