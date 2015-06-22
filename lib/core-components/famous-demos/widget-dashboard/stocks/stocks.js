/**
 * A few tickers to add initially so things don't look so blank.
 * @type {string[]}
 */
var TICKERS = ["MSFT", "GOOG", "TSLA"];

/**
 * A widget to check stock information for a given collection of stocks.
 */
FamousFramework.scene('famous-demos:widget-dashboard:stocks', {

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
                'background':'black',
                'box-shadow': '0 0 20px black'
            }
        },

        '.add-ticker': {
            'size':[70,50],
            'position-z': 1,
            'position-x':40,
            'position-y':10,
            'content': '+',
            'style': {
                'font-size':'50px',
                'line-height':'45px',
                'text-align':'center',
                'border-radius':'10px',
                'color':'#40b2e8',
                'border':'2px solid #40b2e8',
                'background-color':'#222',
                'cursor':'pointer'
            }
        },

        '.text-box': {
            'size':[250, 50],
            'position-x':120,
            'position-y':5,
            'position-z':1
        },

        '.ticker-master': {
            'size-absolute': [400, 320],
            'position-y':80,

            'style': {
                'border-radius':'25px',
                'text-align': 'center',
                'overflow-x' : 'scroll'
            }
        },

        '.ticker-item': {

            'size':[360, 80],

            'style': {
                'border-radius':'10px',
                'margin':'0 20px',
                'padding-top':'15px',
                'font-size':'38px',
                'cursor':'pointer',
                'color':'#40b2e8',
                'border':'2px solid #40b2e8',
                'background':'#222'
            },

            //TODO: Repeat functionality is a little bit odd in that I can't push a Node as my content.
            //TODO: It is HTML only - this severely limits the scalability of apps (especially given the issues including HTML in general) -
            //TODO: I would expected to be able to do something like: content: '<my:custom:node>'
            '$repeat': function(stocks) {

                var result = [];
                for (var i = 0; i < stocks.length; i++) {

                    result.push({
                        position: [0, (i * 90)],
                        content: stocks[i].t,
                        model: stocks[i]
                    });
                }

                return result;
            }
        },

        '.ticker-detail': {

            'size':[500, 400],
            'position-x':400,

            'style': {
                'border-radius':'25px',
                'background':'#222',
                'color':'#40b2e8',
                'position':'relative'
            },

            'content': function(selectedStock) {

                if(!selectedStock) {
                    return "<h3 class='none-selected'>(No stock selected)</h3>";
                }

                return "<h2>" + selectedStock.t + "</h2>" +
                       "<h3>" + selectedStock.c + " (" + selectedStock.cp + "%)</h3>" +
                       "<h4 id='stock-l'>" + selectedStock.l + "</h4>" +
                       "<div class='chart' style='background:url(https://www.google.com/finance/getchart?q=" + selectedStock.t + ") 0px -10px no-repeat #222;'>";
            }
        },

        '.stock-service': {

            /**
             * Make a query to the stock service
             * whenever the ticker collection is updated.
             *
             * @param tickers The collection of stock tickers.
             * @returns {*}
             */
            'query': '[[identity|tickers]]'
        }
    },

    events: {

        '.stock-service': {

            'response': function($payload, $state) {
                $state.set("stocks", $payload);
            },

            'error': function($payload) {
                console.warn("ERROR calling stock service:", $payload);
            }
        },

        '.add-ticker': {

            'click': function($state, $payload, $dispatcher) {

                var tickerToAdd = $state.get("tickerToAdd");
                if(tickerToAdd == null || tickerToAdd == '') {
                    return;
                }

                var tickers = $state.get("tickers");
                tickers.push(tickerToAdd.toUpperCase());
                $state.set("tickers", tickers);

                //clear the ticker-to-add value
                $state.set("tickerToAdd", null);
            }
        },

        '.text-box': {

            'value': function($state, $payload) {
                $state.set("tickerToAdd", $payload);
            }
        },

        '.ticker-item': {

            //TODO: there is weirdness here in the variable $repeatPayload
            //TODO: this confused me at first - is this a repetition of $payload???
            //TODO: how is this different than the other $payload?
            //TODO: other platforms handle this by making the selected value part of the event
            //TODO: e.g. $event.selectedItem

            'click': function($state, $event, $index, $repeatPayload) {
                $state.set("selectedStock", $repeatPayload.model);
            }
        }
    },

    states: {

        /**
         * The collection of stock tickers
         */
        tickers: TICKERS,

        /**
         * The stock results returned from the web service.
         */
        stocks: [],

        /**
         * The currently selected stock
         */
        selectedStock: null
    },

    tree: 'stocks.html'
})
.config({
    includes: [
        'stocks.css'
    ]
});
