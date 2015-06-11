FamousFramework.scene('famous-demos:repeat-color-wheel', {
    /**
     * Behaviors:
     *      Target the line in our tree
     *      using selectors and set size, style
     *      and other Famous properties.
     *
     *      Repeat:
     *          Repeat is used when we want to repeat
     *          some element in our tree.
     *
     *          We are using $repeat to make 360 lines.
     *
     *          Index:
     *              When using $repeat, we can inject $index
     *              to other behavior functions to gain access
     *              to that elements index.
     *
     *              We are using $index to rotate each line to
     *              make a circle. We are also using it to style
     *              each line a different color.
     */
    behaviors: {
        '.line': {
            'size': [window.innerWidth/4, 2],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            '$repeat': function() {
                var messages = [];
                for (var i = 0; i < 360; i++) {
                    messages.push({ i: i });
                }
                return messages;
            },
            'rotation-z': function($index) {
                return $index * Math.PI/360;
            },
            'style': function($index) {
                return {
                    'background': "hsl(" + $index + ", 100%, 50%)"
                }
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <node class="line"></node>
    `
});
