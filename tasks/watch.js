var path = require('path');
var watch = require('node-watch');
var exec = require('child_process').exec;
var sys = require('sys');

var ROOT_DIR = path.join(__dirname, '..');
var DATA_DIR = path.join(ROOT_DIR, 'data');
var MODULES_DIR = path.join(DATA_DIR, 'modules');

watch(MODULES_DIR, function(filename) {
    console.log(path.basename(filename) + ' change triggers best-ecosystem resync');
    exec('cd ' + ROOT_DIR + ' && npm run sync-all', function(err, stdout, stderr) {
        sys.puts(stdout);
    });
});
