# States

`states` is an object that carries the arbitrary data (or what you can think of as "settings") of a single component. Since behavior functions listen to changes in states, you can use states to drive animations. States cannot be shared between components, and only a component's [event functions](events.md) can modify state values, via the `$state.set` operation (see below).

## Overview

State values are stored as properties in the component's states object:

    FamousFramework.component('example', {
        states: {
            clickCount: 0
        }
    });

Behaviors functions respond to changes in these defined states. When a state value (e.g. `clickCount`) is listed as a parameter to a behavior function, that function will be called whenever that value changes. 

    FamousFramework.component('example', {
        behaviors: {
            '#someNode': {
                'rotation-z': function(clickCount){
                    return clickCount;
                }
            }
        }
    });

For example, the `rotation-z` behavior function will be called when `clickCount` state value changes. To actually go about changing `clickCount`, we use the `$state` object in conjunction with an event function. 

# The $state API

Event functions are able to dependency-inject a special `$state` object that gives access to special getter/setter methods for accessing and mutating the state values enclosed by the component.

    FamousFramework.component('example', {
        events: {
            '#foo': {
                'click': function($state) {
                    // manipulate state here
                }
            }
        }
    });

Let's look quickly at the APIs that this _state manager_ instance exposes to you. For brevity, we'll omit the rest of the boilerplate in the examples below. 

## Basics

The most basic methods are `.get()` and `.set()`, which work best when dealing with simple values and operations:

    // states are { foo: 1 }
    $state.get('foo'); // Returns `1`
    $state.set('foo', 2); // Sets the state `foo` to `2`

## Transitions

If we want to transition a state value to another value smoothly over time, we can pass a transition options object as the third argument:

    // states are { foo: 0 }
    $state.set('foo', 3, { duration: 1000 });

The above will transition the state value `foo` from `0` to `3` smoothly over the course of one second. We can also supply an easing curve:

    $state.set('foo', 3, { duration: 1000, curve: 'easeOutBounce' });

See the [easing curves table](http://famous.org/learn/easing-curves.html) for a full list of curves.

## Chaining transitions

If you want to transition a state value after some state value has completed a transition, use the `.thenSet()` method:

    $state.set('foo', 1, { duration: 1000 })
          .thenSet('bar', 2, { duration: 5000 })
          .thenSet('baz', 3.14);


## Complex / nested state values (arrays and objects)

States can store any JSON-serializable value including arrays and objects. Arrays are especially helpful when dealing with `$repeat` [control flow](control-flow) behaviors.

If you wish to access a single value within a states array, the `.get()` method accepts the state name and the index you wish to access passed to it in an array:
    
     // states are: { stateArray: ['blue','red','green'] }
     $state.get(['stateArray', 1])  // returns 'red'

Similar to the `.get()` method, you can set a single value in a states array by passing the `.set()` method an array with the name and target index as its first parameter and the new value as the second: 

    // states are: { stateArray: ['blue','red','green'] }
    $state.set(['stateArray', 2], 'purple')
    // after, states are: { stateArray: ['blue','red','purple']} 

For objects, the API is very similar, except instead of using the element index integer, you use a string for the name of the property key:

    // states are: { stateObj: { foo: 'bar' } }
    $state.set(['stateObj', 'foo'], 'ABC');
    // after, states are: { stateObj: { foo: 'ABC' } }
