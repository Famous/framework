# $state

Every component has its own `$state` instance that may be used for getting and setting state.

The component's $state instance may be accessed by dependency-injecting it into any event function:

```
FamousFramework.scene('example', {
    events: {
        '#foo': {
            'click': function($state) {
                // Get or set state
            }
        }
    }
});
```

## API

### .get(key)

Aliases: `.getState(key)`

Parameters:

1. `key {String|Array}` state name or path array (in the case of nested state)

Returns:

_(Value)_ state value

Example:

```
$state.get('height');
```


### .getStateObject()

Returns:

_(Object)_ component's internal state object

Example:

```
$state.getStateObject();
```


### .getLatestStateChange()

Returns:

_(Array)_ array with then last state set and the value

Example:

```
$state.getLatestStateChange();
```


### .set(key, value, options)

Set component's state.

Aliases: `.setState()`

Parameters:

1. `key {String|Array}` - state name of path (in the case of nested state)
2. `value {Any}` - value to set state to
3. `options {Object}` - transitions object

Returns:

_(StateManager)_ component's instance of $state

Example:

```
$state.set('height', 200, { duration: 1000, curve: 'easeInOut' });
```


### .thenSet(key, value, options)

Set component's state after a set.

Aliases: `.thenSetState()`

Parameters:

1. `key {String|Array}` - state name of path (in the case of nested state)
2. `value {Any}` - value to set state to
3. `options {Object}` - transitions object

Returns:

_(StateManager)_ component's instance of $state

Example:

```
$state
    .set('height', 200, { duration: 1000, curve: 'easeInOut' })
    .thenSet('width', 200, { duration: 1000, curve: 'easeIn' });
```
