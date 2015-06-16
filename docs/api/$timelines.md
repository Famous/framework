# $timelines

Every component has its own `$timelines` instance that may be used for manipulating timelines.

The component's $timelines instance may be accessed by dependency-injecting it into any event function:

```
FamousFramework.scene('example', {
    events: {
        '#foo': {
            'click': function($timelines) {
                // get and start a timeline
            }
        }
    }
});
```

## API

### .get(name)

Sets the currently active timeline. To start the timeline, call `.start()` after `.get()`.

Parameters:

1. `name {String}` - timeline name

Returns:

_($timelines)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one');
```


### .start(options)

Plays the currently active timeline.

Parameters:

1. `options {Object}` - options object to specify duration + speed of timeline

Returns:

_($timelines)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one').start({ duration: 1000 });
```


### .halt()

Pauses the currently active timeline.

Returns:

_($timelines)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one').halt();
```


### .resume()

Unpauses an active timeline.

Returns:

_($timelines)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one').resume();
```


### .rewind()

Plays a timeline in reverse from the current time.

Returns:

_($timelines)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one').rewind();
```


### .isPaused()

Returns true/false if the current timeline is paused or not.

Returns:

_(Boolean)_ component's instance of $timelines

Example:

```
$timelines.get('animation-one').isPaused();
```
