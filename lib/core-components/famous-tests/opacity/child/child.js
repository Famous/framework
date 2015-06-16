FamousFramework.module('famous-tests:opacity:child', {
    behaviors: {
        '$self': {
            opacity: (opacity) => {
                console.log('child', opacity);
                return opacity;
            },
            size: [120, 100],
            'style': {
                'background-image': 'url({{@CDN_PATH}}bottle-label.jpg)',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'display': 'block',
                'overflow': 'hidden'
            }
        }
    },
    events: {},
    states: {
        // setting opacity to 0.000001 works
        // opacity: 0.000001
        // setting opacity to 0 does not work
        opacity: 0
    },
    tree: ''
});
