var blar = [
    {
        title: 'HI',
        tag: 'myTag',
        rotation: {
            x: 0,
            y: 0,
            z: (-9 * Math.PI) / 180
        },
        position: {
            x: 30,
            y: 250,
            z: 0
        }
    },
    {
        title: 'HELLO',
        tag: 'myTag',
        rotation: {
            x: 0,
            y: 0,
            z: (.5 * Math.PI) / 180
        },
        position: {
            x: 20,
            y: 312,
            z: 0
        }
    },
    {
        title: 'YO',
        tag: 'myTag',
        rotation: {
            x: 0,
            y: 0,
            z: (30 * Math.PI) / 180
        },
        position: {
            x: -20,
            y: 355,
            z: 0
        }
    },
    {
        title: 'OLAH',
        tag: 'myTag',
        rotation: {
            x: 0,
            y: 0,
            z: (-23 * Math.PI) / 180
        },
        position: {
            x: 245,
            y: -30,
            z: 0
        }
    }
];

FamousFramework.scene('jordan.papaleo:flipping-cards', {
    behaviors: {
        '.flip-card': {
            '$repeat': (cards) => {
                let results = [];

                for(let i = 0, j = cards.length; i < j; i++) {
                    results.push({
                        index: i,
                        position: [-window.innerWidth, 300, i * 350],
                        model: cards[i]
                    });
                }

                return results;
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': ($dispatcher) => {
                $dispatcher.emit('loaded', true);
            }
        }
    },
    states: {
        cards: blar
    },
    tree: 'flipping-cards.html'
})
.config({
    imports: {
        'jordan.papaleo': ['flip-card']
    }
});
