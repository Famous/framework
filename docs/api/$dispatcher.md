# $dispatcher

Every component has its own `$dispatcher` instance that may be used for emitting, broadcasting, triggering, and listening to events.

The `$dispatcher` is one of the key ways that components can pass messages internally and externally.

The component's `$dispatcher` instance may be accessed by dependency-injecting it into any event function:

```
FamousFramework.scene('example', {
    events: {
        '#foo': {
            'click': function($dispatcher) {
                // Emit, broadcast, or trigger events
            }
        }
    }
});
```

## API

### .broadcast(key, message)

Broadcast a message to descendants in the tree. (For downward messaging.)

Parameters:

1. `key {String}` - The event key
2. `message {Any}` - The message to send

Example:

```
$dispatcher.broadcast('foo', { bar: 'baz' });
```


### .emit(key, message)

Emit a message to ancestors in the tree. (For upward messaging.)

Parameters:

1. `key {String}` - The event key
2. `message {Any}` - The message to send

Example:

```
$dispatcher.emit('foo', { bar: 'baz' });
```


### .on(key, callback)

Subscribe to event with the given callback function. All messages of the given event key that target the current component will trigger the callback function.

Parameters:

1. `key {String}` - Key of the event to listen to
2. `callback(event) {Function}` - Callback function

Example:

```
$dispatcher.on('foo', function(event) {
    // The `event.detail` property contains the event payload
});
```


### .trigger(key, message)

Trigger an event to send to the current component. (For self messaging.)

Parameters:

1. `key {String}` - The event key
2. `message {Any}` - The message to send

Example:

```
$dispatcher.trigger('foo', { bar: 'baz' });
```
