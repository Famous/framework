BEST.scene('super.demo.day:attach-webgl', 'HEAD', {
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
        '#view' : {
            opacity: '[[setter]]'
        }
    },
    /**
     * Events:
     *      Create public setter to allow
     *      other components to set its opacity.
     */
    events: {
        '$public' : {
            opacity: 'setter'
        }
    },
    /**
     * States:
     *      The opacity of this component will be 1.
     */
    states: {
        opacity: 1
    },
    tree: 'attach-webgl.html'
})
/**
 * Config:
 *      Include other files (.js, .css, etc) in your project.
 */
.config({ includes: ['webgl-example.js'] });
