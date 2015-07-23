# Famous Framework (alpha)

The Famous Framework is a new JavaScript framework for creating reusable, composable, and interchangeable UI widgets and applications. It balances declarative with imperative and functional with stateful, and it's built on top of the [Famous Engine](https://github.com/Famous/engine).

**IMPORTANT:** This project is a developer preview; expect bugs to occur.

- - - -

## Setup &amp; installation

Make sure you have Node.js installed, at least version `0.12`.

Start by cloning this repository.

Then, install dependencies with:

    $ npm install

Once the install has finished, start up the local dev server:

    $ npm run dev -- -e famous-demos:clickable-square

Now surf to [localhost:1618/](http://localhost:1618/).

- - - -

## Creating a new component

In this project, create a new component directory within `lib/core-components` called `my-name`.

Create a subdirectory within that one for your new component called `my-component`.

In that subdirectory, create the file `my-component.js`. The result should be like this:

    lib/core-components/my-name/my-component/my-component.js

In that file, add the framework boilerplate:

    FamousFramework.component('my-name:my-component', {
        /* Your BEST code goes here */
        /* See below for examples */
    });

Note how the string `my-name:my-component` matches the filename `my-name/my-component/my-component.js`. This matching is required.

If your local dev server is currently running, stop it now. The restart it with:

    $ npm run dev -- -e my-name:my-component

Now surf to [localhost:1618/?ff=my-name:my-component](http://localhost:1618/?ff=my-name:my-component). (Note the query string in the URL.)

Changes you make to that file should trigger automatic reload.

- - - -

## Examples

Check out `lib/core-components/famous-demos` and `lib/core-components/famous-tests` for a bunch of examples that cover many of the main features and techniques. Below is a quick example of what a Famous Framework component looks like.

This code would lives in the file `lib/core-components/jane-doe/nifty-demo/nifty-demo.js`. (The convention of only lowercase letters and hyphens is important to stick to.)

    FamousFramework.component('jane-doe:nifty-demo', {
        behaviors: {
            '#box': {
                'size': [100, 100],
                'style': {
                    'background-color': '#40b2e8'
                },
                'rotation-z': function(rotation) {
                    return rotation;
                }
            }
        },
        events: {
            '#box': {
                'click': function($state) {
                    $state.set('rotation', $state.get('rotation') + 10, {
                        duration: 1000,
                        curve: 'easeOut'
                    });
                }
            }
        },
        states: {
            rotation: 0
        },
        tree: `<node id="box"></node>`
    });

- - - -

## Documentation

For API docs and guides, see [famous.org/framework](http://famous.org/framework/).

- - - -

## How to make the most of the framework:

1.) Color inside the lines: Although we've taken care to ensure you can break out of our guidelines and syntax when you need to, we think you'll have a better experience if you stick with them. In some cases, this means you'll have to approach familiar problems in a new way.

2.) Remember the microchip: In Famous Framework, every component is a black box. Sharing state between components is not provided for; you must build your app so that the inputs and outputs of each component connect and synchronize in the right way.

- - - -

## License

Copyright (c) 2015 Famous Industries, Inc. MIT license. See LICENSE.txt.
