BEST.component('jordan:hfl-test', {
    tree: 'hfl-test.html',
    behaviors: {
        '#header-footer': {
            'headerSize': function(){
                return [undefined, 100];
            },
            'footerSize': function(){
                return [undefined, 100];
            },
            'layoutDirection': function() {
                return 0;
            }
        },
        '.header': {
            'style':  {
                'background-color': '#021900',
                'color': '#f3f3f3'
            }
        },
        '.content': {
            'style':  {
                'background-color': '#72E356'
            }
        },
        '.footer': {
            'style':  {
                'background-color': '#6EDB75'
            }
        }
    },
    events: {},
    states: {}
});
