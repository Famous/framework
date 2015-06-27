/**
 * TODO: I originally set up this data structure as a stand-in for a web service that would theoretically get all the modules dynamically.
 * TODO: But, I soon realized I can't reference a module in a repeater...so now each widget is hard-coded now in the layout.
 * TODO: This data still drives the dropdown menu.
 *
 * @type {*[]}
 */
var DATA = [
    { 'name': "Analog Clock", 'selector':'clock', 'icon': "clock-icon.jpg" },
    { 'name': "Weather", 'selector':'weather', 'icon': "weather-icon.jpg" },
    { 'name': "Calendar", 'selector':'calendar', 'icon': "calendar-icon.jpg" },
    { 'name': "Stocks", 'selector':'stocks', 'icon': "stocks-icon.jpg" },
    { 'name': "Photos", 'selector':'photos', 'icon': "photos-icon.jpg" },
];

/**
 * TODO: This is a pretty ghetto hack due to the fact I can't reference sibling and/or parent components and do anything meaningful with them.
 * TODO: In this case, when you click the '-' button on the dashboard to show the 'remove' buttons on each widget,
 * TODO: I can't then trigger an animation or a state for that node as I don't have a string selector or name or anything except a unique ID.
 * TODO: So I grab that ID (since it's predictable) and use the map to build a state/timeline name I can then trigger.
 */
var WIDGET_MAP = {
    "body/0/0/0/3/0": "clock",
    "body/0/0/0/3/1": "calendar",
    "body/0/0/0/3/2": "weather",
    "body/0/0/0/3/3": "stocks",
    "body/0/0/0/3/4": "photos"
};

/**
 * A dashboard to display a configurable number of widgets.
 *
 * TODO: known issue - widget 'remove' buttons when hidden are animated to
 * TODO: opacity 0, but NOT removed from DOM. Click handlers are still active.
 */
FamousFramework.scene('famous-demos:widget-dashboard:dashboard', {

    behaviors: {

        '.container': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-z': 1,
            'unselectable': true,
        },

        '.available-widgets-list': {

            'align': [0, 0],
            'mount-point': [0, 0],
            'origin': [0.5, 0.5],
            'position-z': 100,
            'unselectable': true,
            'size-absolute-y': 200,

            'position-y': -220,

            'style': {
                'box-shadow':'0 0 30px rgba(0,0,0,0.8)',
                'background': '-moz-linear-gradient(top,  rgba(0,0,0,1) 0%, rgba(0,0,0,0.87) 100%)',
                'background': '-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,1)), color-stop(100%,rgba(0,0,0,0.87)))',
                'background': '-webkit-linear-gradient(top,  rgba(0,0,0,1) 0%,rgba(0,0,0,0.87) 100%)',
                'background': '-o-linear-gradient(top,  rgba(0,0,0,1) 0%,rgba(0,0,0,0.87) 100%)',
                'background': '-ms-linear-gradient(top,  rgba(0,0,0,1) 0%,rgba(0,0,0,0.87) 100%)',
                'background': 'linear-gradient(to bottom,  rgba(0,0,0,1) 0%,rgba(0,0,0,0.87) 100%)'
            }
        },

        '.widget-list-item': {

            'align': [0, 0.5],
            'mount-point': [0, 0.5],
            'origin': [0.5, 0.5],
            //'position-x':20,
            'position-z': 1,
            'size-absolute': [100, 120],

            '$repeat': function() {

                var result = [];
                for (var i = 0; i < DATA.length; i++) {

                    var x = (i * 100) + (i * 40) + 40;

                    result.push({
                        'position-x': x,
                        content: '<img src="{{BASE_URL}}' + DATA[i].icon + '">' + DATA[i].name,
                        model: DATA[i]
                    });
                }

                return result;
            },

            'style': {
                'text-align':'center',
                'cursor':'pointer',
                'color':'white'
            }
        },

        '.dashboard': {

            'style': {
                'background':'url({{BASE_URL}}background.jpg) no-repeat'
            }
        },

        '.add': {
            'align': [0, 1],
            'mount-point': [0, 1],
            'origin': [0.5, 0.5],
            'position-z': 1000,
            'position-x':10,
            'position-y':-10,
            'size-absolute': [50, 50],
            'content': '+',
            'unselectable': true,
            'opacity': function(widgetListActive) {
                return widgetListActive ? 0.5 : 1;
            },

            'style': {
                'border':'5px solid white',
                'border-radius':'50%',
                'cursor':'pointer',
                'background':'rgba(0,0,0,0.9)',
                'color':'white',
                'font-size':'50px',
                'line-height':'35px',
                'padding-left':'6px',
                'box-shadow':'0 0 30px rgba(0,0,0,0.5)'
            }
        },

        '.remove': {
            'align': [0, 1],
            'mount-point': [0, 1],
            'origin': [0.5, 0.5],
            'position-z': 1000,
            'position-x':70,
            'position-y':-10,
            'size-absolute': [50, 50],
            'content': '-',
            'unselectable': true,

            'opacity': function(removing) {
                return removing ? 0.5 : 1;
            },

            'style': {
                'border':'5px solid white',
                'border-radius':'50%',
                'cursor':'pointer',
                'background':'rgba(0,0,0,0.9)',
                'color':'white',
                'font-size':'50px',
                'line-height':'33px',
                'padding-left':'11px',
                'box-shadow':'0 0 30px rgba(0,0,0,0.5)'
            }
        },

        '.clock': {
            'align': [.95, 0.05],
            'mount-point': [.95, 0.05],
            'origin': [.95, 0.05],
            'size-absolute': [400, 400],
            'position-z':10,
            'scale': function(clockActive) {
                return clockActive ? [0.5, 0.5] : [0,0];
            }
        },

        '.calendar': {
            'align': [.5, 0],
            'mount-point': [.5, 0],
            'origin': [0.5, 0],
            'size-absolute': [900, 400],
            'position-z':30,
            'scale': function(calendarActive) {
                return calendarActive ? [0.5, 0.5] : [0,0];
            }
        },

        '.stocks': {
            'align': [0.95, 0.95],
            'mount-point': [0.95, 0.95],
            'origin': [0.95, 0.95],
            'size-absolute': [900, 400],
            'position-z':30,
            'scale': function(stocksActive) {
                return stocksActive ? [0.5, 0.5] : [0,0];
            }
        },

        '.weather': {
            'align': [0.05, 0.6],
            'mount-point': [0.05, 0.6],
            'origin': [0.05, 0.6],
            'size-absolute': [800, 450],
            'position-z':20,
            'scale': function(weatherActive) {
                return weatherActive ? [0.5, 0.5] : [0,0];
            }
        },

        '.photos': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'size-absolute': [400, 400],
            'position-z':40,
            'scale': function(photosActive) {
                return photosActive ? [0.5, 0.5] : [0,0];
            }
        },

        '.remove-dashboard-item': {
            'align': [0, 0],
            'mount-point': [0, 0],
            'origin': [0.5, 0.5],
            'position-z': 100,
            'size-absolute': [50, 50],
            'content': 'x',
            'unselectable': true,
            'opacity':0,

            'style': {
                'border':'5px solid white',
                'border-radius':'50%',
                'cursor':'pointer',
                'background':'rgba(0,0,0,0.9)',
                'color':'white',
                'font-size':'35px',
                'line-height':'33px',
                'padding-left':'12px',
                'box-shadow':'0 0 30px rgba(0,0,0,0.8)'
            }
        },
    },

    events: {

        '.container': {

            'click': function($state, $timelines) {

                if($state.get("widgetListActive")) {

                    //callback when animation complete
                    function callback() {
                        $state.set("widgetListAnimating", false);
                    };

                    $state.set("widgetListActive", false);
                    $timelines.get('hide-available-widgets')
                              .start({ duration: 500 }, callback);
                }

                if($state.get("removing")) {
                    $state.set("removing", false);
                    $timelines.get('hide-remove-buttons')
                              .start({ duration: 300 });
                }
            }
        },

        '.add': {
            'click': function($state, $timelines, $event) {

                //important to kill the mouse event or else it
                //will bubble up and call the container click handler (above)
                $event.stopPropagation();

                if($state.get("removing")) {
                    $state.set("removing", false);
                    $timelines.get('hide-remove-buttons')
                              .start({ duration: 300 });
                }

                //don't do anything if we're mid-animation...
                //problems happen that way
                if($state.get("widgetListAnimating")) {
                    return;
                }

                //callback when animation complete
                function callback() {
                    $state.set("widgetListAnimating", false);
                };

                $state.set("widgetListAnimating", true);

                //toggle the active state of our widget list
                var widgetListActive = !$state.get("widgetListActive");
                if(widgetListActive) {
                    $timelines.get('show-available-widgets')
                              .start({ duration: 500 }, callback);
                }
                else {
                    $timelines.get('hide-available-widgets')
                              .start({ duration: 500 }, callback);
                }

                $state.set("widgetListActive", widgetListActive);
            }
        },

        '.remove': {

            'click': function($state, $event, $timelines) {

                //important to kill the mouse event or else it
                //will bubble up and call the container click handler (above)
                $event.stopPropagation();

                var removing = !$state.get("removing");
                if(removing) {
                    $timelines.get('show-remove-buttons')
                              .start({ duration: 300 });
                }
                else {
                    $timelines.get('hide-remove-buttons')
                              .start({ duration: 300 });
                }

                $state.set("removing", removing);

                if($state.get("widgetListActive")) {
                    $state.set("widgetListActive", false);
                    $timelines.get('hide-available-widgets')
                              .start({ duration: 500 });
                }
            }
        },

        '.remove-dashboard-item': {

            'click': function($event, $state, $timelines, $dispatcher) {

                $event.stopPropagation();

                var node = $event.node;
                var parent = node.getParent();

                var widget = WIDGET_MAP[parent.getId()];

                //hide our widget
                $state.set(widget + "Active", false);
                $timelines.get("hide-" + widget)
                          .start({ duration: 600 });

                if(!$state.get("clockActive") &&
                   !$state.get("calendarActive") &&
                   !$state.get("weatherActive") &&
                   !$state.get("stocksActive")) {

                    $state.set("removing", false);
                    $timelines.get('hide-remove-buttons')
                              .start({ duration: 300 });
                }
            }
        },

        '.widget-list-item': {

            'click': function($state, $payload, $index, $repeatPayload, $timelines) {

                $state.set($repeatPayload.model.selector + "Active", true);

                $timelines.get("show-" + $repeatPayload.model.selector)
                          .start({ duration: 1000, delay:300 });
            }
        }
    },

    states: {

        /**
         * Whether or not the widget list dropdown
         * menu is currently active and visible
         */
        widgetListActive:false,

        /**
         * Whether or not the widget list dropdown menu is currently animating in or out
         */
        widgetListAnimating:false,

        /**
         * Whether or not the widget 'remove' buttons are active and visible.
         */
        removing:false,

        /**
         * Whether or not the clock widget is active.
         */
        clockActive:false,

        /**
         * Whether or not the weather widget is active.
         */
        weatherActive:false,

        /**
         * Whether or not the calendar widget is active.
         */
        calendarActive:false,

        /**
         * Whether or not the stocks widget is active.
         */
        stocksActive:false,

        /**
         * Whether or not the photos widget is active.
         */
        photosActive: false
    },

    tree: 'dashboard.html'
})
.timelines({

    'show-available-widgets': {

        '.available-widgets-list': {
            'position-y': {
                '0%': { value: -220, curve: 'inOutExpo' },
                '100%': { value: 0, curve: 'inOutExpo' }
            }
        }
    },

    'hide-available-widgets': {

        '.available-widgets-list': {
            'position-y': {
                '0%': { value: 0, curve: 'inOutExpo' },
                '100%': { value: -220, curve: 'inOutExpo' }
            }
        }
    },

    'show-remove-buttons': {

        '.remove-dashboard-item': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            }
        }
    },

    'hide-remove-buttons': {

        '.remove-dashboard-item': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            }
        }
    },

    'show-clock': {

        '.clock': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0,0], curve: 'inOutExpo' },
                '100%': { value: [0.5,0.5], curve: 'inOutExpo' }
            }
        }
    },

    'hide-clock': {

        '.clock': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0.5,0.5], curve: 'inOutExpo' },
                '100%': { value: [0,0], curve: 'inOutExpo' }
            }
        }
    },

    'show-calendar': {

        '.calendar': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0,0], curve: 'inOutExpo' },
                '100%': { value: [0.5,0.5], curve: 'inOutExpo' }
            }
        }
    },

    'hide-calendar': {

        '.calendar': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0.5,0.5], curve: 'inOutExpo' },
                '100%': { value: [0,0], curve: 'inOutExpo' }
            }
        }
    },

    'show-weather': {

        '.weather': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0,0], curve: 'inOutExpo' },
                '100%': { value: [0.5,0.5], curve: 'inOutExpo' }
            }
        }
    },

    'hide-weather': {

        '.weather': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0.5,0.5], curve: 'inOutExpo' },
                '100%': { value: [0,0], curve: 'inOutExpo' }
            }
        }
    },

    'show-stocks': {

        '.stocks': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0,0], curve: 'inOutExpo' },
                '100%': { value: [0.5,0.5], curve: 'inOutExpo' }
            }
        }
    },

    'hide-stocks': {

        '.stocks': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0.5,0.5], curve: 'inOutExpo' },
                '100%': { value: [0,0], curve: 'inOutExpo' }
            }
        }
    },

    'show-photos': {

        '.photos': {
            'opacity': {
                '0%': { value: 0, curve: 'outExpo' },
                '100%': { value: 1, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0,0], curve: 'inOutExpo' },
                '100%': { value: [0.5,0.5], curve: 'inOutExpo' }
            }
        }
    },

    'hide-photos': {

        '.photos': {
            'opacity': {
                '0%': { value: 1, curve: 'outExpo' },
                '100%': { value: 0, curve: 'outExpo' }
            },
            'scale': {
                '0%': { value: [0.5,0.5], curve: 'inOutExpo' },
                '100%': { value: [0,0], curve: 'inOutExpo' }
            }
        }
    }
})
.config({

    includes: [
        'dashboard.css'
    ]
});
