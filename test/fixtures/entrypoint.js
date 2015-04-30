function foo(){
    console.log(1);
}

BEST.scene('fixtures:entrypoint', {
    tree: '<view></view><ui-element></ui-element>',
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
        'famous:core:view': 'HEAD' // Intentionally set to a non-existant version
    }
});
