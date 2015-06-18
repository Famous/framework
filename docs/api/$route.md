# $route

`$route` is an object representing the current route of the page. It can be dependency-injected into any
behavior function. When used with `$if`, `$route` can serve as a very lightweight router for your component. 

In the example below, the node on the page will depend on the current `$route`. 
Clicking on a page will set the location url to _/home_. We'll use the browser's
[`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location) API to set the current location url.

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
        },
        '.page': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {
        '.page': {
            'click': function() {
                var location = window.location;
                var href = location.href;

                var baseURL = href.substr(0, href.lastIndexOf('/'));
                location.replace(baseURL + '/home');
            }
        }
    },
    states: {},
    tree: `
        <node id="home"  class="page">  <div> HOME  </div>  </node>
        <node id="blog"  class="page">  <div> BLOG  </div>  </node>
        <node id="about" class="page">  <div> ABOUT </div>  </node>
    `
});
```
