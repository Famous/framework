FamousFramework.component('famous-demos:twitter:tabbar', {
    behaviors: {
        '$self': {
            'style': {
                'background-color': '#181818'
            }
        },
        '.layout': {
            'direction': 0,
            'ratios': [1, 1, 1]
        },
        '.one': {
            'background-color': '#000'
        },
        '.two': {
            'background-color': '#181818'
        },
        '.three': {
            'background-color': '#000'
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:flexible class="layout">
            <tabbar-button class="one"></tabbar-button>
            <tabbar-button class="two"></tabbar-button>
            <tabbar-button class="three"></tabbar-button>
        </famous:layouts:flexible>
    `
}).config({
    imports: {
        'famous-demos:twitter': ['tabbar-button']
    }
});
