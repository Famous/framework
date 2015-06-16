function foo() {
    return 1;
}

FamousFramework.module('a', {
    behaviors: {
        '$self': {
            'foobar': '[[identity|fooBar]]'
        }
    },
    events: {
        '$public': {
            'yaya': '[[setter]]'
        }
    },
    tree: `
        <h1>Hi</h1>
        <node><p>Foo</p></node>
        <img src="{{@CDN_PATH}}foo.jpg">
    `
})
.config({
    includes: ['a.css', 'other.js']
})
.timelines({

})
.foobar()
.foobaz()
