'use strict';

(function() {
    var iframe = document.getElementById('iframe');
    var stage = document.getElementById('famous-framework-stage');

    var SAFE_NAMESPACE_DELIMITER = '~';
    var COMPONENT_DELIMITER = ':';
    var DEFAULT_MODULE = 'famous-demos:clickable-square';

    function updateCurrentModule(name, pushState) {
        var delimitedSafe = name.split(COMPONENT_DELIMITER).join(SAFE_NAMESPACE_DELIMITER);
        iframe.setAttribute('src', 'build/' + delimitedSafe + '/index.html');
    }

    var query = QUERY.ff;
    if (query) {
        query = query.split('/')[0];
        if (query.split(':').length < 2) {
            query = 'famous-demos:' + query;
        }
        updateCurrentModule(query, false);
    }
    else {
        updateCurrentModule(DEFAULT_MODULE, false);
    }
}());
