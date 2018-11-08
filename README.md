# router


#### 常见的 路由
```
Hash模式：xxx.com/#/id=5 
History模式: xxx.com/id=5 
```

我们都知道单页应用的路由有两种模式：hash 和 history。如果我们在 hash 模式时不使用 history.pushState() 和 history.replaceState() 方法，我们就只需要在 hashchange 事件回调里编写 url 改变时的逻辑就行了。而 history 模式下，我们不仅要在 popstate 事件回调里处理 url 的变化，还需要分别在 history.pushState() 和 history.replaceState() 方法里处理 url 的变化。而且 history 模式还需要后端的配合，不然用户刷新页面就只有 404 可以看了?

所以 hash 模式下我们的工作其实是更简单的，但为什么现在都推荐用 history 模式呢？总不是 hash 模式下的 url 太丑了，毕竟这是个看脸的世界?

不过 vue-router 在浏览器支持 pushState() 时就算是 hash 模式下也是用 history.pushState() 来改变 url，不知道有没什么深意？

```
1、Hash模式： 
      hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会滚动到相应位置，不会重新加载网页，也就是说 #是用来指导浏览器动作的，对服务器端完全无用，HTTP请求中也不会不包括#；同时每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置；

2、History模式： 
    HTML5 History API提供了一种功能，能让开发人员在不刷新整个页面的情况下修改站点的URL，就是利用 history.pushState API 来完成 URL 跳转而无须重新加载页面；

通常情况下，我们会选择使用History模式，原因就是Hash模式下URL带着‘#’会显得不美观；但实际上，这样选择一不小心也会出问题；比如：

但当用户直接在用户栏输入地址并带有参数时： 
但当用户直接在用户栏输入地址并带有参数时： 
Hash模式：xxx.com/#/id=5 请求地址为 xxx.com,没有问题; 
History模式: xxx.com/id=5 请求地址为 xxx.com/id=5，如果后端没有对应的路由处理，就会返回404错误；

使用history模式的服务端支持
由于使用history时的路由是 www.xxx.com/a/b/c ，url 是指向真实 url 的资源路径。因此回去服务端查询该资源。往往资源是不存在的于是就会报404。下面以 ngixn 为例修改 nginx 配置以支持history路由。[https://www.jianshu.com/p/0a9077d8714d](https://www.jianshu.com/p/0a9077d8714d)

为解决这一问题，vue-router提供的方法是：

在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。 
给个警告，因为这么做以后，你的服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，你应该在 Vue 应用里面覆盖所有的路由情况，然后再给出一个 404 页面。或者，如果你使用 Node.js 服务器，你可以用服务端路由匹配到来的 URL，并在没有匹配到路由的时候返回 404，以实现回退。

通过上面所说的原理，简单起来说就是 browserHistory 模式下，需要每个路由下都要有对应的资源存在，就不会产生 404 错误，所以如果不借助服务端的话，又要实现这种模式，这种场景在自己不能配置服务器时候会碰到，例如把项目部署到 GitHub pages 上。那该怎么办呢 [那么就产生 对应资源] 所以，我们的做法就是在每个 路由路径 下，都放置一个跟首页一样的 index.html

接下来我们就把生成的 index.html 复制到这几个路径下就可以了

// deploy.js
const fs = require('fs-extra')
const routes = require('routes.js')
const path = require('path')
routes.forEach((route) => {
  fs.copySync('index.html', path.join(route, 'index.html'))
})

问题
404 路由怎么生成路径

这个就直接使用服务端 404 页面了，如果是用 GitHub pages 的话，我们可以直接生成一个 404.html 即可。或者是将 404 路由跳转到首页



```