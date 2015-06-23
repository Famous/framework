# Sugar

#### [[identity]] for behaviors

When developing components with many behaviors, you'll often find yourself writing a bunch of simple behaviors like this:

```
behaviors: {
    '#selector': {
        'behavior-one': function(myStateOne) {
            return myStateOne;
        },
        'behavior-two': function(myStateTwo) {
            return myStateTwo;
        },
        'behavior-three': function(myStateThree) {
            return myStateThree;
        }
    }
}
```

I.e., behavior functions that each react to one state item, and simply return that state value.

The framework provides a special `[[identity]]` syntax to express these, to help make your code more concise:

```
behaviors: {
    '#selector': {
        'behavior-one': '[[identity|myStateOne]]',
        'behavior-two': '[[identity|myStateTwo]]',
        'behavior-three': '[[identity|myStateThree]]'
    }
}
```

(In math, an [identity function is a function that always returns the same value that was used as its argument](https://en.wikipedia.org/wiki/Identity_function).)

The framework build process will recognize those strings and expand them into functions that are equivalent to the functions shown in the example above.

The first part of the string, `identity`, tells the framework that an identity behavior function is being established. The second part, e.g. `myStateOne`, tells the framework what state value the function should react to and return.

#### [[setter]] for events

It's quite common to create collections of events that simply set a state value to whatever the `$payload` sent to the event was. For example:

```
events: {
    '#selector': {
        'my-event-one': function($state, $payload) {
            $state.set('elasticity', $payload)
        },
        'my-event-two': function($state, $payload) {
            $state.set('speed', $payload)
        },
        'my-event-three': function($state, $payload) {
            $state.set('count', $payload)
        }
    }
}
```

Since this pattern is quite common, the framework provides a special `[[setter]]` syntax that can express this same logic in a more concise way:

```
events: {
    '#selector': {
        'my-event-one': '[[setter|elasticity]]',
        'my-event-two': '[[setter|speed]]',
        'my-event-three': '[[setter|count]]'
    }
}
```

The framework build process will recognize those strings and expand them into functions that are equivalent to the functions shown in the example above.

The first part of the string, `setter`, tells the framework that a setter event function is being established. The second part, e.g. `elasticity`, tells the framework the name of the state that should be set to whatever the `$payload` of the function was.
