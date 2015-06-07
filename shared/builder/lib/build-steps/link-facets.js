'use strict';

var Lodash = require('lodash');

var AssetCompilers = require('./../asset-compilers');
var EsprimaHelpers = require('./../esprima-helpers');

function linkFacets(info, cb) {
    for (var moduleName in info.moduleDefinitionASTs) {
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        EsprimaHelpers.eachStringProperty(moduleDefinitionAST, function(facetName, _1, facetValue, _2, facetProp) {
            // Skip if the facet value is just plain empty
            if (facetValue && facetValue.length > 2) {
                // When we precompile assets a la tree.jade, we rewrite the compiled file
                // name to tree.jade.html, so if someone made reference to a tree.jade
                // as a facet, then we will try to convert it to the full form here.
                var facetFile = Lodash.find(info.files, { path: AssetCompilers.compiledPath(facetValue) });
                // But if the converted form didn't find a hit, we'll fall back to the
                // original reference that was made
                if (!facetFile) {
                    facetFile = Lodash.find(info.files, { path: facetValue });
                }
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
            }
        }.bind(this));
    }
    cb(null, info);
}

module.exports = linkFacets;
