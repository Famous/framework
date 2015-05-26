function foo(){
    console.log(1);
}

var na = "woo";

BEST.scene('fixtures:entrypoint', 'HEAD', {
    tree: `<view></view><ui-element></ui-element>`,
    something: 'foo.js',
    another: {},
    lalalala: {
        foo: '@{yaya.jpg}'
    },
    events: {
        'mousemove': function() {
            return 1;
        },
        'foo-bar': 'setter|camel',
        '#foo': {
            'mouseover': function() {
                return 2;
            }
        }
    }
})
.config({
    imports: {
        'jim:project': ['thing']
    },
    dependencies: {
        'famous:core:view': '0.1.1' // Intentionally set to bad version
    }
});

BEST.scene('foo:bar', {
    tree: 'lalala.html'
});
