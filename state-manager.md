# The $state API

Event functions are able to dependency-inject a special `$state` object that gives access to special getter/setter methods for accessing and mutating the state values enclosed by the scene instance.

    events: {
        '#foo': {
            'click': function($state) {
                // manipulate state here
            }
        }
    }

In this guide, we'll look at the APIs that this _state manager_ instance exposes to you.

## Basics

The most basic methods are `.get` and `.set`, which work well when dealing with simple values and operations.

    // states are { foo: 1 }
    $state.get('foo'); // Returns `1`
    $state.set('foo', 2); // Sets the state `foo` to `2`

## Transitions

If we want to transition a state value to another value smoothly over time, we can pass a transition config object as the third argument:

    // states are { foo: 0 }
    $state.set('foo', 3, { duration: 1000 });

This will transition the state value `foo` from `0` to `3` smoothly over the course of one second. We can also supply an easing curve:

    $state.set('foo', 3, { duration: 1000, curve: 'easeOutBounce' });

## Chaining operations

For convenience, an API for chaining and performing multiple operations on individual state values is provided as well.

    // states are { foo: 0 }
    $state.chain('foo')
          .add(1)
          .subtract(2)
          .multiply(3)
          .divide(4);

    // states are { baz: 'hello' }
    $state.chain('baz')
          .toUpper()
          .toLower()
          .concat(' world!');

## Chaining transitions

If you want to transition a state value after some state value has completed a transition, use the `.thenSet` method:

    $state.set('foo', 1, { duration: 1000 })
          .thenSet('bar', 2, { duration: 5000 })
          .thenSet('baz', 3.14);

## Adding custom methods

You can also add your own operations and functions using the `.addOperator` method on the `$state` instance:

    $state.addOperator('factorial', function(num) {
        var factorial = 1;
        for (var i = 1; i <= num; i++) {
            factorial = factorial * num;
        }
        return factorial;
    });

    // Your new operator is accessible via `.chain`:
    // states are { foo: 10 }
    $state.chain('foo').factorial();  // `foo` is now 3628800
