# $route

`$route` is an object representing the current route of the page. It can be dependency-injected into any
behavior function. When used with `$if`, `$route` can serve as a lightweight router for your component. 


In the example below, the node on the page will depend on the current `$route`.

```
FamousFramework.scene('example', {
    behaviors: {
        '#home': {
            '$if': function($route) { return $route === '/home'  }
        },
        '#blog': {
            '$if': function($route) { return $route === '/blog'  }
        },
        '#about': {
            '$if': function($route) { return $route === '/about' }
        }
    },
    events: {},
    states: {},
    tree: `
        <node id="home"  class="page">  <div> HOME  </div>  </node>
        <node id="blog"  class="page">  <div> BLOG  </div>  </node>
        <node id="about" class="page">  <div> ABOUT </div>  </node>
    `
});
```
