var COORDINATE_REGEX = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;
var COORDINATE_URL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&lat={lat}&lon={lon}";
var CITY_URL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&q={location}";

/**
 * A service component used to connect to the open weather map api.
 * It leverages the famous:service:http service component to make the web requests.
 * Originally justinsmith:service:openweathermap, moved into core
 */
FamousFramework.scene('famous:adapter:open-weather-map', {

    behaviors: {

        'famous:service:http': {

            'request': function(location) {

                var parameters = {};
                var url;

                //test if the location is a latitude/longitude
                //or a city/state name and create the appropriate url
                if(location.match(COORDINATE_REGEX)) {

                    url = COORDINATE_URL;

                    var l = location.split(",");
                    parameters["lat"] = l[0];
                    parameters["lon"] = l[1];
                }
                else {
                    url = CITY_URL;
                    parameters["location"] = location;
                }

                //create the request whenever tickers are updated using
                //url parameters + token since the url is defined above
                return {

                    //i'm not actually checking the token in the response,
                    //but i put it in here anyways to show usage
                    'token': "openweathermap-" + Math.random(),

                    //url is set here instead of as a behavior (like googlefinance)
                    //since we're using two different apis to make calls
                    'url': url,
                    'parameters': parameters
                };
            }
        }
    },

    events: {

        'famous:service:http': {

            'response': function($payload, $event, $dispatcher) {

                //stop the event from bubbling, cuz
                //we're going to tweak the response data
                $event.stopPropagation();

                var response = $payload.response;

                try {
                    var data = response.data;

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

                //otherwise set our location
                $state.set("location", $payload);
            }
        }
    },

    tree: '<famous:service:http></famous:service:http>'
});
