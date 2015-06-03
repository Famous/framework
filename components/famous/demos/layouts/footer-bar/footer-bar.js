BEST.module('famous:demos:layouts:footer-bar', {
    behaviors: {
        '#background' : {
            style: '[[identity|backgroundStyle]]'
        },
        '.button' : {
            'size': '[[identity|buttonSize]]',
            'style': '[[identity|buttonStyle]]',
            'origin' : [0.5, 0.5],
            'align'  : [0.5, 0.5],
            'unselectable' : true
        },
        '#button1' : {
            'content' : '[[identity|buttonOneContent]]',
            'mount-point' : [1, 0.5],
            'position' : function(buttonSize) {
                return [-buttonSize[0] , 0]
            }
        },
        '#button2' : {
            content: '[[identity|buttonTwoContent]]',
            'position' : [0, 0],
            'mount-point' : [0.5, 0.5],
        },
        '#button3' : {
            content: '[[identity|buttonThreeContent]]',
            'mount-point' : [0, 0.5],
            'position' : function(buttonSize) {
                return [buttonSize[0] , 0]
            }
        }
    },
    events: {
        $public: {
            'background-style' : '[[setter|camel]]',
            'button-style' : '[[setter|camel]]',
            'button-size' : '[[setter|camel]]',
            'button-one-content' : '[[setter|camel]]',
            'button-two-content' : '[[setter|camel]]',
            'button-three-content' : '[[setter|camel]]'
        },
        /*
        `$dispatcher.emit` will send a message up the component hierarchy.
        Progenitors can subscribe to the events and react accordingly.
         */
        '#button1' : {
            'click' : function($dispatcher, $payload) {
                console.log('button one click');
                $dispatcher.emit('button-one-click', $payload);
            }
        },
        '#button2' : {
            'click' : function($dispatcher, $payload) {
                console.log('button TWO click');
                $dispatcher.emit('button-two-click', $payload);
            }
        },
        '#button3' : {
            'click' : function($dispatcher, $payload) {
                console.log('button THREE click');
                $dispatcher.emit('button-three-click', $payload);
            }
        }
    },
    states: {
        backgroundStyle: {
            'background-color' : 'black'
        },
        buttonStyle: {
            'cursor' : 'pointer'
        },
        buttonSize: [200, 100],
        buttonOneContent: 'Button 1',
        buttonTwoContent: 'Button 2',
        buttonThreeContent: 'Button 3',
    },
    tree: 'footer-bar.html',
});
