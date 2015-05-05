BEST.module('arkady.pevzner:layouts:header-footer-example', {
    behaviors: {
        '#container' : {
            'size-proportional': function(containerProportion) {
                return containerProportion;
            }
        },
        '#hf' : {
            'header-height' : 100,
            'footer-height' : 100
        },
        '#header-el' : {
            content: function(title) {
                return title;
            },
            style: function(headerHeight, headerBackgroundColor) {
                return {
                    'background-color' : headerBackgroundColor,
                    'line-height' : headerHeight + 'px',
                    'text-align' : 'center',
                    'color' : 'white',
                    'font-size' : '30px',
                    'font-weight' : 'bold'
                }
            }
        },
        '#body' : {
            'overflow' : 'hidden'
        },
        '#two-panel-layout' : {
            'display-left-panel' : function(leftPanelWidth) {
                return leftPanelWidth;
            },
            'display-right-panel' : function(rightPanelWidth) {
                return rightPanelWidth;
            },
            'curve' : function(panelTransition) {
                return panelTransition;
            }
        },
        '#scroll-view' : {
            count: function(count) {
                return count;
            },
            'item-height': function(itemHeight) {
                return itemHeight;
            },
            'item-style' : function(itemStyle, itemHeight) {
                // Temp variable created because state should not be altered
                // inside of a behavior.
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
            }
        },
        '#footer-bar' : {
            'background-style': function(footerBackgroundStyle) {
                return footerBackgroundStyle;
            },
            'button-style' : function(footerButtonStyle, footerButtonSize) {
                // Temp variable created because state should not be altered
                // inside of a behavior.
                var temp = footerButtonStyle;
                temp['line-height'] = footerButtonSize[1] + 'px';
                return temp;
            },
            'button-size' : function(footerButtonSize) {
                return footerButtonSize;
            },
            'button-one-content' : function(buttonOneContent){
                return buttonOneContent;
            },
            'button-two-content' : function(buttonTwoContent){
                return buttonTwoContent;
            }
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
        '#footer-bar' : {
            'button-one-click' : function($state) {
                // HACK --> Need a way to query nodes for their size
                var containerWidth = document.getElementById('container').clientWidth;
                $state.set('leftPanelWidth', containerWidth);
            },
            'button-two-click' : function($state) {
                // HACK --> Need a way to query nodes for their size
                var containerWidth = document.getElementById('container').clientWidth;
                $state.set('rightPanelWidth', containerWidth);
            }
        }
    },
    states: {
        // Container properties
        containerProportion: [0.8, 0.8],

        // Header properties
        title: 'Basic Feed Layout',
        headerHeight: 100,
        headerBackgroundColor: 'rgb(29, 25, 115)',

        // Body properties
            // two panel properties
            panelTransition: {duration: 450, 'curve' : 'outExpo'},

            // Scrollview properties
            count: 25,
            itemHeight: 100,
            itemStyle: {
                border: '1px solid black',
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
            'background-color' :'rgb(29, 25, 115)'
        },
        footerButtonSize: [200, 50],
        footerButtonStyle: {
            'border' : '1px solid white',
            'color' : 'white',
            'border-radius' : '5px',
            'text-align' : 'center',
            'font-size' : '20px'
        },
        buttonOneContent: 'Famo.us Layout',
        buttonTwoContent: 'Template Layout',
    },
    tree: 'header-footer-example.html'
})
.config({
    imports: {
        'famous:core': ['view', 'dom-element', 'ui-element'],
        'arkady.pevzner:layouts' : [
            'header-footer', 'basic-scroll-view', 'footer-bar', 'two-panel-layout', 'template-scroll-layout'
        ]
    }
});
