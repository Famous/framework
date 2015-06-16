## Hello Framework

The [Famous Framework](https://github.com/Famous/framework), built by engineers at Famous, provides an easy-to-use API for harnessing the Famous Engine. It's also designed to integrate seamlessly with (forthcoming) Famous studio tools and Famous cloud services.

## The basics

All Framework projects are created using the following syntax:
 
    FamousFramework.scene('module name',  { module defintion } ) 

The bulk of a project lives within the `'module definition'` where we list our behaviors, events, states, and tree as members of an object ( see [Core Concepts](core-concepts.md) for an intro to the BEST pattern ). The `module name` points to the directory where your project files are located. Let's see it in action. 

## A simple project

Check out the 'Hello World' example below ( Let's assume it is located in the `components/my.components.name/hello-framework` directory of an existing [seed project](#) ). When reading through the code, think of the _tree_ ( imported from the `hello-framework.html` file ) as custom HTML and the _behaviors_ as CSS styles on steroids. 

    /**
    *  hello-framework.js
    **/
    
    FamousFramework.component('my.component.name:hello-framework',  {
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
    
<node id='background'>
<node id='text'> 
    <div> Hello Framework! </div>
</node>
</node>
```

While the _tree_ ( in `hello-framework.html` ) sets up the structure of our app, the _behaviors_ ( in `hello-framework.js`) tells the module how each element should be displayed. The result: a 'Hello Framework!' message centered and styled in front of  a CSS gradient background. 

## Rendering to actual HTML 

It's important to note that the `hello-framework.html` code above isn't actually HTML at all, but instead just a representation of the app's structure. In order to render the project above to HTML, it needs to be deployed to an HTML document with the Framework [boilerplate]() code included. 

Once the [boilerplate]() code is set up, we use the following command within the HTML document to initialize a project:

    FamousFramework.deploy('module name', 'module version', 'target element');

The `'module name'`  locates your project files and the `'target element'` tells the Framework where in the HTML document it should append your Framework code. It's that simple!


        
