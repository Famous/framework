var Path = require('path');
var Watch = require('node-watch');
var Exec = require('child_process').exec;
var Sys = require('sys');

var ROOT_DIR = Path.join(__dirname, '..');
var DATA_DIR = Path.join(ROOT_DIR, 'data');
var MODULES_DIR = Path.join(DATA_DIR, 'modules');

watch(MODULES_DIR, function(filename) {
    console.log(Path.basename(filename) + ' change triggers best-ecosystem resync');
    exec('cd ' + ROOT_DIR + ' && npm run sync-all', function(err, stdout, stderr) {
        if (err) console.error(err);
        else {
            Sys.puts(stdout);
            if (stderr) {
                console.error(stderr);
            }
        }
    });
});
