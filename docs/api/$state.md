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

### _.get()

**Aliases** _.getState()

**Arguments**

1. (String|Array) state name or path (in the case of nested state)

**Returns**
_(Value)_ state value

**Example:**
```
$state.get('height');
```

### _.getStateObject()

**Returns**
_(Object)_ component's internal state object

**Example:**
```
$state.getStateObject();
```

### _.getLatestStateChange()

**Returns**
_(Array)_ array with then last state set and the value

### _.set()

Set component's state.

**Aliases** _.setState()

**Arguments**

1. (String|Array) state name of path (in the case of nested state)

2. (Value) value to set state to

3. (Object) transitions object

**Returns**
_($state)_ component's instance of $state

**Example:**
```
$state.set('height', 200, { duration: 1000, curve: 'easeInOut' });
```

### _.thenSet()

Set component's state after a set.

**Aliases** _.thenSetState()

**Arguments**

1. (String|Array) state name of path (in the case of nested state)

2. (Value) value to set state to

3. (Object) transitions object

**Returns**
_($state)_ component's instance of $state

**Example:**
```
$state
    .set('height', 200, { duration: 1000, curve: 'easeInOut' })
    .thenSet('width', 200, { duration: 1000, curve: 'easeIn' });
```
