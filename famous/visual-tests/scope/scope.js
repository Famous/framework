BEST.module('visual-tests:scope', 'HEAD', {
    behaviors: {
        '#surface' : {
            'content' : 'This square should be blue. \n\n Above square should be gray.',
            'position' : [0, 225],
            style: {
                'background-color' : 'blue',
                'color' : 'white'
            },
            size: [200, 200]
        }
    },
    tree: 'scope.html',
})
.config({
    imports: {
        'famous:core': ['ui-element'],
        'famous:examples:demos': ['clickable-square']
    }
});
