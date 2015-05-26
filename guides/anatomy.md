# Anatomy of a scene

This is an overview of our core team's taxonomy for the parts that make up a BEST scene. While it's not totally necessary to know while developing modules, it can be useful for when reporting bugs or other unexpected behavior.


    // ↓ framework namespace
    BEST.scene(...)


    //  ↓ module invocation
    BEST.scene(...)


    //         ↓ module name
    BEST.scene('foo:bar:baz', ...)


    //              ↓ module version
    BEST.scene(..., '0.1.1', ...)


    //                                ↓ module definition
    BEST.scene('foo:bar:baz', 'HEAD', { ... })



    BEST.scene('foo:bar:baz', 'HEAD', {

        // ↓ module facets
        behaviors: { ... }, // ← behaviors object
        events: { ... },    // ← events object
        states: { ... },    // ← states object
        tree: '...'         // ← tree declaration

    })



    BEST.scene('foo:bar:baz', 'HEAD', {
        behaviors: 'my-behaviors.js', // ← behaviors file reference
        events: 'my-events.js',       // ← events file reference
        states: 'my-states.js',       // ← states file reference
        tree: 'my-tree.html'          // ← tree file reference
    })



    BEST.scene('foo:bar:baz', 'HEAD', {
        behaviors: {

            // ↓ behavior selector
            '#yay': {   // ← behavior group object

                // ↓ behavior name
                'style': function(){...}, // ← (dynamic) behavior function
                'size': [100, 100]        // ← (static) behavior value
            }
        }
    });



    BEST.scene('foo:bar:baz', 'HEAD', {
        events: {

            // ↓ event selector
            '#yay': {   // ← event group object

                // ↓ event name
                'click': function(){...}, // ← event function
            }
        }
    });



    BEST.scene('foo:bar:baz', 'HEAD', {
        tree: `
            <view>                  <!-- ← tree node tag -->
                <ui-element>        <!-- ← tree node tag -->
                    <p>Foo bar</p>  <!-- ← injected HTML content -->
                </ui-element>
            </view>
        `
    });
