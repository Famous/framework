'use strict';

var Child_Process = require('child_process');
var exec = Child_Process.exec;
var Path = require('path');
var Program = require('commander');

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
    var testPath = Path.join(__dirname, "tests/runtime-tests/**/*.spec.js");
    var testCmd = "browserify " + testPath + " -t [ envify ] -d | tap-closer | smokestack";
    execAndLog(testCmd);
}

function testStateManager() {
    var testPath = Path.join(__dirname, "tests/state-manager-tests/*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
}

function testUtilities() {
    var testPath = Path.join(__dirname, "tests/utilities-tests/*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
}

Program.command('runtime').action(testRuntime);
Program.command('state-manager').action(testStateManager);
Program.command('utilities').action(testUtilities);

Program.parse(process.argv);
