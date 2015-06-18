# $event

`$event` is an object corresponding to an event created by `$dispatcher.emit`/`$dispatcher.broadcast` or a UI event captured by the `famous:events` module. `$event` can be dependency injected into any event function. However, if the event function was not triggered by a `$dispatcher` or by a UI event processed by the `famous:events` module, the value of `$event` will be `null`.

Example when event handler is triggered by a behavior: 

```
FamousFramework.scene('username:foo', {
    behaviors: {
        '$self' : {
            'my-event' : 10
        }
    },
    events: {
        '$private' : {
            'my-event' : function($payload, $event) {
                // $event === null
                // $payload === 10
            }
        }
    },
});
```

Example when event handler is triggered by `$dispatcher.trigger`:

```
FamousFramework.scene('username:foo', {
    events: {
        '$lifecycle' : {
            'post-load' : function($dispatcher) {
                $dispatcher.trigger('start', {value: 'bar'});
            }
        },
        '$public' : {
            'start' : function($event, $payload) {
                debugger;
                // $event === null
                // $payload --> {value: 'bar'}
            }
        }
    },
});
```

Example when event handler is triggered by `$dispatcher.emit`

```
FamousFramework.scene('username:parent', {
    events: {
        '$lifecycle' : {
            'post-load' : function($dispatcher) {
                $dispatcher.broadcast('parent-loaded', {loaded: true});
            }
        }
    },
    tree: `
        <username:child id="child"></username:child>
    `
});

FamousFramework.scene('username:child', {
    events: {
        '$self' : {
            'parent-loaded' : function($event, $payload) {
                // $event is a CustomEvent (https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
                // $payload --> {loaded: true}
            }
        }
    }
});
```

Example when event handler is triggered by a native UI event processed by `famous:events`.

```
FamousFramework.scene('username:foo', {
    events: {
        '$self' : {
            'click' : function($event, $payload) {
                // $event is a MouseEvent that has been processed by FamousEngine.
                // The type of event will vary based on the event listener
                // (i.e. 'touchstart' will be a TouchEvent).

                // $payload === null
            }
        }
    }
});
```
Note that by default, an event named `click` will get expanded to `famous:events:click` and `famous:events` will properly register the UI events on to the component via FamousEngine.

Other event names corresponding to native UI events that automatically get prefixed with `famous:events` are:

`abort`, `beforeinput`, `blur`, `click`, `compositionend`, `compositionstart`, `compositionupdate`, `dblclick`, `focus`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mouseenter`, `mouseleave`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `scroll`, `select`, `touchcancel`, `touchend`, `touchmove `, `touchstart`, and `wheel`.

Example when event handler is triggered by a Gesture event processed by `famous:events`.

```
FamousFramework.scene('username:foo', {
    events: {
        '$self' : {
            'drag' : function($event, $payload) {
                // $event is a custom FamousEngine generated object with 
                // data corresponding to the gesture.

                // $payload === null
            }
        }
    }
});

```
Other event names corresponding to FamousEngine supported gestures are `pinch`, `rotate`, and `tap`.