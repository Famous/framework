'use strict';

var find = require('lodash.find');

var EsprimaHelpers = require('./helpers/esprima');
var Config = require('./config/config');

/**
 * E.g., this will convert:
 *   FamousFramework.scene(..., {
 *       tree: 'tree.html'
 *   })
 * To:
 *   FamousFramework.scene(..., {
 *       tree: '<node></node><node></node>'
 *   })
 * By inlining the content of the referred-to file
 */
function linkFacets(name, files, data, finish) {
    for (var moduleName in data.moduleDefinitionASTs) {
        EsprimaHelpers.eachStringProperty(data.moduleDefinitionASTs[moduleName], function(facetName, _1, facetValue, _2, facetProp) {
            // Skip if the facet value is just plain empty
            if (facetValue && facetValue.length > 2) {
                var facetFile = find(files, { path: facetValue });

                if (facetFile) {
                    var facetContent = facetFile.content;

                    // Unlike other properties in the definition, the tree object is
                    // an HTML string, and so it should be written as a string literal,
                    // not parsed as JavaScript
                    if (facetName === Config.get('treeFacetKeyName')) {
                        facetProp.value = EsprimaHelpers.buildStringLiteralAST(facetContent);
                    }
                    else {
                        facetProp.value = EsprimaHelpers.parse(facetContent).body[0];
                    }
                }
            }
        });
    }

    return finish(null, name, files, data);
}

module.exports = linkFacets;
