# Behaviors

Behaviors describe how the elements in an application should appear. Behaviors handle everything from controlling size and positioning to adding control flow and dynamic content. By injecting state values into behaviors, we can make them respond to state changes and drive UI updates or tween animations.

## Structure

We attach behaviors to elements (or more specifically nodes) by using CSS-like selectors stored as members of the behaviors object. Each selector then contains its own object with a list of behaviors and values that it applies to the targeted node. 
   
    FamousFramework.component('example', {
        tree: '<node id="#foo"></node>',
        behaviors: {
            '#foo': {
                'size': [100,100],
                'position': [40,40],
                'content': 'bar'
            }
        }
    });

Above, we target the `#foo` node and provide it with `size`, `position`, and `content` behaviors. Although we assign the behaviors above to static values (`[100,100]`, `[40,40]`, `'bar'`), we can also declare any behavior as a function. 

## Behavior functions

Behavior functions are where the true power of behaviors shine. Think of them projections of the state. They can respond to state changes, but they can never make modifications to that state. 

Notice how we replace the `position` behavior from above with a _behavior function_ that accesses two state values: `positionX` and `positionY`.
    
    FamousFramework.component('example', {
        states: {
            positionX: 100,
            positionY: 100
        },
        behaviors: {
            '#foo': {
                'size':[100,100],
                'position': function(positionX, positionY) {
                    return [positionX, positionY];
                },
                content: 'bar'
            }
        }
    });

The `position` function above will fire any time the `positionX` or `postionY` values change in the state. Make sure to use the `return` value within behavior functions, otherwise the value will be `undefined`. States provided to behavior functions can be added in any order. 

## Default behaviors

Out of the box, all Famous Framework components have a collection of predefined behaviors:

- `'align'`: Aligns a node in relation to its parent. `align-x`, `align-y` and `align-z` also available.
- `'attributes'`: Adds an HTML attribute to the rendered element.
- `'base-color'`: Sets the base color or material for a WebGL mesh.
- `'box-shadow'`: Controls the CSS box-shadow property.
- `'camera'`: Lets you set the perspective for a scene. 
- `'content'`: Adds HTML or string content to the rendered element.
- `'geometry'`: Sets the verticies or shape of a WebGL mesh.
- `'id'`: Adds an HTML id attribute to the rendered element.
- `'mount-point'`: Defines the point on a node where a linear translation is be applied. `mount-point-x`, `moutn-point-y`, and `mount-point-z` also available.
- `'opacity'`: Sets the transparency for a node and all child nodes attached. Values range between 1 - 0, where 0 is fully transparent and 1 is no transparency applied.
- `'origin'`: Defines the point on a node should it rotate around or scale from. `origin-x`, `origin-y`, and `origin-z` also available.
- `'position'`: Defines a linear translation in pixel values. `position-x`, `position-y`, and `position-z` also available.
- `'scale'`: Used for animating the size of an element.`scale-x`, `scale-y`, and `scale-z` also available.
- `'size'`: Sets the absolute size of a node. `size-x`, `size-y`, and `size-z` also available. 
- `'size-absolute'`: Sets the size in pixels for a node, used in combo with other size 'modes'.`size-absolute-x`, `size-absolute-y`, and `size-absolute-z` also available. 
- `'size-true'`: Element assumes the size of its content. `size-true-x`, `size-true-y`, `size-true-z` also available. 
- `'size-differential'`: Size in pixels added to the proportional size. `size-differential-x`, `size-differential-y`, `size-differential-z` also available.
- `'size-proportional'`: Size node based on parent's size. `size-proportional-x`, `size-proportional-y`, `size-proportional-z` also available.
- `'style'`: Apply a list of inline CSS style properties.

## How behaviors are applied

Looking under the hood, behaviors are just messages sent to descendant components in the tree. The Famous core `node` component listens for the all of the behaviors listed above as events in its module definition.

    FamousFramework.component('example', {
        behaviors: {
            '#el': {
                'size': function() {
                    return [200, 200];
                }
            }
        },
        tree: `
            <node id="el"></node>
        `
    });

Here, since `node` exposes a `$public` event named `size` in its events object, it will respond to this event and modify the internal state. For more about custom or `$public` events, see the [events section](events.md).

## Applying behaviors to oneself

Behaviors need not apply only to the descendants of a scene. Using the `$self` behavior group, you can route behaviors to the scene itself:

    FamousFramework.component('example', 'HEAD', {
        behaviors: {
            '$self': {
                'foo': function() {
                    return 123;
                }
            }
        },
        events: {
            '$public': {
                // This function will run whenever this scene's 'foo'
                // behavior runs.
                'foo': function($payload) {
                    // Do logic here
                }
            }
        }
    });

Note: Events within the `$private` group will only be triggered by a scene's own `$self` behaviors.
