var qs = require('qs');

console.log(qs.parse('a=c'));

FamousFramework.scene('famous-tests:custom-toolchain', {
    tree: `
        <h1 style="color:white;">You should see the console log something</h1>
        <node><p>Foo</p></node>
    `
});
