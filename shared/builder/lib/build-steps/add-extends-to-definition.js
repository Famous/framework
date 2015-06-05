'use strict';

var EsprimaHelpers = require('./esprima-helpers');
var QUOTE = '\'';

function addExtendsToDefintion(info, cb) {
    for (var moduleName in info.moduleDefinitionASTs) {
        var configObject = EsprimaHelpers.getObjectValue(info.moduleConfigASTs[moduleName] || { properties: [] });
        var extensions = configObject.extends || this.options.defaultExtends;
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];

        var res = EsprimaHelpers.buildEsprimaArrayFromArrayOfStrings(extensions);
        // console.log('[[[[[[[[[[[[[[[[');
        // console.log(res);
        // console.log('[[[[[[[[[[[[[[[[');

        moduleDefinitionAST.properties.push({
            type: 'Property',
            key: EsprimaHelpers.buildStringLiteralAST('extension'),
            computed: false,
            value: EsprimaHelpers.buildEsprimaArrayFromArrayOfStrings(extensions),
            method: false,
            kind: 'init',
            shorthand: false
        });
    }

    cb(null, info);
}

module.exports = addExtendsToDefintion;
