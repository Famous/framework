'use strict';

var Test = require('tape');

var Hub = require('./../lib/storage-helpers/hub');

var instanceObject = {
    options: {
        componentDelimiter: ':',
        codeManagerAssetReadHost: 'https://api-te.famo.us/codemanager',
        codeManagerVersionInfoHost: 'https://api-te.famo.us/codemanager',
        codeManagerApiVersion: 'v1',
        codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath',
        codeManagerVersionGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag'
    }
};

var moduleName = 'famous:core:node';
var moduleRef = 'HEAD';

Test('pathing helpers', function(t) {
    t.plan(1);

    var depsToDeref = {};
    depsToDeref[moduleName] = moduleRef;

    Hub.derefDependencies.call(instanceObject, instanceObject.options.codeManagerVersionInfoHost, depsToDeref, function(derefErr, dereffedDepTable) {
        t.ok(dereffedDepTable[moduleName], 'returns an object');
    });
});
