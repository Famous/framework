'use strict';

var Jsdom = require('jsdom');
var Lodash = require('lodash');

var BuildHelpers = require('./build-helpers');
var EsprimaHelpers = require('./esprima-helpers');

var BLANK = '';
var ALL_SELECTOR = '*';

/*
 behaviors
    selector
        behavior-name --> Level 2 depth is only location that may contain dependencies
            values
*/
function findDependencyKeys(objectAST, dependenciesList) {
    EsprimaHelpers.eachObjectProperty(objectAST, function(_0, _1, _2, selectorObject, propObj) {
        if (selectorObject) {
            EsprimaHelpers.eachObjectProperty(selectorObject, function(keyName){
                if (BuildHelpers.doesStringLookLikeDependency.call(this, keyName)) {
                    dependenciesList.push(BuildHelpers.dependencyStringToModuleName.call(this, keyName));
                }
            }.bind(this));
        }
    }.bind(this));
}

function findDependencies(info, cb) {
    var dependencyTable = {};
    var dependenciesList = [];
    var i;

    for (var moduleName in info.moduleDefinitionASTs) {
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        var moduleConfigAST = info.moduleConfigASTs[moduleName] || { properties: [] };

        // Collect dependencies from the definition objects.
        var treeValue;
        EsprimaHelpers.eachObjectProperty(moduleDefinitionAST, function(keyName, _1, actualValue, valueObject) {
            if (keyName === this.options.treeFacetKeyName) {
                treeValue = actualValue;
            }
            else {
                if (EsprimaHelpers.isObjectExpression(valueObject)) {
                    // `states` object cannot have any dependencies
                    if (keyName === this.options.behaviorsFacetKeyName || keyName === this.options.eventsFacetKeyName) {
                        findDependencyKeys.call(this, valueObject, dependenciesList);
                    }
                }
            }
        }.bind(this));

        // Collect dependencies from the tree object
        if (treeValue) {
            var virtualDOM = Jsdom.jsdom(treeValue);
            var doc = virtualDOM.defaultView.document;
            var elements = doc.querySelectorAll(ALL_SELECTOR);
            for (i = 0; i < elements.length; i++) {
                var element = elements[i];
                var name = element.tagName.toLowerCase();
                if (BuildHelpers.doesStringLookLikeDependency.call(this, name)) {
                    dependenciesList.push(name);
                }
            }
        }

        // Look for any explicit deps/refs in the config object
        var configObject = EsprimaHelpers.getObjectValue(moduleConfigAST);
        var existingDepTable = configObject[this.options.dependenciesKeyName] || {};
        for (var depName in existingDepTable) {
            var depRef = existingDepTable[depName];
            // Note that we overwrite dependencies previously loaded in here,
            // meaning only one dependency version per name
            dependencyTable[depName] = depRef;
        }

        // Check for `extends` key in config, use default extends if key is missing,
        // push values into dependency list
        var extensions = configObject.extends || this.options.defaultExtends;
        for (i = 0; i < extensions.length; i++) {
            dependenciesList.push(extensions[i]);
        }
    }

    // Finally, push any gathered dependencies into the table object
    var uniqDependencies = Lodash.uniq(dependenciesList);
    for (i = 0; i < uniqDependencies.length; i++) {
        var dependencyName = uniqDependencies[i];
        if (!dependencyTable[dependencyName]) {
            dependencyTable[dependencyName] = this.options.defaultDependencyVersion;
        }
    }

    info.dependencyTable = dependencyTable;
    cb(null, info);
}

module.exports = findDependencies;
