'use strict';

var Colors = require('colors/safe');

var PREFIX = 'best-ecosystem: ';

function crash(err) {
    throw new Error(err || 'Uncaught exception');
}

function heading(message) {
    console.error(Colors.red.underline(PREFIX + message));
}

function warning(message) {
    console.log();
    console.warn(Colors.yellow.underline(PREFIX + message));
}

//function warn(message) {
//    console.warn(Colors.yellow(PREFIX + message));
//}

function note(message) {
    console.error(Colors.red(PREFIX + message));
}

function finalize(err, step, fin) {
    if (fin) {
        fin(err);
    }
    else if (step) {
        step(err);
    }
}

var handlers = {
    'failed-precompilation': function(err, info, step, fin, ok) {
        heading('Failed file precompilation!');
        note(err);
        fin(err);
    },
    'failed-finding-entrypoint': function(err, info, step, fin, ok) {
        heading('Failed to find entrypoint file!');
        note('Module given:' + info.moduleName);
        note(err);
        finalize(err, step, fin);
    },
    'failed-finding-definition-asts': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-finding-tag': function(err, info, step, fin, ok) {
        heading('Unable to find module tag!');
        note('Module given: `' + info.moduleName + '`');
        note(err);
        finalize(err, step, fin);
    },
    'failed-finding-config': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-linking-definitions': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-expanding-syntax': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-interpolating-strings': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-building-dependency-table': function(err, info, step, fin, ok) {
        note(err);
    },
    'failed-compiling-source': function(err, info, step, fin, ok) {
        heading('Compilation of file source failed!');
        note('File given: `' + info.filePath + '`');
        note(err);
        finalize(err, step, fin);
    },
    'no-compiler-found': function(err, info, step, fin, ok) {
        if (err) {
            console.warn(err);
        }
        var message = 'No compiler found for file extname `' + info.extname + '`. ';
        message += 'Leaving the file `' + info.path + '` untouched.';
        console.warn(message);
        ok();
    },
    'no-module-tag-found': function(err, info, step, fin, ok) {
        heading('No module tag found!');
        note('Module given: `' + info.moduleName + '`');
        note(err);
        finalize(err, step, fin);
    },
    'bad-module-tag-found': function(err, info, step, fin, ok) {
        heading('Missing or malformed module tag!');
        note('Module given: `' + info.moduleName + '`');
        note(err);
        finalize(err, step, fin);
    },
    'failed-version-compilation': function(err, info, step, fin, ok) {
        heading('Failed to compile module version!');
        note('Module given: `' + info.moduleName + '`');
        note(err);
        finalize(err, step, fin);
    },
    'failed-version-file-storage': function(err, info, step, fin, ok) {
        note(err);
        // fin(err);
    },
    'failed-version-storage': function(err, info, step, fin, ok) {
        note(err);
        fin(err);
    },
    'failed-version-bundling': function(err, info, step, fin, ok) {
        note(err);
        fin(err);
    },
    'failed-bundle-storage': function(err, info, step, fin, ok) {
        note(err);
        fin(err);
    },
    'no-asset-host-specified': function(err, info, step, fin, ok) {
        warning('No asset host has been specified!');
        note(err);
        if (ok) ok();
    }
};

function defaultHandler(err, type, info, stepCB, finalCB, okFn) {
    heading('Uncaught error `' + err + '`');
    note('Crashing the application...');
    crash(err);
}

function handle(err, type, info, stepCB, finalCB, okFn) {
    if (err) {
        if (handlers[type]) {
            handlers[type](err, info, stepCB, finalCB, okFn);
        }
        else {
            defaultHandler(err, type, info, stepCB, finalCB, okFn);
        }
    }
    else {
        if (okFn) {
            okFn();
        }
    }
}

module.exports = {
    handle: handle
};
