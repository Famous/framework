# Hello Framework

The [Famous Framework](https://github.com/Famous/framework) provides a structured API for controlling UI elements with the Famous Engine. As a framework, its goals are to bring composability, extensibility, and consistency fo UI applications.

## The basics

All FAmous Framework projects begin with the following syntax:
 
    FamousFramework.component('module-name',  { /* module defintion /* });

The bulk of a project lives within the _module definition_, where we list our behaviors, events, states, and tree as members of an object (see [Core Concepts](core-concepts.md) for an intro to the BEST architectural pattern).

## A simple project

Check out the 'Hello World' example below. When reading through the code, think of the _tree_ as Famous-enhanced HTML and the _behaviors_ as CSS styles on steroids.

    /**
    *  hello-framework.js
    **/
    
    FamousFramework.component('my-name:hello-framework',  {
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
        tree: `
            <node id='background'>
            <node id='text'> 
                <div> Hello Framework! </div>
            </node>
            </node>
        `
    });

Note how we use CSS selectors (`#background`, `#text`) to target behaviors to elements that are declared in the `tree`.

While the _tree_ sets up the structure of our app, the _behaviors_ tell the module how each element should be displayed. The result: a 'Hello Framework!' message centered and styled in front of a CSS gradient background.

## Rendering the component

It's important to note that the _tree_ declaration above isn't really HTML, but just a representation of the app's structure (the scene graph). In order to render the project, the component needs to be deployed to an HTML document. 

    FamousFramework.deploy('my-name:hello-world', 'HEAD', 'body');

You'll find code similar to the line above in the `public/index.html` of the project you created when you ran `famous framework-scaffold`. That line tells the framework library how to locate the component code (served on `localhost:1618`) and where to render it on the page.
