FamousFramework.scene('creative:twitter:messages:user', {
    behaviors: {
        '.user': {
            'size-absolute-y': '[[identity|sizeY]]',
            'position-y': '[[identity|positionY]]',
            'template': (model) => {
                return {
                    profileImg: '{{@CDN_PATH}}' + model.profileImg,
                    displayName: model.displayName,
                    userName: model.userName
                }
            }
        }
    },
    events: {
        '$public': {
            'model': '[[setter]]',
            'index': '[[setter]]',
            'sizeY': '[[setter]]',
            'positionY': '[[setter]]'
        }
    },
    states: {},
    tree: 'user.html'
}).config({
    includes: ['assets/styles/user.css'],
    imports: {}
});
