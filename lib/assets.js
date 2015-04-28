'use strict';

/**
 * Assets are static files, such as images. Since a component
 * may be dependent on various static files in order to run
 * properly, we provide an interpolation syntax so that they
 * can be referred to without developers needing to concern
 * themselves with pathing issues.
 */

var parser = require('./parser');
var path = require('./support/path');

var ASSETS_HOST = '';
var ASSET_REGEXP = /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig;
var ASSET_PREFIX_REGEXP = /\}$/;
var ASSET_SUFFIX_REGEXP = /^\@\{/;
var BLANK = '';
var COMPONENT_DELIMITER_REGEXP = /:/g;
var PIPE = '|';
var SLASH = '/';

function eachMatch(string, iterator) {
    var matches = string.match(ASSET_REGEXP) || [];
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var str = match + BLANK;
        str = str.replace(ASSET_PREFIX_REGEXP, BLANK)
                 .replace(ASSET_SUFFIX_REGEXP, BLANK)
                 .replace(COMPONENT_DELIMITER_REGEXP, SLASH)
                 .replace(PIPE, SLASH);
        iterator(match, str);
    }
}

function expand(definition) {
    parser.everyStringValue(definition, function(value, instance) {
        var matches = 0;
        eachMatch(value, function(match, replaced) {
            var fullPath = path.join(ASSETS_HOST, replaced);
            value = value.split(match).join(fullPath);
            matches++;
        });
        if (matches > 0) {
            instance.update(value);
        }
    });
}

module.exports = {
    expand: expand,
    eachMatch: eachMatch
};
