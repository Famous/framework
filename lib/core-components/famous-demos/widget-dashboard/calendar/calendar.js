var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var MONTH_NAMES = ['January', 'February', 'March', 'April',
                   'May', 'June', 'July', 'August', 'September',
                   'October', 'November', 'December'];

/**
 * A basic calendar widget showing today's date, as well as a month view.
 *
 * TODO: known issue - long months occassionally get the last few days clipped! e.g. january 2016
 *
 * TODO: known issue - click events don't register on deeply nested html elements.  In this case, the dates in the month view grid.
 */
FamousFramework.scene('famous-demos:widget-dashboard:calendar', {

    behaviors: {

        '.container': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-z': 1,
            'unselectable': true,
            'size-absolute': [900, 400],
            'style': {
                'border-radius':'25px',
                'box-shadow': '0 0 20px black'
            }
        },

        '.today' :{
            'size-absolute':[400,400],
            'style': {
                'border-radius':'25px',
                'border':'5px solid white',
                'background':'black'
            }
        },

        '.today .day': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-y':20,
            'style': {
                'text-align':'center',
                'font-size':'50px',
                'color':'#40b2e8'
            },

            'content': function(date) {
                var d = new Date(date);
                return DAY_NAMES[d.getDay()];
            }
        },

        '.today .date': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-y':90,

            'style': {
                'text-align':'center',
                'font-size':'220px',
                'font-weight':'bold',
                'color':'white'
            },

            'content': function(date) {
                var d = new Date(date);
                return d.getDate();
            }
        },

        '.calendar': {
            'size-absolute':[500,400],
            'position-x':400,
            'style': {
                'border-radius':'25px',
                'border':'5px solid white',
                'background':'black'
            }
        },

        '.calendar .month': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-y':20,

            'content':function(month, year) {
                return MONTH_NAMES[month] + " " + year;
            },

            'style': {
                'font-size':'40px',
                'text-align':'center',
                'color':'#40b2e8'
            }
        },

        '.calendar .next': {
            'align': [0, 0],
            'position-x':410,
            'position-y':30,
            'position-z':5,
            'size-absolute': [50,50],

            'style': {
                'cursor':'pointer'
            }
        },

        '.calendar .previous': {
            'align': [0, 0],
            'position-x':50,
            'position-y':30,
            'position-z':5,
            'size-absolute': [50,50],

            'style': {
                'cursor':'pointer'
            }
        },

        '.calendar .header': {
            'position-y': 40
        },

        '.calendar .days': {
            'position-y':70,
            'position-z': 2,

            'style': {
                'color':'white'
            },

            //TODO: the below fucked up monstrosity is a result of me defaulting to straight up html
            //TODO: due to not having a grid component.  I didn't have time to create a grid component,
            //TODO: but that could probably have alleviated much of this in favor of the BEST way.
            //TODO: the only issue with it is that click events don't register on the table cells :/
            'content': function(month, year, date) {

                var d = new Date(date);
                var days = DAYS_IN_MONTH[month];
                var weeks = days / 7;

                var table = '<table class="days">';
                table += "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>";

                var m = month || 0;
                m += 1;

                if(m < 10) {
                    m = "0" + m;
                }

                var y = year || d.getFullYear();
                var startDay = new Date(y + "-" + m + "-01T00:00:00").getDay();

                var day = 0;
                for(var i=0;i<weeks;i++) {

                    table += "<tr>";

                    for(var j=0;j<7;j++) {

                        //add spacers until our starting day of the week
                        if(day == 0 && j != startDay) {
                            table += '<td class="spacer"></td>';
                            continue;
                        }

                        //no need to continue if we're out of days
                        if(++day > days) {
                            break;
                        }

                        if(d.getDate() == day && month == d.getMonth() && year == d.getFullYear()) {
                            table += '<td class="active">' + day + '</td>';
                        }
                        else {
                            table += '<td>' + day + '</td>';
                        }
                    }

                    table += "</tr>";
                }

                table += '</table>';

                return table;
            }
        }
    },

    events: {

        '$lifecycle': {

            /**
             * Set the date initially on load.
             *
             * @param $dispatcher The event dispatcher
             * @param $state The state manager.
             */
            'post-load': function($dispatcher, $state) {

                var d = new Date($state.get("date"));
                $state.set("year", d.getFullYear());
                $state.set("month", d.getMonth());
            }
        },

        //TODO: example of nested HTML elements not receiving events
        //TODO: left in to show the intention.
        '.calendar td': {

            'click': function() {
                console.log("Clicked doesn't happen!!!");
            }
        },

        '.calendar .next': {

            'click': function($state, $dispatcher) {

                var month = $state.get("month");
                var year = $state.get("year");

                var nextMonth;
                if(month >= 11) {
                    nextMonth = 0;
                    $dispatcher.trigger("year", year + 1);
                }
                else {
                    nextMonth = month + 1;
                }

                $dispatcher.trigger("month", nextMonth);
            }
        },

        '.calendar .previous': {

            'click': function($state, $dispatcher) {

                var month = $state.get("month");
                var year = $state.get("year");

                var prevMonth;
                if(month <= 0) {
                    prevMonth = 11;
                    $dispatcher.trigger("year", year - 1);
                }
                else {
                    prevMonth = month - 1;
                }

                $dispatcher.trigger("month", prevMonth);
            }
        },

        '$public': {

            'date':'[[setter]]',

            'month': function($state, $payload) {

                var date = new Date($state.get("date"));
                var m = $payload == null ? date.getMonth() : $payload;

                $state.set("month", m);
            },

            'year': function($state, $payload) {

                var date = new Date($state.get("date"));
                var y = $payload == null ? date.getFullYear() : $payload;

                $state.set("year", y);
            }
        }
    },

    states: {

        /**
         * The current date used for the left-hand 'today'
         * control as well as the starting date for the month view)
         */
        date: new Date().getTime(),

        /**
         * The currently selected month.
         */
        month: null,

        /**
         * The currently selected year.
         */
        year: null
    },

    tree: 'calendar.html'
})
.config({
    includes: [
        'calendar.css'
    ]
});
