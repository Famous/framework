'use strict';

var Lodash = require('lodash');

var EsprimaHelpers = require('./esprima-helpers');

function linkFacets(info, cb) {
    for (var moduleName in info.moduleDefinitionASTs) {
        EsprimaHelpers.eachStringProperty(info.moduleDefinitionASTs[moduleName], function(facetName, _1, facetValue, _2, facetProp) {
            var facetFile = Lodash.find(info.files, { path: facetValue });
            if (facetFile) {
                // Unlike other properties in the definition, the tree object is
                // an HTML string, and so it should be written as a string literal,
                // not parsed as JavaScript
                facetProp.value = (facetName === this.options.treeFacetKeyName)
                    ? EsprimaHelpers.buildStringLiteralAST(facetFile.content)
                    : EsprimaHelpers.parse(facetFile.content).body[0];
            }
        }.bind(this));
    }
    cb(null, info);
}

module.exports = linkFacets;
