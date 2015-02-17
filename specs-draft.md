# BEST

## Behaviors

Behaviors describe the visual qualities of the component, for any given state.

For example, a behavior might define that a component's size should change every time the screen orientation changes.

    BEST.component({
        behaviors: {} // No behaviors. Behold this dull world!
    });

Behaviors are _always_ namespaced under selectors which are declared in the template:

    BEST.component({
        behaviors: {
            biff: {} // No behaviors for 'biff'. Tragic!
        },
        template: {
            id: 'biff'
        }
    });

If the selector is just a plain alphanumeric property, it will map to the ID of a template element. But you can also use any CSS selector that would work with `document.querySelector`.

    BEST.component({
        behaviors: {
            '#foo': â€¦ ,
            '.bar': â€¦ ,
            '.foo > .bar': â€¦ 
        }
    });

Behaviors, when assigned, can be assigned using either string-based, or nested object-based notation (or a combination thereof). This is for convenience.

    * { think: { mcfly: { think: â€¦ }}}
    * { 'think.mcfly.think': â€¦ }
    * { 'think.mcfly': { think: â€¦ }}

Behaviors can be static or dynamic. Static behaviors are given as _values_ of a valid type for that behavior. Dynamic behaviors are given as _functions_ that return a value of a valid type.

    behaviors: {
        marty: {
            'think.mcfly.think': â€¦ ,
            'delorean': function(state) {
                return â€¦ ;
            }
        }
    },
    template: {
        id: 'marty'
    }

Dynamic behaviors _cannot set state_. They can only consume it.

Dynamic behaviors will be executed on every state change -- unless you assign dependencies!

    behaviors: {
        marty: {
            'delorean': function(einstein, emmett, state) {
                return â€¦ ;
            }
        }
    },
    states: {
        einstein // Note how the property name maps to the argument name
        emmett: false
    }

Dependencies for a behavior are defined using the function's arguments. Said arguments should map to one or more named states.

Behaviors with explicit dependencies _only_ trigger when those named pieces of the state change. E.g., if I define a behavior with a `'booya'` dependency, that behavior will only run when the state value called `'booya'` changes.

Behavior names aren't just made up. Behavior names either need to match the name of one or more built-in behaviors (see the list below), or the name of an event in one of the child's templates.

    behavior                      | type
    ------------------------------|---------------------
    context                       | Object
    context.align                 | Array.Number
    context.anchor                | Array.Number
    context.opacity               | Number
    context.origin                | Array.Number
    context.size                  | Array.Number
    context.transform             | Object
    context.transform.behind      | Boolean
    context.transform.front       | Boolean
    context.transform.rotate      | Array.Number
    context.transform.scale       | Array.Number
    context.transform.skew        | Array.Number
    context.transform.translate   | Array.Number
    control                       | Object
    control.iff                   | Boolean
    control.repeat                | Boolean
    control.yield                 | String|Array.String
    component                     | Object
    component.camera              | Object
    component.camera.far          | Number
    component.camera.fieldOfView  | Number
    component.camera.focalDepth   | Number
    component.camera.near         | Number
    component.camera.projection   | Number
    component.element             | Object
    component.element.attributes  | Object
    component.element.content     | String
    component.element.cssClasses  | Array.String
    component.element.id          | String
    component.element.styles      | Object
    component.element.tagName     | String
    component.element.trueSize    | Boolean
    component.mesh                | Object
    component.mesh.baseColor      | Number
    component.mesh.geometry       | Array.Number
    component.mesh.glossiness     | Number
    component.mesh.metallic       | Number
    component.mesh.normal         | Number

If you declare a behavior that is at the namespace level, e.g. `component.mesh`, then that behavior function is expected to return an object whose keys are each of the properties, e.g. `{ baseColor: â€¦ , geometry: â€¦, â€¦ }`.

## Events

Events are named functions that react to changes in the application -- for example, user interactions. Events are responsible for one thing: changing the component's states, and that's it.

    BEST.component({
        events: {} // What did the moo-cow say to the hen?
    });

There are four basic categories of events:

    * Behavior events
    * Command events
    * Internal events
    * Lifecycle events

Behavior events fire after behavior functions are triggered, and receive the output of those behavior functions as arguments.

    behaviors: {
        'sargeant-slaughter': {
            'context.size': function(state) {
                return â€¦ ;
            }
        }
    },
    events: {
        behavior: {
            'sargeant-slaughter.context.size': function(newSize) {
                // Fired after the matching function above runs,
                // receiving its output as the argument
            }
        }
    }

Command events can be triggered by the component's parent, but not by anyone else. Think of these events as a kind of public API for the component.

    var parent = BEST.component({
        behaviors: {
            'champion': {
                // Issue a command for the child component to fire
                // its matching behavior.
                'elbow-drop': function(state) {
                    return â€¦ ;
                }
            }
        },
        template: {
            children: [
                { from: child.template, id: 'champion' }
            ]
        }
    });

    var child = BEST.component({
        events: {
            // Note the important `command` namespace here
            command: {
                'elbow-drop': function(payload, state) {
                    // Receive an 'elbow-drop' command from the parent
                }
            }
        }
    });

Internal events respond to changes within the component itself -- most commonly user interactions. These events are almost always mapped to events that are named within the template.

    events: {
        internal: {
            'cheers': function(state) {
                state.set('victory', true);
            }
        }
    },
    template: {
        id: 'sargeant-slaughter',
        events: {
            dom: {
                // When a click happens, fire the 'cheers' handler
                click: 'cheers' 
            }
        }
    }

Lifecycle events are fired after the component reaches key points within its lifecycle (as an object in the scene graph).

    lifecycle: {
      insert: â€¦ , // Component was added to the scene
      update: â€¦ , // Component was updated by the engine (?)
      remove: â€¦  // Component was removed from the scene
      // Others?
    }

## States

States are -- are you ready? -- bits of the component's state. States can be any one of:

* Boolean
* Null
* Number
* String
* Object
* Array (of any of the above)

That is, any data type that can serialize to JSON.

    BEST.component({
        states: {
            foo: 0.123,
            bar: [
                { pow: 'wow' }
            ]
        }
    });

The state bag object (which gets passed into behavior functions when they are triggered) exposes getters and setters for all values in its hierarchy. In the case of scalar values:

    state.get('foo');
    state.set('foo', 0.123);

In the case of complex values, additional wrapper methods are provided that conform to the API of the raw object, but which the framework can still manage.

    // Let's say the state is { foo: 0.123, bar: [{ baz: 'qux' }] }
    state.get('bar').push({ pow: 'wow' }).pop().get('pow');

## Templates

Templates are logicless descriptions of:

    * Component hierarchy (child module dependencies)
    * Mappings of 'native' events to component event handlers

Template entities are assigned selectors, similar to CSS selectors, for referencing within component behavior declarations.

Every component has _one_ template. That template can be defined as a string (using an HTML-like syntax), or as an object of nested objects. The following two are equivalent:

    template: `<famous.foo.bar id="foo" events.dom.click="doClick">
        <bob.something.something class="lala">
            <p>Hello there</p>
        </bob.something.something>
    </famous.foo.bar>`

    template: {
        name: 'famous.foo.bar',
        id: 'foo',
        events: {
            dom: { click: 'doClick' }
        },
        children: [
            {
                name: 'bob.something.something',
                class: 'lala',
                content: [
                    name: 'p',
                    content: 'Hello there'
                ]
            }
        ]
    }

I.e., if a string is given, it will be parsed; if an object is given, it's assumed to conform to the accepted template data structure.

Events that are listened to within the template can be any of the following. Note the namespacing which can give the framework insight into a module's compatibility with events on the deployment environment.

    dom.abort
    dom.beforeinput
    dom.blur
    dom.canplay
    dom.canplaythrough
    dom.change
    dom.click
    dom.compositionend
    dom.compositionstart
    dom.compositionupdate
    dom.contextmenu
    dom.cuechange
    dom.dblclick
    dom.drag
    dom.dragend
    dom.dragenter
    dom.dragleave
    dom.dragover
    dom.dragstart
    dom.drop
    dom.durationchange
    dom.emptied
    dom.ended
    dom.error
    dom.focus
    dom.focusin
    dom.focusout
    dom.input
    dom.invalid
    dom.keydown
    dom.keypress
    dom.keyup
    dom.load
    dom.loadeddata
    dom.loadedmetadata
    dom.loadstart
    dom.mousedown
    dom.mouseenter
    dom.mouseleave
    dom.mousemove
    dom.mouseout
    dom.mouseover
    dom.mouseup
    dom.mousewheel
    dom.pause
    dom.play
    dom.playing
    dom.progress
    dom.ratechange
    dom.reset
    dom.resize
    dom.scroll
    dom.seeked
    dom.seeking
    dom.select
    dom.show
    dom.stalled
    dom.submit
    dom.suspend
    dom.timeupdate
    dom.touchstart
    dom.touchend
    dom.touchmove
    dom.unload
    dom.volumechange
    dom.waiting
    dom.wheel
    gesture.tap
    gesture.doubletap
    gesture.swipe
    gesture.pinch
    gesture.twist
    gesture.spread
    gesture.nudge
    device.shake
    device.accelerate
    device.rotate
