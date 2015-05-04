BEST.module('arkady.pevzner:layouts:footer-bar', {
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
            content: function(buttonOneContent) {
                return buttonOneContent;
            },
            'position' : function(buttonSize) {
                return [-buttonSize[0], 0];
            }
        },
        '#button2' : {
            content: function(buttonTwoContent){
                return buttonTwoContent;
            },
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
            'buttonOneContent' : 'setter|camel',
            'buttonTwoContent' : 'setter|camel'
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
