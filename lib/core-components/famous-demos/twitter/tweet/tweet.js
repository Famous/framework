FamousFramework.component('famous-demos:twitter:tweet', {
    behaviors: {
        '.layout': {
            'ratios': [true, 1]
        },
        '.image': {
            'content': (imageURL) => {
                return `<img src="${imageURL}"></img>`
            },
            'size-absolute-x': '[[identity|imageWidth]]'
        },
        '.content': {
            'direction': 1,
            'ratios': [1, 1]
        },
        '.author': {
            'content': '[[identity|author]]',
            'style': (contentHeight) => {
                return {
                    'font-weight': 'bold',
                    'line-height': `${contentHeight / 2}px`,
                    'top': '5px'
                };
            }
        },
        '.tweet': {
            'content': '[[identity]]',
            'style': (contentHeight) => {
                return {
                    'line-height': `${contentHeight / 2}px`,
                    'top': '-5px'
                };
            }
        }
    },
    events: {
        '$self': {
            'size-change': ($famousNode, $state) => {
                let size = $famousNode.getSize();
                $state.set('contentHeight', size[1]);
            }
        },
        '$public': {
            'image-url': '[[setter|imageURL]]',
            'image-width': '[[setter|imageWidth]]',
            'tweet-author': '[[setter|author]]',
            'tweet-content': '[[setter|content]]'
        }
    },
    states: {
        author: '',
        content: '',
        contentHeight: null,
        imageURL: null,
        imageWidth: 0
    },
    tree: `
        <famous:layouts:flexible class="layout">
            <node class="image">

            </node>
            <famous:layouts:flexible class="content">
                <node class="author"></node>
                <node class="tweet"></node>
            </famous:layouts:flexible>
        </famous:layouts:flexible>
    `
}).config({
    includes: ['tweet.css']
});
