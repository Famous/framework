BEST.module('famous:tests:scope', 'HEAD', {
    behaviors: {
        '#surface' : {
            'content' : 'This square should be blue. \n\n Above square should be gray.',
            'position' : [100, 325],
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
        'famous:demos': ['clickable-square']
    }
});
