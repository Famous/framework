'use strict';

var Async = require('async');

var Config = require('./config/config');

function buildModule(name, files, options, finish) {
    Config.assign(options);

    return Async.waterfall([
        function(cb) {
            cb(null, name, files, {});
        },

        require('./preprocess-assets'),
        require('./extract-artifacts'),
        require('./link-facets'),
        require('./expand-imports'),
        require('./find-dependencies'),
        require('./load-dependencies'),
        require('./build-dependencies'),
        require('./expand-syntax'),
        require('./build-bundle')
    ], function(pipelineErr, nameOut, filesOut, dataOut) {
        if (pipelineErr) {
            return finish(pipelineErr);
        }

        console.log('famous framework: Built ' + nameOut);
        return finish(null, nameOut, filesOut, dataOut);
    });
}

module.exports = buildModule;
