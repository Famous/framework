var Fs = require('fs');
var Path = require('path');

var name = 'fixtures:entrypoint';
var tag = 'HEAD';
var main = Fs.readFileSync(Path.join(__dirname, 'entrypoint.js'), { encoding: 'utf-8' });
var files = [
    { path: 'entrypoint.js', content: main },
    { path: 'foo.html', content: '<div></div>'},
    { path: 'foo.jade', content: '#foo'},
    { path: 'foo.js', content: 'alert(1)'},
    { path: 'lalala.html', content: '<ui-element></ui-element>' },
    { path: 'blah.less', content: '.class { width: (1 + 1) }' },
    { path: 'subdir/blah.styl', content: '.class\n\t  width: 100%' },
    { path: '~ecosystem.json', content: '{"foo":"bar"}' },
    //{ path: 'foob.sass', content: ' ' }, // <~ should generate a warning
    //{ path: '.something', content: ''}
];

module.exports = {
    name: name,
    tag: tag,
    files: files
};
