# Events &amp; behaviors

Event and behavior functions are where most of the magic happens within your Famous Framework scene. Understanding the relationship between these two facets is key to making the most out of the framework. In this guide, we'll cover the core concepts as well as practical usage examples.

## Overview

Think of event functions as _state changers_. Their only job is to react to triggers (such as user interactions) and make modifications to the scene's state.

Behavior functions, on the other hand, are _projections of the state_. They respond to state changes, but never make modifications to that state.

## available behaviors

## Control Flow intro


## How behaviors are applied

When you apply a behavior to some node in your scene's `tree`, you're really just sending a message to that descendant component. The message will be received if the target component exposes an equivalently named event. Take this example of a scene that is applying a `'size'` behavior to a `ui-element` component:

    BEST.scene('my:scene', 'HEAD', {
        behaviors: {
            '#el': {
                'size': function(){ return [200, 200]; }
            }
        },
        tree: `
            <ui-element id="el"></ui-element>
        `
    });

As it turns out, the `ui-element` component (a.k.a. `famous:core:ui-element`) defines a event called `'size'` that it makes accessible to parent components. Its implementation looks (roughly) like this:

    BEST.scene('famous:core:ui-element', 'HEAD', {
        events: {
            // '$public' is a special event group name that says
            // "I am exposing these functions to other components"
            '$public': {
                'size': function($state, $payload) {
                    // $state is this scene's own state-manager
                    // $payload is the message that was sent, e.g. [200, 200]
                    // This component now has to decide how to change
                    // its internals in response to the message
                }
            }
        }
    });

Whenever `my:scene`'s behavior `'size'` is fired, the framework instantiates a new message with the behavior's return value as the message's contents. It then routes the message to all nodes in the tree that match the `'#el'` selector.

If any of those matching target nodes expose a "public" event that matches the message's name (`'size'`), then that event will be fired, with the injected `$payload` argument given to represent the value of the message's contents.

## Implementing an event

We like to say that event functions are "where the rubber meets the road." Via dependency injection, event functions can obtain access to the underlying stateful bits and pieces of the active scene.

The most basic type of state access an event function can get is to the `$state` object, usually with the complementary `$payload` that is the value of the received message:

    BEST.scene('foo:bar', 'HEAD', {
        events: {
            '$public': {
                'something-or-other': function($state, $payload) {
                    $state.set('foo', $payload);
                }
            }
        }
    });

The `$state` object gives event functions access to the collection of values that are important to the business logic of the scene. But there are other stateful values that an event function can request, as well:

* `$famousNode` - A render node provided by the Famous Engine
* `$DOMElement` - The `DOMElement` component of a render node
* `$dispatcher` - An event dispatcher for emitting events

## Emitting and listening to messages

To emit a message, you'll need to dependency-inject a `$dispatcher` instance into your event function:

    BEST.scene('foo:bar', 'HEAD', {
        events: {
            '$public': {
                'something': function($dispatcher) {
                    $dispatcher.emit('hello', 'my message');
                }
            }
        }
    });

Scenes can listen to messages emitted by any component declared in their tree.

    BEST.scene('my:scene', 'HEAD', {
        events: {
            '#foo': {
                // This will run any time a tree node matching '#foo'
                // emits a message whose key is 'hello'.
                'hello': function($payload) {
                    // Do business logic here
                }
            }
        },
        tree: `
            <foo:bar id="foo"></foo:bar>
        `
    });

## Applying behaviors to oneself

Behaviors need not apply only to the descendants of a scene. Using the `$self` behavior group, you can route behaviors to the scene itself:

    BEST.scene('my:scene', 'HEAD', {
        behaviors: {
            '$self': {
                'foo': function() {
                    return 123;
                }
            }
        },
        events: {
            '$public': {
                // This function will run whenever this scene's 'foo'
                // behavior runs.
                'foo': function($payload) {
                    // Do logic here
                }
            }
        }
    });

## Private events

Events within the `$private` group will only be triggered by a scene's own `$self` behaviors.

    events: {
        '$private': {
            // Private events declared here
        }
    }
