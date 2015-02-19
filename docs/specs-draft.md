# BEST

BEST stands for "Behavior Event State Template". It's an architecture designed for module-oriented, stateful-and-functional applications.

BEST has two overarching goals:

1. Provide a usability layer on top of the rendering engine Yggdrasil
2. Ensure components are formatted such that there is a natural mapping to slider-/drag-and-drop-based IDE authoring (i.e., in Famo.us Hub)

That is, BEST is the framework that will allow Famo.us (as a company) to provide a vertically integrated set of services that bring lo-/no-coders and hardcore coders together.

Within the BEST universe, *everything* -- from the lowest-level components such as buttons to mid-level widgets like lightboxes to big applications like "twitter" -- are modules. Widgets contain widgets contain widgets.

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
            '#foo': ... ,
            '.bar': ... ,
            '.foo > .bar': ... 
        }
    });

Behaviors, when assigned, can be assigned using either string-based, or nested object-based notation (or a combination thereof). This is for convenience.

    * { think: { mcfly: { think: ... }}}
    * { 'think.mcfly.think': ... }
    * { 'think.mcfly': { think: ... }}

Behaviors can be static or dynamic. Static behaviors are given as _values_ of a valid type for that behavior. Dynamic behaviors are given as _functions_ that return a value of a valid type.

    behaviors: {
        marty: {
            'think.mcfly.think': ... ,
            'delorean': function(state) {
                return ... ;
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
                return ... ;
            }
        }
    },
    states: {
        einstein // Note how the property name maps to the argument name
        emmett: false
    }

Dependencies for a behavior are defined using the function's arguments. Said arguments should map to one or more named states.

Behaviors with explicit dependencies _only_ trigger when those named pieces of the state change. E.g., if I define a behavior with a `'booya'` dependency, that behavior will only run when the state value called `'booya'` changes.

Behavior names aren't just made up. They refer to behaviors that have been (globally) exported by other modules. Note that every behavior name needs to include the global namespace name (e.g. `famous.`).

    behavior                             | type
    -------------------------------------|---------------------
    famous.context                       | Object
    famous.context.align                 | Array.Number
    famous.context.anchor                | Array.Number
    famous.context.opacity               | Number
    famous.context.origin                | Array.Number
    famous.context.size                  | Array.Number
    famous.context.transform             | Object
    famous.context.transform.behind      | Boolean
    famous.context.transform.front       | Boolean
    famous.context.transform.rotate      | Array.Number
    famous.context.transform.scale       | Array.Number
    famous.context.transform.skew        | Array.Number
    famous.context.transform.translate   | Array.Number
    famous.control-flow                  | Object
    famous.control-flow.iff              | Boolean
    famous.control-flow.repeat           | Boolean
    famous.control-flow.yield            | String|Array.String
    famous.component                     | Object
    famous.component.camera              | Object
    famous.component.camera.far          | Number
    famous.component.camera.fieldOfView  | Number
    famous.component.camera.focalDepth   | Number
    famous.component.camera.near         | Number
    famous.component.camera.projection   | Number
    famous.component.element             | Object
    famous.component.element.attributes  | Object
    famous.component.element.content     | String
    famous.component.element.cssClasses  | Array.String
    famous.component.element.id          | String
    famous.component.element.styles      | Object
    famous.component.element.tagName     | String
    famous.component.element.trueSize    | Boolean
    famous.component.mesh                | Object
    famous.component.mesh.baseColor      | Number
    famous.component.mesh.geometry       | Array.Number
    famous.component.mesh.glossiness     | Number
    famous.component.mesh.metallic       | Number
    famous.component.mesh.normal         | Number

If you declare a behavior that is at the namespace level, e.g. `component.mesh`, then that behavior function is expected to return an object whose keys are each of the properties, e.g. `{ baseColor: ... , geometry: ..., ... }`.

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
                return ... ;
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
                    return ... ;
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
      insert: ... , // Component was added to the scene
      update: ... , // Component was updated by the engine (?)
      remove: ...  // Component was removed from the scene
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

State objects also support transitions on `set` operations that apply to _numeric_ scalar and vector values. E.g.:

    state.set('foo', 0.123, {duration: 1000, curve: 'linear'});

Internally, the state bag handles dirty-checking and re-injecting/re-evaluating values that are in transition.

## Templates

Templates are logicless descriptions of:

    * Component hierarchy (child module dependencies)
    * Mappings of 'native' events to component event handlers

Template entities are assigned selectors, similar to CSS selectors, for referencing within component behavior declarations.

Every component has _one_ template. That template can be defined as an XML string, as an object of nested objects, or as a string that references a local file that contains content in either valid format. The following are equivalent:

    // XML string
    template: `<famous.foo.bar id="foo" events.famous.dom.click="doClick">
        <bob.something.something class="lala">
            <p>Hello there</p>
        </bob.something.something>
    </famous.foo.bar>`

    // File reference
    template: 'babadook.dook.template.html'

    // Object
    template: {
        name: 'famous.foo.bar',
        id: 'foo',
        events: {
            'famous.dom.click': function(state) {

            }
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

Note that these names also require global namespacing.

    famous.dom.abort
    famous.dom.beforeinput
    famous.dom.blur
    famous.dom.canplay
    famous.dom.canplaythrough
    famous.dom.change
    famous.dom.click
    famous.dom.compositionend
    famous.dom.compositionstart
    famous.dom.compositionupdate
    famous.dom.contextmenu
    famous.dom.cuechange
    famous.dom.dblclick
    famous.dom.drag
    famous.dom.dragend
    famous.dom.dragenter
    famous.dom.dragleave
    famous.dom.dragover
    famous.dom.dragstart
    famous.dom.drop
    famous.dom.durationchange
    famous.dom.emptied
    famous.dom.ended
    famous.dom.error
    famous.dom.focus
    famous.dom.focusin
    famous.dom.focusout
    famous.dom.input
    famous.dom.invalid
    famous.dom.keydown
    famous.dom.keypress
    famous.dom.keyup
    famous.dom.load
    famous.dom.loadeddata
    famous.dom.loadedmetadata
    famous.dom.loadstart
    famous.dom.mousedown
    famous.dom.mouseenter
    famous.dom.mouseleave
    famous.dom.mousemove
    famous.dom.mouseout
    famous.dom.mouseover
    famous.dom.mouseup
    famous.dom.mousewheel
    famous.dom.pause
    famous.dom.play
    famous.dom.playing
    famous.dom.progress
    famous.dom.ratechange
    famous.dom.reset
    famous.dom.resize
    famous.dom.scroll
    famous.dom.seeked
    famous.dom.seeking
    famous.dom.select
    famous.dom.show
    famous.dom.stalled
    famous.dom.submit
    famous.dom.suspend
    famous.dom.timeupdate
    famous.dom.touchstart
    famous.dom.touchend
    famous.dom.touchmove
    famous.dom.unload
    famous.dom.volumechange
    famous.dom.waiting
    famous.dom.wheel
    famous.gesture.tap
    famous.gesture.doubletap
    famous.gesture.swipe
    famous.gesture.pinch
    famous.gesture.twist
    famous.gesture.spread
    famous.gesture.nudge
    famous.device.shake
    famous.device.accelerate
    famous.device.rotate
