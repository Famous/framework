FamousFramework.scene('jordan.papaleo:flip-card', {
    behaviors: {
        '.flip-card': {
            'align': [.5, 0],
            'mount-point': [.5, 0],
            'origin': [.5, .5],
            'size': [350, 200],
            'style': (positionZ) => {
                return {
                    'background-color': '#CCCCCC',
                    'border': '2px solid orange',
                    'border-radius': '4px',
                    'font-family': 'Lato',
                    'font-size': '24px',
                    'text-align': 'center',
                    'z-index': positionZ
                };
            },
            'unselectable': true,
            'rotation-y': '[[identity|rotationY]]',
            'position': '[[identity|position]]',
            'position-z': '[[identity|positionZ]]',
            'position-x': '[[identity|positionX]]',
            'scale': '[[identity|scale]]',
            'template': (model) => {
                return {
                    title: model.title,
                    tag: model.tag
                };
            }
        }
    },
    events: {
        //Publicly accessible params
        '$public': {
            'position': '[[setter]]',
            'model': '[[setter]]'
        },
        '.flip-card': {
            'loaded': (payload) => {
                console.log('payload',payload);
            },
            'click': ($state) => {
                let rotY = ($state.get('rotationY') === 0) ? Math.PI * 180 / 180 : 0;
                $state.set('rotationY', rotY, {
                    duration: 1000,
                    curve: 'inOutBack'
                });
            },
            'mouseover': ($state) => {
                $state
                    .set('positionZ', 200, {
                        duration: 500
                    })
                    .set('scale', [1.1, 1.1, 1.1], {
                        duration: 500,
                        curve: 'outBack'
                    });
            },
            'mouseout': ($state) => {
                let rotationY = $state.get('rotationY');

                if(rotationY !== 0) {
                    $state.set('rotationY', 0, {
                        duration: 500,
                        curve: 'outBack'
                    });
                }

                $state
                    .set('scale', [1, 1, 1], {
                        duration: 500,
                        curve: 'outBack'
                    })
                    .set('positionZ', 0, {
                        duration: 500
                    });
            }
        }

    },
    states: {
        'rotationY': 0,
        'position': [0, 0, 0],
        'scale': [1, 1, 1],
        'model': {
            title: 'Hoi',
            tag: 'myTag'
        },
        'positionZ': 0,
        'positionX': 0
    },
    tree: 'flip-card.html'
});
