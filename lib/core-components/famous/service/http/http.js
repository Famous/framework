/**
 * Create an HTTP request object from our client request.
 *
 * @param clientRequest The client request.
 * @param $state The state manager.
 */
var createRequest = function(clientRequest, $state) {

    var method = $state.get("method") || "GET";
    method = method.toUpperCase();

    var request = {
        'method': method,
        'headers': $state.get("headers")
    };

    //add the token if it exists
    if(clientRequest.hasOwnProperty("token")) {
        request.token = clientRequest.token;
    }

    //add any included headers
    if(clientRequest.hasOwnProperty("headers")) {
        for(var header in clientRequest.headers) {
            request.headers[header] = clientRequest.headers[header];
        }
    }

    //TODO: the below stuff might be janky in some cases - don't have any unit tests!!!!

    var url = clientRequest.url || $state.get("url");
    if(url.indexOf("/") == 0) {
        url = url.substring(1);
    }

    //parse any URL parameters
    if(clientRequest.hasOwnProperty("parameters")) {
        for(var parameter in clientRequest.parameters) {
            url = url.replace("{" + parameter + "}", clientRequest.parameters[parameter]);
        }
    }

    //if the base url is not defined, assume the 'url' is an absolute url
    var absoluteUrl = $state.get("base-url");
    if(absoluteUrl) {

        if(absoluteUrl.lastIndexOf("/") == absoluteUrl.length - 1) {
            absoluteUrl += url;
        }
        else {
            absoluteUrl += "/" + url;
        }
    }
    else {
        absoluteUrl = url;
    }

    //parse the URL string into it's components
    request.url = parseUrl(absoluteUrl);

    return request;
};

/**
 * Parse a URL string into its component parts.
 *
 * @param url An URL string to parse.
 * @returns {{protocol: string, host: (*|req.host|options.host|host|location.host|url.host), hostname: (*|parseNoProxyZone.hostname|url.hostname|params.hostname|newOptions.hostname|parseTests.hostname), port: number, pathname: (*|url.pathname|parseTests.pathname|parseTestsWithQueryString.pathname|formatTests.pathname|string), querystring: (url.search|*|Function|parseTests.search|parseTestsWithQueryString.search|formatTests.search), params: {}, hash: (*|XML|string|void|Ext.Element), absoluteUrl: *}}
 */
var parseUrl = function(url) {

    //parse the absolute url (ghetto style)
    var parser = document.createElement('a');
    parser.href = url;

    //parse the query string
    var params = {};
    var queries = parser.search.replace(/^\?/, '').split('&');
    for(var i = 0; i < queries.length; i++ ) {
        var split = queries[i].split('=');
        params[split[0]] = split[1];
    }

    //create the url object
    var u = {
        protocol: parser.protocol.replace(":", ""),
        host: parser.host,
        hostname: parser.hostname,
        port: parseInt(parser.port) || 80,
        pathname: parser.pathname,
        querystring: parser.search,
        params: params,
        hash: parser.hash.replace("#", ""),
        absoluteUrl: url
    };

    return u;
};

/**
 * A service component used to make HTTP requests.
 * Originally justinsmith:service:http, moved into core.
 * 
 * TODO: This is by far my favorite component due to
 * TODO: it's nature as a service as well as the convenience
 * TODO: in which it can be used in consuming components.
 * TODO: I think this could be a showcase example to give new
 * TOOD: users that 'aha' moment that BEST is not just for UI.
 */
FamousFramework.component('famous:service:http', {

    events: {

        '$public': {

            /**
             * Default base URL for all HTTP requests.
             */
            'base-url': '[[setter]]',

            /**
             * The URL to use for HTTP requests.
             */
            'url': '[[setter]]',

            /**
             * Default request method for all HTTP requests
             * (GET|POST|PUT|DELETE|OPTIONS|HEAD)
             */
            'method':  '[[setter]]',

            /**
             * Default request headers for all HTTP requests as a map.
             *
             * ex: headers["Content-Type"] = "application/javascript"
             */
            'headers': '[[setter]]',

            /**
             * A token that can be used to track a particular HTTP request.
             */
            'token': '[[setter]]',

            /**
             * Whether or not to parse JSON responses into JSON objects.
             * Defaults to true.
             */
            'parse-json': '[[setter]]',

            /**
             * Make an HTTP request.
             *
             * The request payload should take the following form:
             * {
             *   //required either here or in the behavior
             *   //can be absolute, relative (if 'base-url' is defined)
             *   //or follow the {param} convention
             *   'url':'/v1/blocks/{param1}?q={param2}',
             *
             *   //optional
             *   'method':'GET',
             *
             *   //additional request headers (added to default headers set on the behavior)
             *   'headers':{ 'Content-Type':'application/javascript' },
             *
             *   //url replacements if your url follows the {param} convention
             *   'parameters': {
             *      'param1':'my-block',
             *      'param2':'my query'
             *   }
             *
             *   //a reference token the consuming component can use when
             *   //making multiple similar web requests that may not necessarily
             *   //return in the order received.
             *   'token':'some-unique-string'
             * }
             *
             * @param $payload The request object
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher
             */
            'request': function($payload, $state, $dispatcher) {

                //if the required 'url' parameter is missing, error out
                if(!$payload.hasOwnProperty("url") && !$state.get("url")) {
                    $dispatcher.emit("error", "Required parameter 'url' missing");
                    return
                }

                //create our request object
                var request = createRequest($payload, $state);

                //create and execute the xhr request
                var xhr = new XMLHttpRequest();
                xhr.open(request.method, request.url.absoluteUrl);

                //set the request headers
                for(var header in request.headers) {
                    xhr.setRequestHeader(header, request.headers[header]);
                }

                xhr.onload = function(e) {

                    //TODO: check for http error codes!
                    //TODO: add response headers to response object

                    try {

                        var result = {
                            request: request,
                            response: {
                                headers: {},
                                data: this.response
                            }
                        };

                        if(!$state.get("parse-json")) {
                            $dispatcher.emit("response", result);
                            return;
                        }

                        var data = JSON.parse(this.response);

                        result.response.data = data;

                        $dispatcher.emit("response", result);
                    }
                    catch(ee) {
                        $dispatcher.emit("error", ee);
                    }
                }
                xhr.send();
            }
        }
    },

    states: {

        /**
         * Default request headers.
         */
        headers: {},

        /**
         * Whether or not to parse responses as JSON.
         * Default true.
         */
        'parse-json':true
    }
});
