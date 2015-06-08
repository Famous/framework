// Copyright 2015 (c) Famous Industries, Inc.
'use strict';
BEST.includes("a","HEAD",["a.css","other.js","yaya.css"],function(){
    'use strict';
    BEST.module('famous:core:node', 'HEAD', {
        'dependencies': {},
        'extensions': []
    }, {}).config({
        'extends': [],
        includes: ['yaya.css']
    });
    function fromOther() {
    }
    BEST.attach('a', 'HEAD', '#ctx', function (node) {
        console.log(node);
    });
    'use strict';
    function foo() {
        return 1;
    }
    BEST.module('a', 'HEAD', {
        'dependencies': { 'famous:core:node': 'HEAD' },
        'extensions': [{
                'name': 'famous:core:node',
                'version': 'HEAD'
            }]
    }, {
        behaviors: {
            '$self': {
                'foobar': function (fooBar) {
                    return fooBar;
                }
            }
        },
        events: {
            '$public': {
                'yaya': function ($state, $payload) {
                    $state.set('yaya', $payload);
                }
            }
        },
        tree: '<h1>Hi</h1>\n        <famous:core:node><p>Foo</p></famous:core:node>\n        <img src="http://localhost:1618/v1/blocks/a/versions/HEAD/assets/foo.jpg">\n    '
    }).config({
        includes: [
            'a.css',
            'other.js'
        ]
    }).timelines({}).foobar().foobaz();
});
// Copyright 2015 (c) Famous Industries, Inc.