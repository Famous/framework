var API_URL = "http://finance.google.com/finance/info?client=ig&q={tickers}";

/**
 * A service component used to connect to the Google finance api.
 * It leverages the justinsmith:service:http service component to make the web requests.
 */
FamousFramework.scene('famous:adapter:google-finance', {

    behaviors: {

        'famous:service:http': {

            'url': API_URL,
            'parse-json': false,

            'request': function(tickers) {

                //create the request whenever tickers are updated using
                //url parameters + token since the url is defined above
                return {

                    //i'm not actually checking the token in the response,
                    //but i put it in here anyways to show usage
                    'token': "googlefinance-" + Math.random(),

                    'parameters': {
                        'tickers':tickers.join(',')
                    }
                };
            }
        }
    },

    events: {

        'famous:service:http': {

            'response': function($payload, $event, $dispatcher) {

                $event.stopPropagation();

                var response = $payload.response;

                try {
                    //need to do some funny business cuz Google adds some comments to the result???
                    //not sure why...but just parse it out
                    var data = JSON.parse(response.data.substring(3));

                    if(data.cod && data.message) {
                        $dispatcher.emit("error", data.message);
                        return;
                    }

                    //send the response event with our parsed data
                    $dispatcher.emit("response", data);
                }
                catch(ee) {
                    $dispatcher.emit("error", ee);
                }
            },

            'error': function($payload, $dispatcher) {
                console.warn("Error: ", $payload);
                $dispatcher.emit("error", $payload);
            }
        },

        '$public': {

            'query': function($dispatcher, $state, $payload) {

                //dont' do anything if a null query was made
                if(!$payload) {
                    return;
                }

                //otherwise set our tickers
                $state.set("tickers", $payload);
            }
        }
    },

    tree: '<famous:service:http></famous:service:http>'
});
