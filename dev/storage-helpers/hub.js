'use strict';

var Async = require('async');
var Chalk = require('chalk');
var FormData = require('form-data'); // Hacked version of form-data that doesn't 'basename' the filepath
var Lodash = require('lodash');
var Path = require('path');
var Request = require('request');

var BuildHelpers = require('./../build-helpers/build-helpers');
var BundleCollection = require('./bundle-collection');
var PathingHelpers = require('./pathing');

var config = require('./../config');

var SHA_LENGTH = 64;
var SHA_REGEXP = /^([a-zA-Z0-9])+$/i;
var ARE_BLOCKS_PUBLIC = true;
var AUTH_TOKEN_HEADER_NAME = 'X-AUTHENTICATION-TOKEN';
var AUTH_STATUS_IS_SIGNED_IN_CODE = 204;
var FAMOUS_USER_ID_HEADER_NAME = 'x-famous-user-id';

function loadDependency(assetReadHost, versionInfoHost, dependencyTuple, cb) {
    if (!versionInfoHost) {
        return cb(new Error('No such dependency'));
    }

    var dependencyName = dependencyTuple[0];
    var dependencyVersion = dependencyTuple[1];
    var dependencyParcelBaseURL = PathingHelpers.buildVersionInfoURL(dependencyName, dependencyVersion);
    var dependencyParcelURL = dependencyParcelBaseURL + '/assets/' + Config.get('parcelAssetPath');

    Request({
        method: 'GET',
        uri: dependencyParcelURL
    }, function(parcelLoadErr, parcelResp, parcelBody) {
        if (parcelLoadErr) {
            return cb(parcelLoadErr);
        }

        var parcelHash = JSON.parse(parcelBody);

        return cb(null, parcelHash);
    });
}

function loadDependencies(assetReadHost, versionInfoHost, dependenciesWanted, dependenciesFound, cb) {
    var refTuples = Lodash.pairs(dependenciesWanted);

    Async.map(refTuples, loadDependency.bind(null, assetReadHost, versionInfoHost), function(depLoadErr, parcelsLoaded) {
        if (depLoadErr) {
            return cb(null, dependenciesWanted, dependenciesFound);
        }

        for (var i = 0; i < parcelsLoaded.length; i++) {
            var loadedDependencyName = refTuples[i][0];
            dependenciesFound[loadedDependencyName] = parcelsLoaded[i];
        }

        return cb(null, dependenciesWanted, dependenciesFound);
    });
}

function derefDependency(refTuple, cb) {
    var depName = refTuple[0];
    var depRef = refTuple[1];

    // HACK because code manager expects that 'head' ref be lowercase
    if (depRef === 'HEAD') {
        depRef = 'head';
    }

    if (depRef && depRef.length === SHA_LENGTH && SHA_REGEXP.test(depRef)) {
        // The dependency version already looks like a ref, so we will
        // assume that it has previously been dereferenced
        return cb(null, refTuple);
    }

    var versionURL = PathingHelpers.buildVersionInfoURL(depName, depRef);

    Request({
        method: PathingHelpers.getVersionGetMethod(),
        uri: versionURL
    }, function(reqErr, response, body) {
        if (reqErr || response.statusCode > 299) {
            console.warn(Chalk.gray('famous'), Chalk.yellow('warn'), 'Couldn\'t resolve ' + depName + ' ~> ' + refTuple[1]);
            cb(new Error('Error resolving dependency for `' + depName + '` (' + refTuple[1] + '); contining...'), refTuple);
        }

        var parsedBody = JSON.parse(body);
        var versionRefFound = parsedBody.version.ref;

        console.log(Chalk.gray('famous'), Chalk.green('ok'), 'Resolved ' + depName + ' ~> ' + refTuple[1] + ' to ' + depName + ' ~> ' + versionRefFound);

        return cb(null, [depName, versionRefFound]);
    });
}

function derefDependencies(versionInfoHost, depRefTable, cb) {
    var refTuples = Lodash.pairs(depRefTable);

    Async.map(refTuples, derefDependency, function(derefErr, dereffedTuples) {
        if (derefErr) {
            // console.warn(Chalk.gray('famous'), Chalk.yellow('warn'), 'Couldn\'t resolve some dependencies');
            return cb(derefErr, depRefTable);
        }

        var dereffedTable = Lodash.zipObject(dereffedTuples);

        return cb(null, dereffedTable);
    });
}

function buildRequestHeaders(config) {
    var headers = {};
    headers[AUTH_TOKEN_HEADER_NAME] = config.authentication_token;
    return headers;
}

function getUserInfoViaAuthToken(authToken, cb) {
    Request({
        method: PathingHelpers.getAuthStatusMethod(),
        uri: PathingHelpers.getAuthStatusURI(),
        headers: buildRequestHeaders({ authentication_token: authToken })
    }, function(statusErr, statusResponse) {
        if (statusErr) {
            return cb(statusErr);
        }

        var famousUserId = statusResponse.headers[FAMOUS_USER_ID_HEADER_NAME];

        if (!famousUserId) {
            return cb(new Error('Auth service did not return a user id'));
        }

        Request({
            method: PathingHelpers.getUserInfoMethod(),
            uri: PathingHelpers.getUserInfoURI(),
            headers: buildRequestHeaders({ authentication_token: authToken })
        }, function(userInfoRequestErr, userResponse) {
            if (userInfoRequestErr) {
                return cb(new Error('Auth service did not return user info'));
            }

            var parsedUserResponse = JSON.parse(userResponse.body);

            return cb(null, parsedUserResponse.user);
        });
    });
}

function authenticateAsWriteable(info, config, cb) {
    if (!config.authentication_token) {
        return cb(new Error('Unable to authenticate without an authentication token'));
    }

    getUserInfoViaAuthToken(config.authentication_token, function(authTokenErr, userInfo) {
        if (authTokenErr) {
            return cb(authTokenErr);
        }

        var moduleName = BuildHelpers.moduleNameToNamespace(info.name);

        return cb(null, userInfo.username === moduleName, userInfo);
    });
}

function contentTypeForFile(file) {
    var extname = Path.extname(file.path);
    return Config.get('contentTypeMap')[extname] || Config.get('contentTypeFallback');
}

function getBlockNameWithoutUsername(name) {
    var nameParts = name.split(Config.get('componentDelimiter'));
    var nameTail = Lodash.tail(nameParts);
    return nameTail.join(Config.get('componentDelimiter'));
}

function createVersionWithFiles(blockId, config, files, cb) {
    // Example of request in curl:
    // -X POST
    // -F files[]="@./path/to/file_1;filename=relative/path/for/remote/storage/file_1;type=content/type"
    // -F files[]="@./path/to/file_2;filename=relative/path/for/remote/storage/file_2;type=content/type"
    // -H 'X-FAMOUS-USER-ID: :user_id'
    var versionPostRequest = Request({
        method: PathingHelpers.getVersionCreateMethod(),
        uri: PathingHelpers.getVersionCreateURI(blockId),
        headers: buildRequestHeaders(config)
    }, function(versionCreateErr, versionResp) {
        if (versionCreateErr || versionResp.statusCode > 299) {
            return cb(new Error('Unable to save version'));
        }

        return cb(null, versionResp);
    });

    // The code manager service expects the files to be uploaded via multipart/form-data,
    // so we have to do setup so that the request is in the correct format
    var versionPostForm = new FormData();
    versionPostForm.on('error', function(err) {
        err.message = 'form-data: ' + err.message;
        self.emit('error', err);
        self.abort();
    });

    // Hack to associate the special FormData lib we've created to the form instance
    // we already created above
    versionPostRequest._form = versionPostForm;

    Lodash.each(files, function(file) {
        versionPostForm.append('files[]', file.content, {
            filename: file.path.replace(Path.sep, '/'), // Convert possible Windows path syntax to URL syntax
            type: contentTypeForFile(file)
        });
    });
}

function createBlockIfNeeded(name, info, cb) {
    var config = info.codeManagerConfig;
    var block = info.frameworkInfo.block;

    if (block && block.id) {
        return cb(null, {
            block: {
                id: block.id,
                name: block.name
            }
        });
    }

    Request({
        json: true,
        method: PathingHelpers.getBlockCreateMethod(),
        uri: PathingHelpers.buildBlockCreateURI(),
        body: { block: { name: name, 'public': ARE_BLOCKS_PUBLIC } },
        headers: buildRequestHeaders(config)
    }, function(blockCreateReqErr, blockInfo) {
        if (blockCreateReqErr) {
            return cb(blockCreateReqErr);
        }

        cb(null, blockInfo.body);
    });
}

function saveAssets(versionWriteHost, info, cb) {
    var config = info.codeManagerConfig;

    authenticateAsWriteable(info, config, function(authErr, isWriteable, userInfo) {
        if (!isWriteable) {
            return cb(authErr || new Error('Block found to be unwriteable'));
        }

        var blockNameWithUsername = info.name;
        var blockNameWithoutUsername = getBlockNameWithoutUsername(info.name);

        createBlockIfNeeded(blockNameWithoutUsername, info, function(blockCreateErr, blockInfo) {
            if (blockCreateErr) {
                return cb(blockCreateErr);
            }

            // We need to store the block ID so that we can save it with the
            // rest of the user's dependencies
            info.frameworkInfo.block = {
                id: blockInfo.block.id
            };

            createVersionWithFiles(blockInfo.block.id, config, info.assetSaveableFiles, function(versionCreateErr, versionCreateResponse) {
                if (versionCreateErr) {
                    return cb(versionCreateErr);
                }

                var parsedVersionBody = JSON.parse(versionCreateResponse.body);
                var versionRef = parsedVersionBody.version.ref;

                info.versionRef = versionRef;
                info.versionPath = PathingHelpers.getVersionPath(blockNameWithUsername, versionRef);
                info.versionURL = PathingHelpers.getVersionURL(blockNameWithUsername, versionRef);

                return cb(null, info);
            });
        });
    });
}

function saveBundle(versionWriteHost, info, cb) {
    var config = info.codeManagerConfig;

    authenticateAsWriteable(info, config, function(authErr, isWriteable, userInfo) {
        if (authErr || !isWriteable) {
            return cb(authErr || new Error('Bundle not found to be writeable'));
        }

        var bundleFiles = BundleCollection.build(info, info.assetSaveableFiles);

        // Since code manager is essentially a wrapper service over git, there's no way
        // to append files to an existing version, which means that after we've
        // saved the initial version (to get the ref), we need to save yet another
        // version which will contain the bundle data (itself pointing to the
        // previous version created).
        createVersionWithFiles(info.name, config, bundleFiles, function(versionCreateErr, versionCreateResponse) {
            if (versionCreateErr) {
                return cb(versionCreateErr);
            }

            var parsedVersionBody = JSON.parse(versionCreateResponse.body);
            var bundleVersionRef = parsedVersionBody.version.ref;

            info.bundleVersionRef = bundleVersionRef;
            info.bundlePath = PathingHelpers.buildAssetPath(info.name, bundleVersionRef, Config.get('bundleAssetPath'), true);
            info.bundleURL = PathingHelpers.buildAssetURL(info.name, bundleVersionRef, Config.get('bundleAssetPath'));
            info.bundleExecutablePageURL = PathingHelpers.buildAssetURL(info.name, bundleVersionRef, Config.get('bundleIndexPath'));
            info.parcelPath = PathingHelpers.buildAssetPath(info.name, bundleVersionRef, Config.get('parcelAssetPath'), true);
            info.parcelURL = PathingHelpers.buildAssetURL(info.name, bundleVersionRef, Config.get('parcelAssetPath'));

            return cb(null, info);
        });
    });
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
