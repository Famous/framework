# $payload

`$payload` is an object representing the payload of an action that fired an event function. It can be dependency-injected into any event function, but it is `null` if the event that triggered it didn't send a message. Example:

```
FamousFramework.scene('example', {
    events: {
        '#foo': {
            'click': function($payload) {
                // Do something with the $payload
            }
        }
    }
});
```
