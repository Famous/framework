BEST.module('arkady.pevzner:layouts:header-footer-example', 'HEAD', {
    behaviors: {
        '#container' : {
            'size-proportional': '[[identity|containerProportion]]',
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        },
        '#hf' : {
            'header-height' : 100,
            'footer-height' : 100
        },
        '#header-el' : {
            content: '[[identity|title]]',
            style: function(headerHeight, headerBackgroundColor) {
                return {
                    'background-color' : headerBackgroundColor,
                    'line-height' : headerHeight + 'px',
                    'text-align' : 'center',
                    'color' : '#7099EE',
                    'font-size' : '36px',
                    'font-family': 'Lato',
                    'font-weight': 'bold'
                }
            }
        },
        '#body' : {
            'overflow' : 'hidden'
        },
        '#two-panel-layout' : {
            'display-left-panel' : '[[identity|leftPanelAnimationWidth]]',
            'display-right-panel' : '[[identity|rightPanelAnimationWidth]]',
            'curve' : '[[identity|panelTransition]]'
        },
        '#scroll-view' : {
            count: '[[setter]]',
            'item-height': '[[setter|camel]]',
            'item-style' : function(itemStyle, itemHeight) {
                // Temp variable created because state
                // should not be altered inside of a behavior.
                var temp = itemStyle;
                temp['line-height'] = itemHeight + 'px';
                return temp;
            }
        },
        '.right-panel' : {
            'set-template' : function(templateItemCount, loremIpsum) {
                var result = [];
                for (var i = 1; i <= templateItemCount; i++) {
                    result.push({
                        title: 'Title ' + i,
                        content: loremIpsum,
                        image: 'http://placehold.it/150x150'
                    });
                }
                return result;
            },
            'style': {
                'background-color': 'whitesmoke',
                'overflow': 'scroll',
                'border': 'none'
            }
        },
        '#footer-bar' : {
            'background-style': function(footerBackgroundStyle) {
                return footerBackgroundStyle;
            },
            'button-style' : function(footerButtonStyle, footerButtonSize) {
                // Temp variable created because state
                // should not be altered inside of a behavior.
                var temp = footerButtonStyle;
                temp['line-height'] = footerButtonSize[1] + 'px';
                return temp;
            },
            'button-size' : '[[identity|footerButtonSize]]',
            'button-one-content' : '[[identity|buttonOneContent]]',
            'button-two-content' : '[[identity|buttonTwoContent]]'
        }
    },
    events: {
        $public: {
            'container-proportion' : 'setter|camel',
            'title' : 'setter',
            'header-height' : 'setter|camel',
            'header-background-color' : 'setter|camel',
            'panel-transition' : 'setter|camel',
            'count' : 'setter',
            'item-height' : 'setter|camel',
            'item-style' : 'setter|camel',
            'footer-background-style' : 'setter|camel',
            'footer-button-style' : 'setter|camel',
            'footer-button-size' : 'setter|camel',
            'button-one-content' : 'setter|camel',
            'button-two-content' : 'setter|camel',
        },
        '#container' : {
            'size-change' : function($state, $payload) {
                $state.set('panelWidth', $payload[0]);
            }
        },
        '#footer-bar' : {
            'button-one-click' : function($state) {
                $state.set('leftPanelAnimationWidth', $state.get('panelWidth'));
            },
            'button-two-click' : function($state) {
                $state.set('rightPanelAnimationWidth', $state.get('panelWidth'));
            }
        }
    },
    states: {
        // Container properties
        containerProportion: [0.8, 0.8],

        // Header properties
        title: 'Basic Feed Layout',
        headerHeight: 100,
        headerBackgroundColor: '#444444',

        // Body properties
        // two panel properties
        panelTransition: {duration: 450, 'curve' : 'outExpo'},

        // Scrollview properties
        count: 25,
        itemHeight: 100,
        itemStyle: {
            'border': 'none',
            'color': '#444444',
            'background-color' : 'whitesmoke',
            'text-align' : 'center',
            'font-size' : '24px',
            'cursor' : 'pointer'
        },

        // Template layout properties
        templateItemCount: 20,
        loremIpsum: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus',

        // Footer properties
        footerBackgroundStyle: {
            'background-color' :'#444444',
            'font-size': '24px',
            'font-family': 'Lato'
        },
        footerButtonSize: [200, 50],
        footerButtonStyle: {
            'border' : '1px solid #7099EE',
            'color' : '#7099EE',
            'border-radius' : '5px',
            'text-align' : 'center',
            'font-family': 'Lato',
            'font-size' : '20px',
            'font-weight': 'bold'
        },
        buttonOneContent: 'Famo.us Layout',
        buttonTwoContent: 'Template Layout',
    },
    tree: 'header-footer-example.html'
})
.config({
    imports: {
        'arkady.pevzner:layouts' : [
            'header-footer', 'basic-scroll-view', 'footer-bar', 'two-panel-layout', 'template-scroll-layout'
        ]
    }
});
