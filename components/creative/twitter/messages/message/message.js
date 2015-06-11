FamousFramework.scene('creative:twitter:messages:message', {
    behaviors: {
        '.message': {

        }
    },
    events: {
        '$public': {
            'model': '[[setter]]',
            'index': '[[setter]]'
        }
    },
    states: {},
    tree: 'message.html'
}).config({
    includes: ['assets/styles/messages.css'],
    imports: {}
});
