function foo(){
    console.log(1);
}

BEST.scene('fixtures:entrypoint', {
    tree: '<view></view>',
    something: 'foo.js',
    another: {},
    lalalala: {
        foo: '@{yaya.jpg}'
    },
    events: {
        'mousemove': function() {
            return 1;
        },
        'foo-bar': 'setter|camel'
    }
})
.config({
    imports: {
        'jim:project': ['thing']
    },
    dependencies: {
        'famous:core:view': '0.1.1' // Intentionally set to a non-existant version
    }
});
