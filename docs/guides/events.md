# Events

Think of event functions as _state changers_. Their only job is to react to triggers ( such as user interactions and program events ) and make modifications to the scene's state. 

## Events structure

To add events, simply organize your _selectors_ (use [CSS style selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors))  and _event listener names_ in objects using the format below. Note how selectors are properties of the events object with each containing its set of listeners and corresponding functions all stored in another object: 

    events: {
        `selector1`: {
        	'event-listener-name1': function() {
        	    	//do something
        	 },
        	 'event-listener-name2': function(){
        	     //do something else
        	 }
        },
        `selector2`: {
            'event-listener-name1': function(){
                // do something else here
            }	
        }
    }

The objects provided to the event selectors specify which event listeners will be attached to the corresponding elements in the tree. Event listeners can be either be traditional DOM events ( 'click', 'mousedown', etc. ) or custom events. 

Visit the [anatomy section](anatomy.md) for more detail about an application's structure.

## Modifying the state

Events, and only events, can modify a module's [state](states.md) values. Via dependency injection, event functions can read and write to these values through the `$state` object. 

```
events: {	
    '.nav-button': {
        'click': function($state, $payload){
             //get the 'clickCount' value ( zero )
             var oldValue = $state.get('clickCount') 
             //increment the counter by 5 
             $state.set( 'clickCount', oldValue + 5 )
        }
    }  	 
},
states: {
	clickCount: 0 // will increment by 5 on a click
}
```

Here, we use the $state's `.get()` method to grab the state value for `clickCount` and the `.set()` method to replace it with a new incremented value. This event will occur every time a `'.nav-button'` element is clicked. 

Note that the `$state` is often included with a complementary `$payload` object, which is the message accompanying the source event. Above, the `$payload` would be a [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) object. 

_For more on the `$state` object's API visit the [states section](states.md)._

## Other stateful values

The `$state` object gives event functions access to the collection of values that are important to the business logic of the scene. But there are other stateful values that an event function can request, as well:

* `$famousNode` - A render node provided by the Famous Engine
* `$DOMElement` - The `DOMElement` component of a render node
* `$dispatcher` - An event dispatcher for emitting events
	
## Custom events

To emit a custom event message, you'll need to dependency-inject a `$dispatcher` instance into your event function:

    BEST.scene('foo:bar', 'HEAD', {
        events: {
            '$public': {
                'something': function($dispatcher) {
                    $dispatcher.emit('hello', 'my message');
                }
            }
        }
    });

Scenes can listen to messages emitted by any component declared in their tree.

    BEST.scene('my:scene', 'HEAD', {
        events: {
            '#foo': {
                // This will run any time a tree node matching '#foo'
                // emits a message whose key is 'hello'.
                'hello': function($payload) {
                    // Do business logic here
                }
            }
        },
        tree: `
            <foo:bar id="foo"></foo:bar>
        `
    });


The `$dispatch` also includes the following methods:

   - `.trigger()` - triggers an event within the tree.
   - `.broadcast()`- broadcast emits an event that can be intercepted outside of the module. 
   

## Component Events: $lifecycle

The `$lifecycle` group emits special events throughout the life of a component. To access these events, provide `'$lifecycle'` as a selector to the events object. 

Here, we set the state's `positionX` value to `250` over a 1000ms period after the component loads.
  
		 events: {
		        '$lifecycle': {
		            'post-load': function($state) {
		                $state.set('positionX', 250, {duration:1000})
		            }
		        }
		    },


`$lifecycle` events include:

  - `'post-load'`
  - `'pre-load'`

## Private vs. Public events

Events within the `$private` group will only be triggered by a scene's own `$self` behaviors.

    events: {
        '$private': {
            // Private events declared here
        }
    }

Visit the the _Applying behaviors to oneself_ in the [behaviors section](behaviors.md) for an explanation of `$self`  behaviors.

By contrast, `'$public'` is a special event group name that exposes event functions to other components. At a deeper level, all core Framework components use `$public` functions to implement behaviors. 


## How behaviors are applied

When you apply a behavior to some node in your scene's `tree`, you're really just sending a message to that descendant [component](resuable-components.md). The message will be received if the target [component](reusable-components.md) exposes an equivalently named event. 

Take this example of a scene that is applying a `'size'` behavior to a `ui-element` component:

    BEST.scene('my:scene', 'HEAD', {
        behaviors: {
            '#el': {
                'size': function(){ return [200, 200]; }
            }
        },
        tree: `
            <ui-element id="el"></ui-element>
        `
    });

As it turns out, the `ui-element` component (a.k.a. `famous:core:ui-element`) defines a event called `'size'` that it makes accessible to parent components. Its implementation looks (roughly) like this:

    BEST.scene('famous:core:ui-element', 'HEAD', {
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

Whenever `my:scene`'s behavior `'size'` is fired, the framework instantiates a new message with the behavior's return value as the message's contents. It then routes the message to all nodes in the tree that match the `'#el'` selector.

If any of those matching target nodes expose a "public" event that matches the message's name (`'size'`), then that event will be fired, with the injected `$payload` argument given to represent the value of the message's contents.
