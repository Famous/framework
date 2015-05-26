# Hello Famous Framework

The [Famous Framework](https://github.com/Famous/framework), built by engineers at Famous, provides an easy-to-use API for harnessing the Famous Engine. It's also designed to integrate seamlessly with (forthcoming) Famous studio tools and Famous cloud services.

## Installation &amp; setup

See [Installation &amp; setup](setup.md).

In these guides, **we will assume your project's root directory is `framework/`**, which should have been created when you cloned the repo. Unless specified otherwise, all command-line commands should be run from that folder.

**We'll also assume that your development environment is up-and-running**, i.e., that you ran `$ npm run develop` in the previous step. A demonstration page should already be visible at [localhost:1337](http://localhost:1337), and a tab in your terminal should be showing live output logs.

## Starting a new project

Take a look at the `components/` folder (which should be within the project's root directory). In it, you should see a folder structure similar to this (**the actual folders you see may differ from this list**):

    ├── alice.alpha/
    ├── famous/
    ├── george.golf/
    ├── ...

Create a folder for yourself at the same level as these folders. Name it after yourself, and stick to the convention of all-lowercase characters and a period for a separator. (For this guide, we'll pretend that you created the folder `zelda.zulu/`.) This folder will be the home for all your projects.

Now create a project folder inside your folder: From inside your `zelda.zulu/` folder, create a folder called `hello-framework/`. Then create the main file for your project: Inside the `hello-framework/` folder, create the file `hello-framework.js`. Your files and folders should now look like this:

    ├── ...
    ├── george.golf/
    └── zelda.zulu/
        └── hello-be/
            └── hello-famous.js

## Creating a scene

The file `hello-framework.js` will be the main entrypoint into your scene. Let's add some code to that file to get something simple into the browser window. Copy and paste the following code snippet into the entrypoint file:

    BEST.scene('zelda.zulu:hello-framework', 'HEAD', {
        tree: `<ui-element><h1>Hello Famous Framework</h1></ui-element>`
    });

Save that file, and then open the file `workspace/build/index.html` in your text editor. You should see a script line with the code `BEST.deploy(...)`. That line controls the current scene being rendered at [localhost:1337](http://localhost:1337). Modify it so that it instead points to your new scene, like so:

    BEST.deploy('zelda.zulu:hello-framework', 'HEAD', 'body');

Then visit [localhost:1337](http://localhost:1337) in your browser, and you should see the message "Hello Famous Framework" displayed. Congratulations! You've just created your first scene. As you make updates to this file, the browser should refresh automatically.

## Style, animation, and interaction

Let's extend the code snippet to create a more complex scene that includes styles, animation, and user interaction. Replace the contents of `hello-framework.js` with the following snippet:

    BEST.scene('zelda.zulu:hello-framework', 'HEAD', {
        behaviors: {
            '#element': {
                'style': {
                    'backgroundColor': '#eee',
                    'color': 'blue',
                    'cursor': 'pointer',
                    'fontFamily': 'Helvetica'
                },

                'size': [200, 200],
                'align': [0.5, 0.5],
                'origin': [0.5, 0.5],
                'mount-point': [0.5, 0.5],

                'content': function(clickCount) { return '<h1>Clicked ' + clickCount + ' times</h1>'; },
                'rotation-z': function(rotationZ) { return rotationZ * Math.PI; }
            }
        },
        events: {
            '#element': {
                'click': function($state) {
                    $state.set('clickCount', $state.get('clickCount') + 1);
                    $state.set('rotationZ', $state.get('rotationZ') + 1, { duration: 1000, curve: 'easeOut' });
                }
            }
        },
        states: { clickCount: 0, rotationZ: 0 },
        tree: `<ui-element id="element"></ui-element>`
    });

Reload [localhost:1337](http://localhost:1337) in your browser. Take a moment to understand the visual changes. Try clicking the square at the center of the screen. Then, let's step through the code snippet above and deconstruct how it produces the scene you see.

## Breaking it down

### Tree

    tree: `<ui-element id="element"></ui-element>`

The tree declares the subcomponents that will live in your scene. Here, we have just one: a `ui-element`. The `ui-element` component is a pre-built core component that can be styled, sized, animated, and which can hold formatted content. In this example, we assign it an `id` of `"element"`, which allows you to connect it to your scene's events and behaviors.

It's important to remember that the tree is _not a template_. It is never rendered to the DOM. The tree is just an expression of your scene's scene graph. HTML is used merely because it provides a concise and familiar way to describe a tree structure whose nodes may have names and attributes.

### States

    states: { clickCount: 0, rotationZ: 0 }

Think of the states object as a simple bucket for data and settings that your scene cares about. Any data that may change over the lifespan of your scene should be included here and assigned a default value.

States can include any value that can be serialized to JSON. In our case, we need to keep track of two states: `clickCount`, the total number of clicks received, and `rotationZ`, for the current z-rotation of the rendered box.

### Events

    events: {
        '#element': {
            'click': function($state) {
                $state.set('clickCount', $state.get('clickCount') + 1);
                $state.set('rotationZ', $state.get('rotationZ') + 1, { duration: 1000, curve: 'easeOut' });
            }
        }
    }

Events are functions that respond to special triggers such as user interactions, and modify the internal state of the module.

Event functions are grouped into sub-objects whose keys are CSS-like selectors, which allow us to declare associations with components in our tree. In the example above, the `'#element'` key has the effect of associating all functions within the object to the `<ui-element id="element">` component.

An event function's property name (key) declares the name of the event we want to listen to. In this case, the pre-built `ui-element` will emit an event called `'click'` whenever it is clicked. Our function `'click'` will fire immediately in response.

Also note the use of the parameter name `$state` in our event function. In any event function signature, we can ask for the special object `$state` to be injected whenever the function runs. The `$state` object is a wrapper that gives us access to getter/setter methods on our state values.

This line shows how state values can be read from, and written to, in the most basic cases:

    $state.set('clickCount', $state.get('clickCount') + 1); // Simple increment

The state-wrapper's `.set` method also takes an options object, for cases when the value should change to the final value smoothly over time:

    $state.set('rotationZ', $state.get('rotationZ') + 1, { duration: 1000, curve: 'easeOut' });

### Behaviors

    behaviors: {
        '#element': {
            'style': {
                'backgroundColor': '#eee',
                'color': 'blue',
                'cursor': 'pointer',
                'fontFamily': 'Helvetica'
            },

            'size': [200, 200],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],

            'content': function(clickCount) { return '<h1>Clicked ' + clickCount + ' times</h1>'; },
            'rotation-z': function(rotationZ) { return rotationZ * Math.PI; }
        }
    }

Behaviors are your scene's home for presentation and effects logic. Sizing, positioning, CSS styling, content, and animation should all be specified within your scene's `behaviors` object. Much like in the `events` object, behaviors are applied to specific components using objects with CSS-like selector property names. 

For a behavior to work, the component to which it is applied must know how to implement the behavior given by the behavior's name. In this example, the `ui-element` component knows how to deal with behaviors called `style`, `size`, `content`, etc. Behaviors can be given as static (unchanging) values or as functions (that may return different values over the lifespan of the scene).

### Static behaviors

The example above makes use of several static behaviors: `style`, `size`, `align`, `origin`, and `mount-point`. The `style` object contains CSS properties. `size` gives the absolute size of the element in pixels. And together, `align`, `origin`, and `mount-point` control the anchor location of the element on the screen. (Try changing them around in your code editor.)

### Dynamic behaviors

In the example above, `content` and `rotation-z` are given as functions, meaning that they are dynamic behaviors. These functions will be triggered whenever certain state values change inside of the scene. Take a closer look at them:

    'content': function(clickCount) { ... },
    'rotation-z': function(rotationZ) { ... }

Note how the function paramater names here are precisely the same as the state values we assigned in our `states` object. The engine automatically detects this relationship, and will re-trigger these functions any time those specific state values change. I.e., `content` will fire any time `clickCount` changes, and `rotation-z` will fire any time `rotationZ` changes.

## Tying it back together

Now that we've explored each of the pieces of this more-complex example in depth, let's zoom out to a broader view and look at how they connect at a high level:

- The tree declares that our scene will include one component: `ui-element`
- In our behaviors, we apply static style and positioning to the `ui-element`
- When the `ui-element` is clicked, we change our states `clickCount` and `rotationZ`
- Our modification to `rotationZ` will initiate a gradual, animated change
- Whenever `clickCount` changes, we update the text with the new number
- Whenever `rotationZ` changes, the box will change its z-rotation accordingly (animate)

## More to explore

This guide has covered just a few of the simplest things you can do with the Famous Framework. Try changing around this example to see what you can make it do. Then, we encourage you to explore the rest of these guides to learn how to build more complex, advanced applications.
