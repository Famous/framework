'use strict';

var Async = require('async');
var Chalk = require('chalk');
var FormData = require('form-data'); // Hacked version of this lib that doesn't 'basename' the filepath
var Lodash = require('lodash');
var Path = require('path');
var Request = require('request');

var BuildHelpers = require('./../build-helpers');
var PathingHelpers = require('./pathing');

var SHA_LENGTH = 64;
var SHA_REGEXP = /^([a-zA-Z0-9])+$/i;
var ARE_BLOCKS_PUBLIC = true;
var AUTH_TOKEN_HEADER_NAME = 'X-AUTHENTICATION-TOKEN';
var AUTH_STATUS_IS_SIGNED_IN_CODE = 204;
var FAMOUS_USER_ID_HEADER_NAME = 'x-famous-user-id';

function loadDependency(assetReadHost, versionInfoHost, dependencyTuple, cb) {
    var dependencyName = dependencyTuple[0];
    var dependencyVersion = dependencyTuple[1];
    if (versionInfoHost) {
        var dependencyParcelBaseURL = PathingHelpers.buildVersionInfoURL.call(this, dependencyName, dependencyVersion);
        var dependencyParcelURL = dependencyParcelBaseURL + '/assets/' + this.options.parcelAssetPath;
        Request({
            method: 'GET',
            uri: dependencyParcelURL
        }, function(parcelLoadErr, parcelResp, parcelBody) {
            if (!parcelLoadErr) {
                var parcelHash = JSON.parse(parcelBody);
                cb(null, parcelHash);
            }
            else {
                cb(parcelLoadErr);
            }
        });
    }
    else {
        cb(new Error('No such dependency'));
    }
}

function loadDependencies(assetReadHost, versionInfoHost, dependenciesWanted, dependenciesFound, cb) {
    var refTuples = Lodash.pairs(dependenciesWanted);
    Async.map(refTuples, loadDependency.bind(this, assetReadHost, versionInfoHost), function(depLoadErr, parcelsLoaded) {
        if (!depLoadErr) {
            for (var i = 0; i < parcelsLoaded.length; i++) {
                var loadedDependencyName = refTuples[i][0];
                dependenciesFound[loadedDependencyName] = parcelsLoaded[i];
            }
            cb(null, dependenciesWanted, dependenciesFound);
        }
        else {
            cb(null, dependenciesWanted, dependenciesFound);
        }
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
        cb(null, refTuple);
    }
    else {
        var versionURL = PathingHelpers.buildVersionInfoURL.call(this, depName, depRef);
        Request({
            method: PathingHelpers.getVersionGetMethod.call(this),
            uri: versionURL
        }, function(reqErr, response, body) {
            if (!reqErr && response.statusCode < 300) {
                var parsedBody = JSON.parse(body);
                var versionRefFound = parsedBody.version.ref;
                console.log(Chalk.gray('famous'), Chalk.green('ok'), 'Resolved ' + depName + ' ~> ' + refTuple[1] + ' to ' + depName + ' ~> ' + versionRefFound);
                cb(null, [depName, versionRefFound]);
            }
            else {
                console.warn(Chalk.gray('famous'), Chalk.yellow('warn'), 'Couldn\'t resolve ' + depName + ' ~> ' + refTuple[1]);
                cb(new Error('Error resolving dependency for `' + depName + '` (' + refTuple[1] + '); contining...'), refTuple);
            }
        });
    }
}

function derefDependencies(versionInfoHost, depRefTable, cb) {
    var refTuples = Lodash.pairs(depRefTable);
    Async.map(refTuples, derefDependency.bind(this), function(derefErr, dereffedTuples) {
        if (!derefErr) {
            var dereffedTable = Lodash.zipObject(dereffedTuples);
            cb(null, dereffedTable);
        }
        else {
            // console.warn(Chalk.gray('famous'), Chalk.yellow('warn'), 'Couldn\'t resolve some dependencies');
            cb(derefErr, depRefTable);
        }
    });
}

function buildRequestHeaders(config) {
    var headers = {};
    headers[AUTH_TOKEN_HEADER_NAME] = config.authentication_token;
    return headers;
}

function getUserInfoViaAuthToken(authToken, cb) {
    Request({
        method: PathingHelpers.getAuthStatusMethod.call(this),
        uri: PathingHelpers.getAuthStatusURI.call(this),
        headers: buildRequestHeaders({ authentication_token: authToken })
    }, function(statusErr, statusResponse) {
        if (!statusErr && statusResponse.statusCode === AUTH_STATUS_IS_SIGNED_IN_CODE) {
            var famousUserId = statusResponse.headers[FAMOUS_USER_ID_HEADER_NAME];
            if (famousUserId) {
                Request({
                    method: PathingHelpers.getUserInfoMethod.call(this),
                    uri: PathingHelpers.getUserInfoURI.call(this),
                    headers: buildRequestHeaders({ authentication_token: authToken })
                }, function(userInfoRequestErr, userResponse) {
                    if (!userInfoRequestErr && userResponse && userResponse.body) {
                        var parsedUserResponse = JSON.parse(userResponse.body);
                        cb(null, parsedUserResponse.user);
                    }
                    else {
                        cb(new Error('Auth service did not return user info'));
                    }
                });
            }
            else {
                cb(new Error('Auth service did not return a user id'));
            }
        }
        else {
            cb(statusErr);
        }
    }.bind(this));
}

function authenticateAsWriteable(info, config, cb) {
    if (config.authentication_token) {
        getUserInfoViaAuthToken.call(this, config.authentication_token, function(authTokenErr, userInfo) {
            if (!authTokenErr) {
                var moduleName = BuildHelpers.moduleNameToNamespace.call(this, info.name);
                cb(null, userInfo.username === moduleName, userInfo);
            }
            else {
                cb(authTokenErr);
            }
        }.bind(this));
    }
    else {
        cb(new Error('Unable to authenticate without an authentication token'));
    }
}

function contentTypeForFile(file) {
    var extname = Path.extname(file.path);
    return this.options.contentTypeMap[extname] || this.options.contentTypeFallback;
}

function getBlockNameWithoutUsername(name) {
    var nameParts = name.split(this.options.componentDelimiter);
    var nameTail = Lodash.tail(nameParts);
    return nameTail.join(this.options.componentDelimiter);
}

function createVersionWithFiles(blockId, config, files, cb) {
    // Example of this request in curl:
    // -X POST
    // -F files[]="@./path/to/file_1;filename=relative/path/for/remote/storage/file_1;type=content/type"
    // -F files[]="@./path/to/file_2;filename=relative/path/for/remote/storage/file_2;type=content/type"
    // -H 'X-FAMOUS-USER-ID: :user_id'
    var versionPostRequest = Request({
        method: PathingHelpers.getVersionCreateMethod.call(this),
        uri: PathingHelpers.getVersionCreateURI.call(this, blockId),
        headers: buildRequestHeaders(config)
    }, function(versionCreateErr, versionResp) {
        if (!versionCreateErr && versionResp.statusCode < 300) {
            cb(null, versionResp);
        }
        else {
            cb(new Error('Unable to save version'));
        }
    });

    // The code manager service expects the files to be uploaded via multipart/form-data,
    // so we have to do this setup so that the request is in the correct format
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
            filename: file.path,
            type: contentTypeForFile.call(this, file)
        });
    }.bind(this));
}

function createBlockIfNeeded(name, info, cb) {
    var config = info.codeManagerConfig;
    var block = info.frameworkInfo.block;
    if (block && block.id) {
        cb(null, {
            block: {
                id: block.id,
                name: block.name
            }
        });
    }
    else {
        Request({
            json: true,
            method: PathingHelpers.getBlockCreateMethod.call(this),
            uri: PathingHelpers.buildBlockCreateURI.call(this),
            body: { block: { name: name, 'public': ARE_BLOCKS_PUBLIC } },
            headers: buildRequestHeaders(config)
        }, function(blockCreateReqErr, blockInfo) {
            if (!blockCreateReqErr) {
                cb(null, blockInfo.body);
            }
            else {
                cb(blockCreateReqErr);
            }
        });
    }
}

function saveAssets(versionWriteHost, info, cb) {
    var config = info.codeManagerConfig;
    authenticateAsWriteable.call(this, info, config, function(authErr, isWriteable, userInfo) {
        if (isWriteable) {
            var blockNameWithUsername = info.name;
            var blockNameWithoutUsername = getBlockNameWithoutUsername.call(this, info.name);
            createBlockIfNeeded.call(this, blockNameWithoutUsername, info, function(blockCreateErr, blockInfo) {

                // We need to store the block ID so that we can save it with the
                // rest of the user's dependencies
                info.frameworkInfo.block = {
                    id: blockInfo.block.id
                };

                if (!blockCreateErr) {
                    createVersionWithFiles.call(this, blockInfo.block.id, config, info.assetSaveableFiles, function(versionCreateErr, versionCreateResponse) {

                        if (!versionCreateErr) {
                            var parsedVersionBody = JSON.parse(versionCreateResponse.body);
                            var versionRef = parsedVersionBody.version.ref;
                            info.versionRef = versionRef;
                            info.versionPath = PathingHelpers.getVersionPath.call(this, blockNameWithUsername, versionRef);
                            info.versionURL = PathingHelpers.getVersionURL.call(this, blockNameWithUsername, versionRef);
                            cb(null, info);
                        }
                        else {
                            cb(versionCreateErr);
                        }

                    }.bind(this));
                }
                else {
                    cb(blockCreateErr);
                }

            }.bind(this));
        }
        else {
            cb(authErr);
        }
    }.bind(this));
}

function saveBundle(versionWriteHost, info, cb) {
    var config = info.codeManagerConfig;

    authenticateAsWriteable.call(this, info, config, function(authErr, isWriteable, userInfo) {
        if (isWriteable) {

            var bundleFiles = [];
            bundleFiles.push({
                path: this.options.bundleAssetPath,
                content: info.bundleString
            });
            bundleFiles.push({
                path: this.options.parcelAssetPath,
                content: JSON.stringify(info.parcelHash, null, 4)
            });
            bundleFiles.push({
                path: this.options.bundleExecutableAssetPath,
                content: info.bundleExecutableString
            });
            bundleFiles.push({
                path: this.options.frameworkLibraryAssetPath,
                content: info.frameworkLibraryString
            });
            bundleFiles.push({
                path: this.options.frameworkExecutablePageAssetPath,
                content: info.frameworkExecutablePageString
            });
            bundleFiles = bundleFiles.concat(info.assetSaveableFiles);

            // Since code manager is essentially a wrapper service over git, there's no way
            // to append files to an existing version, which means that after we've
            // saved the initial version (to get the ref), we need to save yet another
            // version which will contain the bundle data (itself pointing to the
            // previous version created).
            createVersionWithFiles.call(this, info.name, config, bundleFiles, function(versionCreateErr, versionCreateResponse) {
                if (!versionCreateErr) {
                    var parsedVersionBody = JSON.parse(versionCreateResponse.body);
                    var bundleVersionRef = parsedVersionBody.version.ref;
                    info.bundleVersionRef = bundleVersionRef;
                    info.bundlePath = PathingHelpers.buildAssetPath.call(this, info.name, bundleVersionRef, this.options.bundleAssetPath, true);
                    info.bundleURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleVersionRef, this.options.bundleAssetPath);
                    // info.bundleExecutablePageURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleVersionRef, this.options.frameworkExecutablePageAssetPath);
                    info.parcelPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleVersionRef, this.options.parcelAssetPath, true);
                    info.parcelURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleVersionRef, this.options.parcelAssetPath);
                    cb(null, info);
                }
                else {
                    cb(versionCreateErr);
                }
            }.bind(this));

        }
        else {
            cb(authErr);
        }
    }.bind(this));
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
