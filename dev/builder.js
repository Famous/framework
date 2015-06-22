'use strict';

var Async = require('async');
var Chalk = require('chalk');

var buildBundle = require('./build-steps/build-bundle');
var derefDependencies = require('./build-steps/deref-dependencies');
var expandImportsShorthand = require('./build-steps/expand-imports-shorthand');
var expandSyntax = require('./build-steps/expand-syntax');
var extractCoreObjects = require('./build-steps/extract-core-objects');
var freezeDependencies = require('./build-steps/freeze-dependencies');
var findDependencies = require('./build-steps/find-dependencies');
var getSystemFiles = require('./build-steps/get-system-files');
var linkFacets = require('./build-steps/link-facets');
var loadDependencies = require('./build-steps/load-dependencies');
var preprocessFiles = require('./build-steps/preprocess-files');
var saveAssets = require('./build-steps/save-assets');
var saveFrameworkInfo = require('./build-steps/save-framework-info');
var saveBundle = require('./build-steps/save-bundle');

var Config = require('./config');

function Builder(options) {
    Config.assign(options || {});
    Config.set('buildModuleFunction', this.buildModule.bind(this));
}

Builder.prototype.buildModule = function(info, finish) {
    // If we are building the module as part of the dependency resolution
    // process of another module, then we're in a 'subDependencyCall'
    if (!info.subDependencyCall) {
        console.log('');
        console.log(Chalk.underline(Chalk.gray('famous')), Chalk.underline('Building module ' + info.name));
    }
    else {
        console.log(Chalk.gray('famous'), 'Building dependency ' + info.name + ' ~> ' + info.explicitVersion);
    }

    var subRoutines = [];

    subRoutines.push(getSystemFiles);
    subRoutines.push(preprocessFiles);
    subRoutines.push(extractCoreObjects);
    subRoutines.push(linkFacets);
    subRoutines.push(expandImportsShorthand);
    subRoutines.push(findDependencies);
    subRoutines.push(derefDependencies);
    subRoutines.push(freezeDependencies);
    subRoutines.push(loadDependencies);

    if (!Config.get('doSkipAssetSaveStep')) {
        // Note: Skipping here may assume that already have
        // an 'explicitVersion' set, since only saving assets
        // can give us the version ref for the component.
        subRoutines.push(saveAssets);
        subRoutines.push(saveFrameworkInfo);
    }

    subRoutines.push(expandSyntax);
    subRoutines.push(buildBundle);

    if (!Config.get('doSkipBundleSaveStep')) {
        subRoutines.push(saveBundle);
    }

    Async.seq.apply(Async, subRoutines)(info, function(err, result) {
        finish(err, result);
    });
};

module.exports = Builder;
