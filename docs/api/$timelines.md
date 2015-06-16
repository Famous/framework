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

### _.get()

Sets the current timeline. To start the timeline, call `.start()` after `.get()`.

**Arguments**

1. (String) timeline name

**Returns**
_($timelines)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one');
```

### _.start()

Plays the current timeline.

**Arguments**

1. (Object) Options object to specify duration + speed of timeline

**Returns**
_($timelines)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one').start({ duration: 1000 });
```

### _.halt()

Pauses an active timeline.

**Returns**
_($timelines)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one').halt();
```

### _.resume()

Unpauses an active timeline.

**Returns**
_($timelines)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one').resume();
```

### _.rewind()

Plays a timeline in reverse from the current time.

**Returns**
_($timelines)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one').rewind();
```

### _.isPaused()

Returns true/false if the current timeline is paused of not.

**Returns**
_(Boolean)_ component's instance of $timelines

**Example:**
```
$timelines.get('animation-one').isPaused();
```

