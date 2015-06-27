FamousFramework.module('famous-tests:opacity:child', {
    behaviors: {
        '$self': {
            opacity: (opacity) => {
                return opacity;
            },
            size: [120, 100],
            'style': {
                'background-image': 'url({{BASE_URL}}bottle-label.jpg)',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'display': 'block',
                'overflow': 'hidden'
            }
        }
    },
    events: {},
    states: {
        opacity: 0
    },
    tree: ''
});
