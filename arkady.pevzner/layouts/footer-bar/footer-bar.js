BEST.module('arkady.pevzner:layouts:footer-bar', 'HEAD', {
    behaviors: {
        '#background' : {
            style: function(backgroundStyle) {
                return backgroundStyle;
            }
        },
        '.button' : {
            size: function(buttonSize) {
                return buttonSize;
            },
            style: function(buttonStyle) {
                return buttonStyle
            },
            'mount-point' : [0.5, 0.5],
            'origin' : [0.5, 0.5],
            'align'  : [0.5, 0.5],
            'unselectable' : true
        },
        '#button1' : {
            'content' : '[[identity|buttonOneContent]]',
            'position' : function(buttonSize) {
                return [-buttonSize[0], 0];
            },
        },
        '#button2' : {
            content: '[[identity|buttonTwoContent]]',
            'position' : function(buttonSize) {
                return [buttonSize[0], 0];
            }
        }
    },
    events: {
        $public: {
            'background-style' : 'setter|camel',
            'button-style' : 'setter|camel',
            'button-size' : 'setter|camel',
            'button-one-content' : 'setter|camel',
            'button-two-content' : 'setter|camel'
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
        }
    },
    states: {
        style: {
            'background-color' : 'black'
        },
        buttonStyle: {
            'cursor' : 'pointer'
        },
        buttonSize: [200, 100],
        buttonOneContent: 'Button 1',
        buttonTwoContent: 'Button 2'
    },
    tree: 'footer-bar.html',
})
.config({
    imports: {
        'famous:core': ['ui-element']
    }
});
