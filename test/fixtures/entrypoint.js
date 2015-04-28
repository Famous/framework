BEST.module('fixtures:entrypoint', {
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
    }
});
