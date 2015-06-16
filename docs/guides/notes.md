
## The basics

All Framework projects are created using the following structure:
 
    BEST.scene('module name', 'module version',  { module defintion } ) 

The bulk of your project lives within the module definition where we list our behaviors, events, states, and tree. Let's see it in action. 


## Hello Framework

<span style="font-size:18px" >The Famous Framework complements the [Famous Engine](famous.org/learn) by promoting clean, maintainable code and providing an easy to understand interface for building the applications of tomorrow. </span>

## The basics

All Framework projects are created using the following structure:
 
    BEST.scene('module name', 'module version',  { module defintion } ) 

The bulk of your project lives within the module definition where we list our behaviors, events, states, and tree. The module name is the folder 

_This section will be referencing the seed project we downloaded in the [getting started](#) section. Open up the `components/my.component.name/hello-framework` directory if you wish to follow along with your own version of the project._ 

We'll start by introducing a simple 'Hello World' example below. When reading through the code, think of the _tree_ ( imported from the `hello-framework.html` file ) as custom HTML and the _behaviors_ as CSS styles on steroids. 

    /**
    *  hello-framework.js
    **/
    
    BEST.scene('my.component.name:hello-framework', 'HEAD', {
        behaviors: {
            '#background': {
                'style': {
                    'background': 'linear-gradient(to right, #00B9D7, #9783F2)'
                }
            },
           '#text': {
               'size': [400, 80],
               'align': [0.5, 0.5],
               'mount-point': [0.5, 0.5],
               'style': {
                   'color': 'white',
                   'font-family': 'Lato',
                   'font-size': '60px',
                   'text-align': 'center'
               }
           }
        },
        events: {},
        states: {},
        tree: 'hello-framework.html'
        });
    
Note how we use CSS selectors (`#background`, `#text` ) in `hello-framework.js` above for referencing the elements in `hello-framework.html` below.

``` html
  <!-- hello-framework.html -->
    
<dom-element id='background'></dom-element>

<ui-element id='text'> 
    <div> Hello Framework! </div>
</ui-element>
```

The `hello-famous.html` file sets up the structure of our project, which includes a background `<dom-element>` component and a `<ui-element>` component with our nested `<div>Hello Framework!</div>` content.  While we won't go into the details of [components](#) in this section directly, you should recognize how we decorate the components above with _behaviors_ to produce the output of our project.  


## Rendering to Actual HTML 

It's important to note that `hello-framework.html` is just a representation of your app's structure and is not HTML at all. In order to view our project in the browser, we'll need to _deploy_ it in our root HTML file so it can render to the DOM.  

After saving the file above, open the file workspace/build/index.html in your text editor. You should see a script line with the code `BEST.deploy(...)`. That line controls the current scene being rendered at. Modify it so that it instead points to your new scene, like so:

    BEST.deploy('zelda.zulu:hello-framework', 'HEAD', 'body');

Then visit  [localhost:1337](localhost:1337) in your browser, and you should see the message “Hello Famous Framework” displayed. Congratulations! You’ve just created your first scene. As you make updates to this file, the browser should refresh automatically.