BEST.scene('famous:tests:platform-a', {
    tree: `
        <h1 style="color:white;">You should see a red box. That box is controlled by raw platform code.</h1>
        <view id="view"><context id="ctx"></context></view>
    `,
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
