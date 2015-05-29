# Syntactic sugar

Famous Framework code is written in plain JavaScript, with built-in support for ES5 and ES6 through the [Babel](https://babeljs.io/) JavaScript transpiler. But the framework itself also provides some syntactical sugar that makes writing components even more concise.

#### Setter events

It's a common pattern for a framework component to expose an event whose sole job is to modify a bit of state whose name is the same as the event function. Consider this:

    events: {
        '$public': {
            'thing': function($state, $payload) {
                $state.set('thing', $payload);
            }
        }
    }

The following example is equivalent to the above:

    events: {
        '$public': {
            'thing': '[[setter]]'
        }
    }

Note that the name of the event must exactly match the state name.

#### Identity (setter) behaviors

Often, we write behavior functions that only react to a single state item, and simply return that state item's value. Consider this example:

    behaviors: {
        '#foo': {
            'hello': function(hello) {
                return hello;
            }
        }
    }

The following example is equivalent to the above:

    behaviors: {
        '#foo': {
            'hello': '[[setter]]'
        }
    }

Note that the name of the behavior must exactly match the state name.

#### Jade tree

If preferred, you can use [Jade](http://jade-lang.com/) syntax in your `tree`, for an even more concise way to declare your scene graph:

    tree: `
        ui-element#element
            p Hello world
        view#my-view
            view#my-other-view
                // etc
    `
