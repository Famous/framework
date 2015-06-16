Famous components vs. Framework components


### Bringing it all together

We add the behaviors, events, states, and tree as member of an object provided to a framework scene.  Together they make up what we call our `module definition`:
        
    BEST.scene('module name',  { module defintion } ) 

Within the `module definition`, the `module facets` can be listed as objects or by file reference:

	BEST.scene('foo:bar:baz', {

	    // ↓ module facets
	    behaviors: { ... }, // ← behaviors object
	    events: { ... },    // ← events object
	    states: { ... },    // ← states object
	    tree: '...'         // ← tree declaration

	})



	BEST.scene('foo:bar:baz', {
	    behaviors: 'my-behaviors.js', // ← behaviors file reference
	    events: 'my-events.js',       // ← events file reference
	    states: 'my-states.js',       // ← states file reference
	    tree: 'my-tree.html'          // ← tree file reference
	})

This structure keeps an application's code modular and tidy, even as it scales or changes. 

