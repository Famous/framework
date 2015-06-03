BEST.scene('famous:demos:attach-webgl', {
    /**
     * Behaviors:
     *      Target the view in our tree
     *      using selectors and set its opacity.
     *
     *      Sugar:
     *          'opacity': '[[setter]]'
     *
     *          ... is equivalent to ...
     *
     *          'opacity': function(opacity) {
     *              return opacity;
     *          }
     */
    behaviors: {
        '#webgl' : {
            opacity: '[[setter]]',
        },
        '#view' : {
            scale: '[[setter]]',
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        },
        '#background' : {
            style: {
                'background-color' : '#7099EE'
            }
        }
    },
    /**
     * Events:
     *      Create public setter to allow
     *      other components to set its opacity.
     */
    events: {
        '$public' : {
            opacity: '[[setter]]',
            scale: '[[setter]]'
        }
    },
    /**
     * States:
     *      The opacity of this component will be 1.
     */
    states: {
        opacity: 1,
        scale: [1, 1, 1]
    },
    tree: 'attach-webgl.html'
})
/**
 * Config:
 *      Include other files (.js, .css, etc) in your project.
 */
.config({ includes: ['webgl-example.js'] });
