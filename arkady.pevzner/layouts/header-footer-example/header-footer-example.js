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
        '#three-panel-layout' : {
            'curve' : '[[identity|panelTransition]]',
            'panel-width' : '[[setter|camel]]',
            'display-panel-one' : '[[setter|camel]]',
            'display-panel-two' : '[[setter|camel]]',
            'display-panel-three' : '[[setter|camel]]'
        },
        '.panel-1' : { // <basic-scroll-view>
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
        '.panel-2' : { // <template-scroll-layout>
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
            }
        },
        '.panel-3' : {
            opacity: '[[identity|webGLOpacity]]'
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
            'button-one-content' : '[[setter|camel]]',
            'button-two-content' : '[[setter|camel]]',
            'button-three-content' : '[[setter|camel]]'
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
            'button-three-content' : 'setter|camel',
        },
        '#container' : {
            'size-change' : function($state, $payload) {
                $state.set('panelWidth', $payload[0]);
            }
        },
        '#footer-bar' : {
            'button-one-click' : function($state) {
                $state.set('displayPanelOne', true);

                // hide webgl
                if ($state.get('webGLOpacity') > 0) {
                    $state.set('webGLOpacity', 0, {duration: 75, curve: 'outSine'});
                }
            },
            'button-two-click' : function($state) {
                $state.set('displayPanelTwo', true);

                // hide webgl
                if ($state.get('webGLOpacity') > 0) {
                    $state.set('webGLOpacity', 0, {duration: 75, curve: 'outSine'});
                }
            },
            'button-three-click' : function($state) {
                $state.set('displayPanelThree', true)
                    .thenSet('webGLOpacity', 1, {duration: duration, curve: 'outSine'})

                // show webgl (overrides overflow: hidden)
                var duration = $state.get('panelTransition').duration;
                $state.set('_wait', duration, $state.get('panelTransition'))
                    .thenSet('webGLOpacity', 1, {duration: 200, curve: 'outSine'});
            },
        }
    },
    states: {
        // Container properties
        containerProportion: [0.8, 0.8],

        // Header properties
        title: 'Basic Feed Layout',
        headerHeight: 100,
        headerBackgroundColor: '#333333',

        // Body properties
        // two panel properties
        panelTransition: {duration: 450, 'curve' : 'outExpo'},

        // Scrollview properties
        count: 25,
        itemHeight: 100,
        itemStyle: {
            'color': '#333333',
            'background-color' : 'whitesmoke',
            'text-align' : 'center',
            'font-size' : '24px',
            'cursor' : 'pointer',
            'font-family': 'Lato'
        },

        // Template layout properties
        templateItemCount: 20,
        loremIpsum: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus',

            // WebGL example properties
            webGLOpacity: 0,
            _wait: 0,

        // Footer properties
        footerBackgroundStyle: {
            'background-color' :'#333333',
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
        buttonThreeContent: 'Platform Content'
    },
    tree: 'header-footer-example.html'
})
.config({
    imports: {
        'arkady.pevzner:layouts' : [
            'header-footer', 'basic-scroll-view', 'footer-bar', 'three-panel-layout', 'template-scroll-layout'
        ]
    }
});
