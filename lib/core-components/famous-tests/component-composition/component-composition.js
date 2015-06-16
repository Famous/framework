FamousFramework.scene('famous-tests:component-composition', {
    behaviors: {
        '#box1': {
            'size': [200, 200],
            'position': [0, 0],
            'style': {
                background: 'rgba(255, 0, 0, 0.9)'
            }
        },
        '#box2': {
            'size': [200, 200],
            'position': [50, 50],
            // 'style': {
            //     background: 'rgba(0, 255, 0, 0.9)'
            // }
        },
        '#child1': {
            'size': [200, 200],
            'position': [250, 250],
            'style': {
                background: 'rgba(0, 0, 255, 0.9)'
            }
        }
    },
    events: {},
    states: {},
    tree: 'component-composition.html'
});
