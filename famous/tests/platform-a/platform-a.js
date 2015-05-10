BEST.scene('famous:tests:platform-a', 'HEAD', {
    tree: `<famous:core:context id="ctx"></famous:core:context>`
})
.config({
    includes: [
        'my-famous.js',
        'foo.css'
    ]
});
