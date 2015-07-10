FamousFramework.component('famous-demos:twitter:tabbar-button', {
    behaviors: {
        '.container': {
            'style': (backgroundColor) => {
                return {
                  'background-color': backgroundColor
                };
            }
        },
        '.text': {
            'content': '[[identity|text]]',
            'align-y': 0.5,
            'mount-point-y': 0.5,
            'size-absolute-y': 18,
            'style': {
              'color': '#aaa',
              'font-size': '18px',
              'line-height': '18px',
              'text-align': 'center'
            }
        }
    },
    events: {
        '$public': {
            'background-color': '[[setter|backgroundColor]]',
            'text': '[[setter]]'
        }
    },
    states: {
        backgroundColor: null,
        text: ''
    },
    tree: `
        <node class="container">
          <node class="image"></node>
          <node class="text"></node>
        </node>
    `
});
