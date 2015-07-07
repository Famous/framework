FamousFramework.component('famous-demos:layouts:flexible:header-footer', {
    behaviors: {
        'famous:layouts:flexible': {
            'direction': 1,
            'ratios': [true, 1, true]
        },
        '.header': {
            'content': 'HEADER',
            'size-absolute-y': 100,
            'style': {
                'background-color': '#000',
                'color': '#fff'
            }
        },
        '.body': {
            'content': 'BODY',
            'style': {
                'background-color': '#ddd',
                'color': '#000'
            }
        },
        '.footer': {
            'content': 'FOOTER',
            'size-absolute-y': 50,
            'style': {
                'background-color': '#555',
                'color': '#fff'
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:flexible>
            <node class="header"></node>
            <node class="body"></node>
            <node class="footer"></node>
        </famous:layouts:flexible>
    `
});
