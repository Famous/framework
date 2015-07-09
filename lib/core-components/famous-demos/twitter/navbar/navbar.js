FamousFramework.component('famous-demos:twitter:navbar', {
    behaviors: {
        '$self': {
            'style': {
                'background': 'linear-gradient(to bottom, #76c5fb 0%, #60abe2 1%, #2978b1 99%, #18659d 100%)',
                'background-color': '#4294ce',
                'text-shadow': 'rgba(0, 0, 0, 0.75) 0px -1px 0px'
            }
        },
        '.layout': {
            'direction': 0,
            'ratios': [true, 1, true]
        },
        '.left': {
            'size-absolute-x': 100
        },
        '.logo': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'size-absolute-y': 25
        },
        '.right': {
            'size-absolute-x': 100
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:flexible class="layout">
            <node class="left">
                <navbar-button></navbar-button>
            </node>
            <node class="logo">
                <logo></logo>
            </node>
            <node class="right">
                <navbar-button></navbar-button>
            </node>
        </famous:layouts:flexible>
    `
}).config({
    imports: {
        'famous-demos:twitter': ['logo', 'navbar-button']
    }
});
