'use strict';

var Lodash = require('lodash');

var EsprimaHelpers = require('./esprima-helpers');

function linkFacets(info, cb) {
    for (var moduleName in info.moduleDefinitionASTs) {
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        EsprimaHelpers.eachStringProperty(moduleDefinitionAST, function(facetName, _1, facetValue, _2, facetProp) {
            var facetFile = Lodash.find(info.files, { path: facetValue });
            if (facetFile) {
                var facetContent = facetFile.content;
                // Unlike other properties in the definition, the tree object is
                // an HTML string, and so it should be written as a string literal,
                // not parsed as JavaScript
                if (facetName === this.options.treeFacetKeyName) {
                    facetProp.value = EsprimaHelpers.buildStringLiteralAST(facetContent);
                }
                else {
                    facetProp.value = EsprimaHelpers.parse(facetContent).body[0];
                }
            }
        }.bind(this));
    }
    cb(null, info);
}

module.exports = linkFacets;
