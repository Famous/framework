const COLORS = [
    'rgba(255, 0, 0, .7)',
    'rgba(0, 255, 0, .7)',
    'rgba(0, 0, 255, .7)',
    'rgba(255, 0, 0, .7)',
    'rgba(0, 255, 0, .7)',
    'rgba(0, 0, 255, .7)',
    'rgba(255, 0, 0, .7)',
    'rgba(0, 255, 0, .7)'
];
const INITIAL_RATIOS = [1, true, 1, true, 1, true, 1, true];
const FINAL_RATIOS = [4, true, 1, true, 0, true, 7, true];

FamousFramework.component('famous-demos:layouts:flexible:transition', {
    behaviors: {
        '$self': {
            'unselectable': true
        },
        '.title': {
            'align': [0.5, 1],
            'mount-point': [0.5, 1],
            'position-y': -25,
            'size-differential-x': -50,
            'size-absolute-y': 50,
            'content': (direction, ratios, transition) => {
                return `
                    < Ratios: ${JSON.stringify(ratios)} >
                    &bull;
                    < Direction: ${JSON.stringify(direction)} >
                    &bull;
                    < Transition: ${JSON.stringify(transition)} >
                `;
            },
            'style': {
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'border-radius': '50px',
                'color': '#fff',
                'line-height': '50px',
                'text-align': 'center',
                'z-index': 1000
            }
        },
        'famous:layouts:flexible': {
            'direction': '[[identity]]',
            'ratios': '[[identity]]',
            'transition': '[[identity]]'
        },
        '.flexible-layout-item': {
            '$repeat': '[[identity|colors]]',
            'size-mode': (direction) => {
                return [0, 0, 0].map((value, idx) => {
                    if (idx === direction) {
                        return null;
                    }
                    return value;
                });
            },
            'size-absolute': ($index, direction) => {
                return [null, null, null].map((value, idx) => {
                    if (idx === direction && $index % 2 !== 0) {
                        return 10;
                    }
                    return value;
                });
            },
            'style': ($index, colors) => {
                return {
                    'background-color': colors[$index]
                };
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': ($dispatcher) => {
                $dispatcher.trigger('toggle-direction', true);
                $dispatcher.trigger('toggle-ratios');
            }
        },
        '$self': {
            'click': ($dispatcher, $state) => {
                $dispatcher.trigger('toggle-ratios');
                if ($state.get('clickCount') % 2 !== 0) {
                    $dispatcher.trigger('toggle-direction', false);
                }
                $state.set('clickCount', $state.get('clickCount') + 1);
            }
        },
        '$public': {
            'toggle-direction': ($state, $payload) => {
                let direction = $state.get('directionToggled') ? 1 : 0;

                if ($payload) {
                    $state.set('direction', direction);
                } else {
                    setTimeout(() => {
                        $state.set('direction', direction);
                    }, $state.get(['transition', 'duration']) + 100);
                }

                $state.set('directionToggled', !$state.get('directionToggled'));
            },
            'toggle-ratios': ($state) => {
                $state.set('ratioToggled', !$state.get('ratioToggled'));
                $state.set('ratios', $state.get('ratioToggled') ? INITIAL_RATIOS : FINAL_RATIOS);
            }
        }
    },
    states: {
        clickCount: 0,
        colors: COLORS,
        direction: null,
        directionToggled: false,
        ratios: null,
        ratioToggled: false,
        transition: {
            curve: 'elasticInOut',
            duration: 300
        }
    },
    tree: `
        <node class="title"></node>
        <famous:layouts:flexible>
            <node class="flexible-layout-item"></node>
        </famous:layouts:flexible>
    `
});
