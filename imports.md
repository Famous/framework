# Imports

When making use of other modules, scenes can sometimes get more verbose than we'd like. Take this example:

    BEST.scene('foo:bar', 'HEAD', {
        behaviors: {
            '#el': {
                'famous:components:size': [200, 200]
            }
        },
        events: {
            '#el': {
                'famous:events:click': function($state) {
                    $state.set('foo', 1);
                }
            }
        },
        tree: `
            <robert.smitherson:accordion>
                <michael.raymond.jones:list-item>
                    <elise.brown:triangle-image />
                </michael.raymond.jones:list-item>
            </robert.smitherson:accordion>
        `
    });

Having to refer to all of these dependencies by their full name makes the code more verbose and more difficult to grasp at a glance.

To mitigate this, an `imports` object can be given with the `.config` method call that can be chained to the `BEST.scene` invocation. The following example is equivalent to the above:

    BEST.scene('foo:bar', 'HEAD', {
        behaviors: {
            '#el': {
                'size': [200, 200]
            }
        },
        events: {
            '#el': {
                'click': function($state) {
                    $state.set('foo', 1);
                }
            }
        },
        tree: `
            <accordion>
                <list-item>
                    <triangle-image />
                </list-item>
            </accordion>
        `
    })
    .config({
        imports: {
            'famous:components': ['size'],
            'famous:events': ['click'],
            'robert.smitherson': ['accordion'],
            'michael.raymond.jones': ['list-item'],
            'elise.brown': ['triangle-image']
        }
    });

### Modules imported by default

Several core modules are already imported for you by default:

    {
        'famous:core': [
            'components',
            'context',
            'dom-element',
            'ui-element',
            'view',
            'wrapper'
        ],
        'famous:events': [
            'click',
            'dblclick',
            'keydown',
            'keypress',
            'keyup',
            'mousedown',
            'mousemove',
            'mouseout',
            'mouseover',
            'mouseup'
        ]
    }

This explains why you are able to refer to, e.g., `<ui-element>` in your tree without needing to import it via its full module name.
