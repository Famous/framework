FamousFramework.scene('famous-tests:state-interruption', {
    behaviors: {
        '#square': {
            'position': '[[identity]]',
            'size': [100, 100],
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {
        '#square': {
            'click': function($state) {
                console.log('clicked!');

                // The square's position will remain at [0, 0]
                // because the second set will override the first

                $state
                    .set('position', [100, 100], { duration: 1000 })
                    .set('position', [0, 0])

                    // If we added a setTimeout instead of the second
                    // set above, the position of the square will be [0, 0]
                    // after 500 ms.

                    // setTimeout(function() {
                    //     $state.set('position', [0, 0]);
                    // }, 500);
            }
        }
    },
    states: {
        'position': [0, 0]
    },
    tree: `
        <node id="square"></node>
    `
});
