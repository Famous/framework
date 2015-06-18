# $payload

`$payload` is an object representing the payload of an action that fired an event function. It can be dependency-injected into any event function, but it is `undefined` if the event that triggered it didn't send a value along with the message. 

```
FamousFramework.scene('username:parent', {
    behaviors: {
        '#child' : {
            'child-event' : 10 
            // $payload in username:child's `child-event` will be 10
        }
    },
    events: {
        '$public' : {
            'parent-event' : function($payload) {
                // Do something with the $payload
            }
        }
    },
    tree: `
        <username:child id="child"></username:child>
    `
});

FamousFramework.scene('username:child', {
    events: {
        '$public' : {
            'child-event' : function($payload) {
                // Do something with the $payload
            }
        }
    }
});

FamousFramework.deploy('username:parent', 'HEAD', 'body');

FamousFramework.message('body', '$root', 'parent-event', {value: 10});
// $payload sent to username:parent's `parent-event` will be {value: 10}

FamousFramework.message('body', '$root', 'parent-event');
// $payload sent to username:parent's `parent-event` will be `null`

```