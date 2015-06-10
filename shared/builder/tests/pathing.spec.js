'use strict';

var Test = require('tape');

var PathingHelpers = require('./../lib/storage-helpers/pathing');

var instanceObject = {
    options: {
        componentDelimiter: ':',
        componentSourceCodeRoute: '',
        codeManagerAssetReadHost: 'https://codeManagerAssetReadHost.com/codeManagerAssetReadHost',
        codeManagerAssetWriteHost: 'https://codeManagerAssetWriteHost.com/codeManagerAssetWriteHost',
        codeManagerVersionInfoHost: 'https://codeManagerVersionInfoHost.com/codeManagerVersionInfoHost',
        codeManagerApiVersion: 'v1',
        codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath',
        codeManagerBlockCreateRoute: 'POST|default|/:apiVersion/blocks',
        codeManagerBlockGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName',
        codeManagerVersionCreateRoute: 'POST|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions',
        codeManagerVersionUpdateRoute: 'PUT|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',
        codeManagerVersionGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',
        authHost: 'https://authHost.com/authHost',
        authApiVersion: 'v1',
        authConfigFilePath: '.famous/.config',
        authUserInfoRoute: 'GET|default|/:apiVersion/users',
        authStatusRoute: 'GET|default|/:apiVersion/status'
    }
};

var moduleName = 'foo:bar:baz';
var moduleVersion = '0123456789asdfghjkl';
var assetPath = 'hello/yaya/lala/hooray.jpg';

Test('pathing helpers', function(t) {
    t.plan(15);

    var buildAssetPathResult = PathingHelpers.buildAssetPath.call(instanceObject, moduleName, moduleVersion, assetPath);
    t.equals(buildAssetPathResult, '/v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl/assets/hello/yaya/lala/hooray.jpg');

    var buildAssetURLResult = PathingHelpers.buildAssetURL.call(instanceObject, moduleName, moduleVersion, assetPath);
    t.equals(buildAssetURLResult, 'https://codeManagerAssetReadHost.com/codeManagerAssetReadHost/v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl/assets/hello/yaya/lala/hooray.jpg');

    var buildBlockCreateURIResult = PathingHelpers.buildBlockCreateURI.call(instanceObject);
    t.equals(buildBlockCreateURIResult, 'https://codeManagerAssetWriteHost.com/codeManagerAssetWriteHost/v1/blocks');

    var buildVersionInfoURLResult = PathingHelpers.buildVersionInfoURL.call(instanceObject, moduleName, moduleVersion);
    t.equals(buildVersionInfoURLResult, 'https://codeManagerVersionInfoHost.com/codeManagerVersionInfoHost/v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl');

    var buildVersionPathResult = PathingHelpers.buildVersionPath.call(instanceObject, moduleName, moduleVersion);
    t.equals(buildVersionPathResult, '/v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl');

    var getAuthStatusMethodResult = PathingHelpers.getAuthStatusMethod.call(instanceObject);
    t.equals(getAuthStatusMethodResult, 'GET');

    var getAuthStatusURIResult = PathingHelpers.getAuthStatusURI.call(instanceObject);
    t.equals(getAuthStatusURIResult, 'https://authHost.com/authHost/v1/status');

    var getBlockCreateMethodResult = PathingHelpers.getBlockCreateMethod.call(instanceObject);
    t.equals(getBlockCreateMethodResult, 'POST');

    var getUserInfoMethodResult = PathingHelpers.getUserInfoMethod.call(instanceObject);
    t.equals(getUserInfoMethodResult, 'GET');

    var getUserInfoURIResult = PathingHelpers.getUserInfoURI.call(instanceObject);
    t.equals(getUserInfoURIResult, 'https://authHost.com/authHost/v1/users');

    var getVersionCreateMethodResult = PathingHelpers.getVersionCreateMethod.call(instanceObject);
    t.equals(getVersionCreateMethodResult, 'POST');

    var getVersionCreateURIResult = PathingHelpers.getVersionCreateURI.call(instanceObject, moduleName);
    t.equals(getVersionCreateURIResult, 'https://codeManagerAssetWriteHost.com/codeManagerAssetWriteHost/v1/blocks/foo:bar:baz/versions');

    var getVersionGetMethodResult = PathingHelpers.getVersionGetMethod.call(instanceObject);
    t.equals(getVersionGetMethodResult, 'GET');

    var getVersionPathResult = PathingHelpers.getVersionPath.call(instanceObject, moduleName, moduleVersion);
    t.equals(getVersionPathResult, 'v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl');

    var getVersionURLResult = PathingHelpers.getVersionURL.call(instanceObject, moduleName, moduleVersion);
    t.equals(getVersionURLResult, 'https://codeManagerAssetReadHost.com/codeManagerAssetReadHost/v1/blocks/foo:bar:baz/versions/0123456789asdfghjkl');
});
