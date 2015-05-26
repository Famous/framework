BEST.scene('famous:tests:platform-a', 'HEAD', {
    tree: `<view id="view"><context id="ctx"></context></view>`,
    behaviors: {
        '#view': {
            'position': [100, 100]
        }
    }
})
.config({
    includes: [
        'my-famous.js',
        'foo.css'
    ]
});
