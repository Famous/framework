var qs = require('qs');

console.log(qs.parse('a=c'));

BEST.scene('famous:tests:custom-toolchain', {
    tree: `
        <h1 style="color:white;">You should see the console log something</h1>
        <dom-element><p>Foo</p></dom-element>
    `
});
