'use strict';

var Async = require('async');
var Child_Process = require('child_process');
var exec = Child_Process.exec;
var Path = require('path');
var Program = require('commander');

var PROJECT_DIR = Path.join(__dirname, "..", "..");

function execAndLog(cmd) {
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.log(stderr);
    });
}

function testRuntime() {
    var testPath = Path.join(PROJECT_DIR, "browser/runtime/tests/**/*.spec.js");
    var testCmd = "browserify " + testPath + " -t [ envify ] -d | tap-closer | smokestack";
    execAndLog(testCmd);
}

function testStateManager() {
    var testPath = Path.join(PROJECT_DIR, "browser/state-manager/tests/*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
}

function testUtilities() {
    var testPath = Path.join(PROJECT_DIR, "browser/utilities/tests/*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
}

function testBuilder() {
    var cmds = [
        "tape " + Path.join(PROJECT_DIR, "shared/builder/tests/*.spec.js"),
        "tape " + Path.join(PROJECT_DIR, "shared/builder/tests/pathing.spec.js"),
        "tape " + Path.join(PROJECT_DIR, "shared/builder/tests/hub-deref-dependency.spec.js"),
        "tape " + Path.join(PROJECT_DIR, "shared/builder/lib/esprima-helpers/tests/*.spec.js")
    ];

    Async.eachSeries(cmds, execAndLog);
}

Program.command('runtime').action(testRuntime);
Program.command('state-manager').action(testStateManager);
Program.command('utilities').action(testUtilities);
Program.command('builder').action(testBuilder);

Program.parse(process.argv);
