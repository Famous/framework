const SPRITE_TYPES = {
    'bottle': [200, 280],
    'bottle-label': [120, 100],
    'five-black': [275, 330],
    'five-color': [275, 330],
    'five-light': [275, 330],
    'getit': [211, 103],
    'letter-a': [27, 36],
    'letter-e': [27, 36],
    'letter-h': [27, 36],
    'letter-o': [27, 36],
    'letter-p': [27, 36],
    'letter-r': [27, 36],
    'letter-s': [27, 36],
    'light': [15, 15]
};
BEST.module('creative:sephora:sprite', {
    behaviors: {
        '#sprite': {
            'add-class': currType => { return `sephora-sprite-${currType}` },
            'remove-class': prevType => { return `sephora-sprite-${prevType}` },
            'mount-point': [0.5, 0.5],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: '[[identity|opacity]]',
            position: '[[identity|position]]',
            size: '[[identity|currSize]]'
        }
    },
    events: {
        '$public': {
            'type': ($state, $payload) => {
                let type = 'light';
                let size = SPRITE_TYPES[type];
                if (SPRITE_TYPES[$payload] !== undefined) {
                    type = $payload;
                    size = SPRITE_TYPES[$payload];
                }
                $state.set('prevType', $state.get('currType'));
                $state.set('currType', type);
                $state.set('currSize', size);
            }
        },
        '$pass-through' : {
            '#sprite' : ['position', 'opacity']
        }
    },
    states: {
        position: [0, 0],
        opacity: 1,
        currSize: [200, 240],
        currType: 'bottle',
        prevType: 'bottle'
    },
    tree: 'sprite.html'
});
