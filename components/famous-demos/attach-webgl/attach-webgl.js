FamousFramework.scene('famous-demos:attach-webgl', {
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
        '#background' : {
            style: {
                'background-color' : '#7099EE'
            }
        }
    },
    tree: 'attach-webgl.html'
})
/**
 * Config:
 *      Include other files (.js, .css, etc) in your project.
 */
.config({ includes: ['webgl-example.js'] });
