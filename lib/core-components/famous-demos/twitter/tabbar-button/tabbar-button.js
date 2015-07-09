FamousFramework.component('famous-demos:twitter:tabbar-button', {
    behaviors: {
        '.container': {
            'style': (backgroundColor) => {
                return {
                  'background-color': backgroundColor
                };
            }
        }
    },
    events: {
        '$public': {
            'background-color': '[[setter|backgroundColor]]'
        }
    },
    states: {
        backgroundColor: null
    },
    tree: `
        <node class="container"></node>
    `
});
