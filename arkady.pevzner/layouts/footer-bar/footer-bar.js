BEST.module('arkady.pevzner:layouts:footer-bar', 'HEAD', {
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
            'background-style' : 'setter|camel',
            'button-style' : 'setter|camel',
            'button-size' : 'setter|camel',
            'button-one-content' : 'setter|camel',
            'button-two-content' : 'setter|camel',
            'button-three-content' : 'setter|camel'
        },
        '#button1' : {
            'ui-click' : function($dispatcher, $payload) {
                $dispatcher.emit('button-one-click', $payload);
            }
        },
        '#button2' : {
            'ui-click' : function($dispatcher, $payload) {
                $dispatcher.emit('button-two-click', $payload);
            }
        },
        '#button3' : {
            'ui-click' : function($dispatcher, $payload) {
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
