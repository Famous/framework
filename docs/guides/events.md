# Events

Think of event functions as _state changers_. Their only job is to react to triggers (such as user interactions and program events) and make modifications to the component's state.

## Events structure

When adding events to a component, organize them within objects grouped by _selectors_ (use [CSS style selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors)):

    FamousFramework.component('example', {
        events: {
            'selector1': {
            	'event-name1': function() {
            	    // do something
            	},
            	'event-name2': function(){
            	    // do something else
            	}
            },
            'selector2': {
                'event-name1': function(){
                    // do something else here
                }	
            }
        }
    });

The event object selectors specify which event functions will be attached to the corresponding elements in the tree. Event listeners can be either be traditional DOM events ('click', 'mousedown', etc) or custom programmatic events. 

## Modifying the state

Events, and only events, can modify a module's [state](states.md) values. Via dependency injection, event functions can read and write to these values through the `$state` object.

    FamousFramework.component('example', {
        events: {
            '.nav-button': {
                'click': function($state, $payload) {
                     // get the 'clickCount' value (zero)
                     var oldValue = $state.get('clickCount');
                     // increment the counter by 5 
                     $state.set('clickCount', oldValue + 5);
                }
            }  	 
        },
        states: {
        	clickCount: 0 // will increment by 5 on a click
        }
    });

Here, we use `$state.get()` to grab the state value for `clickCount` and the `.set()` method to replace it with a new incremented value. This event function will run every time a `'.nav-button'` element is clicked. 

It's common to dependency-inject a `$state` instance along with a complementary `$payload` object, which is the message accompanying the source event. In the example above, the `$payload` would be a [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object.

_For more on the `$state` object's API visit the [states section](states.md)._

## Custom events

To emit a custom event message, you'll need to dependency-inject a `$dispatcher` instance into your event function:

    FamousFramework.component('example', {
        events: {
            '$public': {
                'something': function($dispatcher) {
                    $dispatcher.emit('hello', 'my message');
                }
            }
        }
    });

Components can listen to messages emitted by any component declared in their tree.

    FamousFramework.component('example', {
        events: {
            '#foo': {
                // This will run any time a tree node matching '#foo'
                // emits a message whose key is 'hello'.
                'hello': function($payload) {
                    // Do business logic here
                }
            }
        },
        tree: `<node id="foo"></node>`
    });

## $lifecycle events

The `$lifecycle` event group allows you to listen for special events throughout the life of a component. To access these events, provide `'$lifecycle'` as a selector to the events object instead of a selector.

Here, we set the state's `positionX` value to `250` over a 1000ms period immediately after the component loads.
  
    FamousFramework.component('example', {
		events: {
	        '$lifecycle': {
	            'post-load': function($state) {
	                $state.set('positionX', 250, { duration:1000 });
	            }
	        }
		}
    });

`$lifecycle` events include:

- `'post-load'`
- `'pre-load'`
- `'pre-unload'`
- `'post-unload'`

## Private vs. public events

Events within the `$private` group will only be triggered by a scene's own `$self` behaviors.

    FamousFramework.component('example', {
        behaviors: {
            '$self': {
                'foo': function(...){...}
            }
        },
        events: {
            '$private': {
                'foo': function(...){...}
            }
        }
    });

By contrast, `'$public'` is a special event group name that exposes event functions to other components. All core Framework components use `$public` functions to expose an interface into their rendering logic.

## How behaviors are applied

When you apply a behavior to some node in your scene's `tree`, you're really just sending a message to that descendant. The message will be received if the target component exposes an equivalently named event.

Take this example of a scene that is applying a `'size'` behavior to a `ui-element` component:

    FamousFramework.component('example', {
        behaviors: {
            '#el': {
                'size': function(){ return [200, 200]; }
            }
        },
        tree: `<node id="el"></node>`
    });

As it turns out, the `node` base component defines a event called `'size'` that it makes accessible to parent components. Its implementation looks (roughly) like this:

    FamousFramework.component('famous:core:node', {
        events: {
            // '$public' is a special event group name that says
            // "I am exposing these functions to other components"
            '$public': {
                'size': function($state, $payload) {
                    // $state is this scene's own state-manager
                    // $payload is the message that was sent, e.g. [200, 200]
                    // This component now has to decide how to change
                    // its internals in response to the message
                }
            }
        }
    });

Whenever `example`'s behavior `'size'` is fired, the framework instantiates a new message with the behavior's return value as the message's contents. It then routes the message to all nodes in the tree that match the `'#el'` selector.

If any of those matching target nodes expose a "public" event that matches the message's name (`'size'`), then that event will be fired, with the injected `$payload` argument given to represent the value of the message's contents.

## Event Injectables

[`$dispatcher`](https://github.com/Famous/framework/blob/develop/docs/api/%24dispatcher.md)

[`$event`](https://github.com/Famous/framework/blob/develop/docs/api/%24event.md)

[`$index`](https://github.com/Famous/framework/blob/develop/docs/api/%24index.md)

[`$payload`](https://github.com/Famous/framework/blob/develop/docs/api/%24payload.md)

[`$repeatPayload`](https://github.com/Famous/framework/blob/develop/docs/api/%24repeatPayload.md)

[`$state`](https://github.com/Famous/framework/blob/develop/docs/api/%24state.md)

[`$timelines`](https://github.com/Famous/framework/blob/develop/docs/api/%24timelines.md)