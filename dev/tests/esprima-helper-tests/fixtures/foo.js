function foo(){ return 1; }
var o = { foo: [1,2,3], bar: function(){} };
var b = 1;
// Hello there
var c = [[2,'3',(function(){return 1;})]];
var d = 1+3*654;
var f = Math.pow(23, 2);
FamousFramework.component('foo', { a: 1 });
FamousFramework.component('foo:bar', { a: function(b,c,d){return {};} });
FamousFramework.component('foo', {
}).config({
    imports: ['woo']
})
.foo({});
var re = /123/;
var a = {
    b: 1,
    c: '2',
    d: null,
    e: undefined,
    f: [1,2,3],
    g: [[1],[2],[3]],
    h: {},
    i: { i: 1 },
    j: { i: [] },
    k: { i: [{}]},
    l: function(){return 1;},
    m: (function(){return 1;}),
    n: (function(){return 1;}()),
    o: /123/i,
    p: 1+3*4,
    q: (1) ? 2 : 3,
    r: new Date(),
    s: Date.now(),
    t: re
};
