var DAYS_OF_WEEK = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

/**
 * Default location to use for weather if browser geolocation fails.
 * @type {string}
 */
var DEFAULT_LOCATION = "Seattle";

/**
 * The frequency of weather updates (in milliseconds)
 * @type {number}
 */
var WEATHER_UPDATE_FREQUENCY = 60000;

FamousFramework.scene('famous-demos:widget-dashboard:weather', {

    behaviors: {

        '.container': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-z': 10,
            'unselectable': true,
            'size-absolute': [800, 450],
            'style': {
                'background':'url({{BASE_URL}}background.jpg) no-repeat',
                'background-size':'cover',
                'color':'#ffffff',
                'padding':'20px',
                'border-radius':'20px',
                'box-shadow':'0px 0px 15px black',
                'cursor':'default'
            }
        },

        '.loading': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'position':'absolute',
                    'top':'45%',
                    'left':'50%',
                    'transform':'translate(-50%,-50%)',
                    'margin':0,
                    'font-size':'5em',
                    'user-select':'none',
                    'opacity': loading ? 1 : 0
                }
            }
        },

        '.location-name': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'margin':0,
                    'user-select':'none',
                    'opacity': loading ? 0 : 1
                }
            },

            'content': function(weather) {

                if(!weather) {
                    return null;
                }

                return weather.name;
            }
        },

        '.time': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'margin':0,
                    'user-select':'none',
                    'opacity': loading ? 0 : 0.5
                }
            },

            'content': function(weather) {

                if(!weather) {
                    return null;
                }

                var date = new Date(weather.dt * 1000);
                var day = DAYS_OF_WEEK[date.getDay()];
                var hour = date.getHours();
                var meridian = "AM";

                if(hour >= 12) {
                    meridian = "PM";
                }

                if(hour > 12) {
                    hour -= 12;
                }

                if(hour == 0) {
                    hour = 12;
                }

                var minutes = date.getMinutes();
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }

                var formatted = day + ", " + hour + ":" + minutes + " " + meridian;

                return formatted;
            }
        },

        '.temp': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'font-size':'14em',
                    'line-height':'1em',
                    'font-weight':'normal',
                    'margin':'20px 0 0',
                    'width':'60%',
                    'text-align':'center',
                    'user-select':'none',
                    'opacity': loading ? 0 : 1
                }
            },

            'content': function(weather) {

                if(!weather) {
                    return null;
                }

                return Math.round(weather.main.temp) + "°";
            }
        },

        '.description': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'font-size':'3em',
                    'line-height':'1em',
                    'font-weight':'normal',
                    'margin':0,
                    'width':'50%',
                    'text-align':'center',
                    'text-transform':'capitalize',
                    'user-select':'none',
                    'opacity': loading ? 0 : 0.5
                }
            },

            'content': function(weather) {

                if(!weather) {
                    return null;
                }

                return weather.weather[0].description;
            }
        },

        '.icon': {

            'unselectable': true,

            'style': function(loading) {

                return {
                    'position':'absolute',
                    'top':0,
                    'right':0,
                    'width':'200px',
                    'margin-right':'110px',
                    'margin-top':'100px',
                    'user-select':'none',
                    'opacity': loading ? 0 : 1
                }
            },

            'src': function(weather) {

                if(!weather) {
                    return "{{BASE_URL}}clear_day.svg";
                }

                var w = weather.weather[0];
                var icon;

                //logic to map api codes to weather images
                if(w.id >= 200 && w.id <= 232) {
                    icon = "thunderstorm.svg";
                }
                else if(w.id >= 300 && w.id <= 531) {
                    icon = "rainy.svg";
                }
                else if(w.id >= 600 && w.id <= 622) {
                    icon = "snowy.svg";
                }
                else if(w.id >= 701 && w.id <= 781 || w.id >= 802 && w.id <= 804) {
                    icon = "cloudy.svg";
                }
                else if(w.id == 801) {

                    if(w.icon == "02n") {
                        icon = "partly_cloudy_night.svg";
                    }
                    else {
                        icon = "partly_cloudy_day.svg";
                    }
                }
                else if(w.id == 800 && w.icon == "01n") {
                    icon = "clear_night.svg"
                }
                else {
                    icon = "clear_day.svg";
                }

                //return "http://openweathermap.org/img/w/" + w.icon + ".png";
                return "{{BASE_URL}}" + icon;
            }
        },

        '.weather-service': {

            /**
             * Make a query to the weather service
             * whenever the location is updated.
             *
             * TODO: the word 'identity' is very weird here, took me a while to figure out what this actually did
             * TODO: it's especially since you use '$self' in the event/behavior definitions.
             * TODO: Can't you use 'self' here too??? It would make more sense
             *
             * @param location The location as either a city, or geo coordinates.
             * @returns {*}
             */
            'query': '[[identity|location]]'
        },

        '.timer-service': {

            /**
             * Set the interval period on the timer service from our frequency value.
             *
             * @param frequency The frequency (in milliseconds) to update the weather data.
             * @returns {*}
             */
            'period': '[[identity|frequency]]'
        }
    },

    events: {

        '.location-service': {

            /**
             * Called when the browser updates the geographic location.
             *
             * @param $payload The geographic coordinates.
             * @param $dispatcher The event dispatcher.
             */
            'location': function($payload, $dispatcher) {

                //trigger our internal location event with the geographic coordinates
                $dispatcher.trigger("location", $payload.latitude + "," + $payload.longitude);
            },

            /**
             * Called when the browser could not get
             * the geographic coordinates or when the service times out.
             *
             * @param $payload The error message.
             * @param $dispatcher The event dispatcher.
             */
            'error': function($payload, $dispatcher) {

                console.warn("ERROR getting location: ", $payload);

                //if we can't get geolocation, set the location city to the default
                $dispatcher.trigger("location", DEFAULT_LOCATION);
            }
        },

        '.weather-service': {

            /**
             * Called when the weather service returns weather data.
             *
             * @param $state The state manager.
             * @param $payload The weather data.
             */
            'response': function($state, $payload) {
                $state.set("weather", $payload);
                $state.set("loading", false);
            },

            'error': function($payload) {
                console.warn("ERROR calling weather service: ", $payload);
            }
        },

        '.timer-service': {

            /**
             * On each timer tick, trigger a location udpate.
             *
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher.
             */
            'tick': function($state, $dispatcher) {
                $dispatcher.trigger("location", $state.get("location"));
            }
        },

        '$public': {

            /**
             * The frequency of weather updates in milliseconds
             */
            'frequency':'[[setter]]',

            /**
             * The location to get weather updates for as
             * either a city/state name or geographic coordinates.
             * Not to be confused with the location service's event of the same name...
             * I'm apparently not that creative in my naming conventions...
             *
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher.
             * @param $payload The location city/state name or coordinates.
             */
            'location': function($state, $dispatcher, $payload) {

                //if the payload isn't set attempt
                //to get it from location services
                //nothing more to do here
                if($payload == null) {
                    return;
                }

                //set our loading flag so the widget doesn't look broken
                $state.set("loading", true);

                //set our locatoin to trigger the webservice call
                $state.set("location", $payload);
            }
        }
    },

    states: {

        /**
         * Weather update frequency (every minute)
         */
        frequency: WEATHER_UPDATE_FREQUENCY,

        /**
         * Whether or not the widget
         * is currently loading data.
         */
        loading: true,

        /**
         * The weather data model we
         * retrieve from the weather service
         */
        weather: null
    },

    tree: 'weather.html'
});
