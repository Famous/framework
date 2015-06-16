# Anatomy of a scene

This is an overview of our core team's taxonomy for the parts that make up a framework scene. While it's not totally necessary to know while developing modules, it can be useful for when reporting bugs or other unexpected behavior.


    // ↓ framework namespace
    FamousFramework.component(...)


    //  ↓ module invocation
    FamousFramework.component(...)


    //         ↓ module name
    FamousFramework.component('foo:bar:baz', ...)


    //                                ↓ module definition
    FamousFramework.component('foo:bar:baz', { ... })



    FamousFramework.component('foo:bar:baz', {

        // ↓ module facets
        behaviors: { ... }, // ← behaviors object
        events: { ... },    // ← events object
        states: { ... },    // ← states object
        tree: '...'         // ← tree declaration

    })



    FamousFramework.component('foo:bar:baz', {
        behaviors: 'my-behaviors.js', // ← behaviors file reference
        events: 'my-events.js',       // ← events file reference
        states: 'my-states.js',       // ← states file reference
        tree: 'my-tree.html'          // ← tree file reference
    })



    FamousFramework.component('foo:bar:baz', {
        behaviors: {

            // ↓ behavior selector
            '#yay': {   // ← behavior group object

                // ↓ behavior name
                'style': function(){...}, // ← (dynamic) behavior function
                'size': [100, 100]        // ← (static) behavior value
            }
        }
    });



    FamousFramework.component('foo:bar:baz', {
        events: {

            // ↓ event selector
            '#yay': {   // ← event group object

                // ↓ event name
                'click': function(){...}, // ← event function
            }
        }
    });



    FamousFramework.component('foo:bar:baz', {
        tree: `
            <node>                  <!-- ← tree node tag -->
                <node>        <!-- ← tree node tag -->
                    <p>Foo bar</p>  <!-- ← injected HTML content -->
                </node>
            </node>
        `
    });
