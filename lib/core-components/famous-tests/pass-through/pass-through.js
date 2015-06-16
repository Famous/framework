FamousFramework.module('famous-tests:pass-through', {
    behaviors: {
        '#container' : {
            position: [50, 50]
        },
        '#label' : {
            size: [600, 200]
        },
        '#block-view': {
            position: [0, 200]
        },
        '.block' : {
            size: [200, 200],
            style: {
                'background-color' : 'navy',
                'color': 'white',
                'font-family': 'monospace',
                'font-weight': 'bold',
                'font-size': '16px'
            }
        },
        '#two' : {
            position: [250, 0]
        },
        '#three' : {
            position: [500, 0]
        },
        // <child-component> exposes 'pass-through' event for `position` that
        // allows the parent to directly interface with its <node>
        '#child' : {
            'position-view-node': [0, 500],
            content: `
                This child component's view is positioned directly by its
                parent because the child exposes a pass-through event for
                'position'.
            `
        }
    },
    events: {
        '$pass-through' : {
            '#one' : '*',
            '#two' : ['content', 'scale', 'style'],
            '#three' : {'block-size' : 'size'}
        }
    },
    tree: 'pass-through.html',
})
.config({
    imports: {
        'famous-tests:pass-through' : ['child-component']
    }
});
