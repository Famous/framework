# Control flow

The BEST framework currently supports three basic control-flow operations: `$if`, '$repeat', and `$yield`. Unlike other template-based frameworks, BEST doesn't support progrmaming these kinds of operations inside the structural declaration of your component (the tree). Instead, control flow must be implemented as behaviors.

## $if

The `$if` control-flow behavior is a special behavior that will add/remove selected components from the scene graph based on a boolean return value. Here's a simple example, in which an element is removed from the scene when it is clicked:

BEST.scene('zelda.zulu:control-flow-if', 'HEAD', {
    behaviors: {
        '#el': {
            // Elements in the tree that match the `#el` selector will
            // be added/removed from the scene depending on whether the
            // result of this function is true/false respectively
            '$if': function(toggle) {
                return toggle;
            }
        }
    },
    events: {
        '#el': {
            'click': function($state) {
                $state.set('toggle', false);
            }
        }
    },
    states: { toggle: true },
    tree: `<ui-element id="el"><p>Now you see me...</p></ui-element>`,
});

## $repeat

The `$repeat` control-flow behavior will repeat the selected components a certain number of times, where the number of times reflects the `.length` of the array returned from the function. For example, the following example repeats a `ui-element` three times:

    BEST.scene('zelda.zulu:repeat', 'HEAD', {
        tree: `<ui-element id="el"></ui-element>`,
        behaviors: {
            '#el': {
                '$repeat': function() {
                    return [
                        {position:[0,0],content:'Hello'},
                        {position:[50,50],content:'Howdy'},
                        {position:[100,100],content:'Ahoy'}
                    ];
                }
            }
        }
    });

If a objects are given as the array elements returned by the `$repeat` behavior, the properties of those object will be sent as event messages to each repeated component as it is initialized.

## $yield

The `$yield` control-flow behavior allows a component define the conditions under which a parent can insert content into it. In other words, when a `$yield` action occurs, control of some region within a component's tree is "yielded" to the parent.

    // This scene allows content to "punch through"
    BEST.scene('zelda.zulu:yield', 'HEAD', {
        tree: `
            <view id="main"></view>
            <view id="sidebar"></view>
        `,
        behaviors: {
            '#main': {
                '$yield': '#main-content'
            },
            '#sidebar': {
                '$yield': '#sidebar-content'
            }
        }
    });

    // This scene uses of zelda.zulu:yield's $yield behavior
    BEST.scene('someone:else', 'HEAD', {
        tree: `
            <zelda.zulu:yield>
                <ui-element id="main-content"></ui-element>
                <ui-element id="sidebar-content"></ui-element>
            </zelda.zulu:yield>
        `
    })

In the example above, we introduce one component, `zelda.zulu:yield`, which makes use of the `$yield` behavior. It has a specific rule for when another (parent) component tries to define content as its child.

For `zelda.zulu:yield`, the injected content will only be allowed if the injected elements have `id="main-content"` or `id="sidebar-content"`. Moreover, it specifically designates the elements within its own tree that the surrogate content will be placed. (`#main-content` will be inserted into `#main`, and `#sidebar-content` will be inserted into `#sidebar`.)

`$yield` is one of the most fundamental control-flow operations in BEST, because it makes component nesting, layouts, and default/overrideable content possible. And although most components will never need to use `$yield` behaviors directly, almost all will indirectly make use of it, any time they declare even a simple nested tree:

    <view>
        <other-thing></other-thing>
    </view>

One of the most commonly used pre-built components in BEST, `<famous:core:view>` (or just `<view>`) exists mainly as an empty container that content can be injected into.

## A word of warning about performance

Control flow operations should be used sparingly, when possible, because they make direct modifications to the scene graph structure any time they run, a potentially expensive operation. If hiding an element is the goal, for example, it may make sense to toggle a node's `opacity` instead of removing it from the scene entirely through the much-heavier `$if` behavior.
