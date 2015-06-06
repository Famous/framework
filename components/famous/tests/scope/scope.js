BEST.module('famous:tests:scope', {
    behaviors: {
        '#surface' : {
            'content' : 'This square should be blue. \n\n Other square should be gray and rotate when you click it.',
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
