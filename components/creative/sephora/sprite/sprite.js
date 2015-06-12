const SPRITE_TYPES = {
    'bottle': [200, 280],
    'bottle-label': [120, 100],
    'five-black': [275, 330],
    'five-color': [275, 330],
    'five-light': [275, 330],
    'getit': [214, 104],
    'letter-a': [27, 36],
    'letter-e': [27, 36],
    'letter-h': [27, 36],
    'letter-o': [27, 36],
    'letter-p': [27, 36],
    'letter-r': [27, 36],
    'letter-s': [27, 36],
    'light': [15, 15],
    'no': [280, 280]
};
FamousFramework.module('creative:sephora:sprite', {
    behaviors: {
        '$self': {
            'add-class': currType => {
                return `sephora-${currType === 'no' ? 'icon' : 'sprite'}-${currType}`;
            },
            'align': '[[identity|align]]',
            'mount-point': [0.5, 0.5, 0.5],
            'opacity': '[[identity|opacity]]',
            'origin': [0.5, 0.5, 0.5],
            'position': '[[identity|position]]',
            'remove-class': prevType => {
                return `sephora-${prevType === 'no' ? 'icon' : 'sprite'}-${prevType}`;
            },
            'scale': '[[identity|scale]]',
            'size': '[[identity|currSize]]'
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
        }
    },
    states: {
        align: [0.5, 0.5, 0.5],
        currSize: [200, 240],
        currType: 'bottle',
        opacity: 0.7,
        position: [0, 0, 0],
        prevType: 'bottle',
        scale: [1, 1, 1]
    },
    tree: ''
});
