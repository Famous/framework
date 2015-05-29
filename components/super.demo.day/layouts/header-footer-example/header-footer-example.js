BEST.module('super.demo.day:layouts:header-footer-example', 'HEAD', {
    behaviors: {
        /*
        `$self` behaviors are routed to a component's events. The framework first checks
        if there is a matching `$private` event, then checks for a matching `$public` event.
         */
        '$self': {
            /*
            '[[setter|camel]]' is a shorthand that gets expanded during server-side compilation to:
            animate-panel-one: function(animatePanelOne) {
                return animatePanelOne;
            }
            Alternatively, the user can use '[[identity|`variableName`]]', to directly define the 
            variable to be passed back.
             */
            'animate-panel-one' : '[[setter|camel]]',
            'animate-panel-two' : '[[setter|camel]]',
            'animate-panel-three' : '[[setter|camel]]'
        },
        '#container' : {
            'size-proportional': '[[identity|containerProportion]]',
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        },
        '#hf' : {
            'header-height' : '[[setter|camel]]',
            'footer-height' : '[[setter|camel]]',
        },
        '#header-el' : {
            content: '[[identity|title]]',
            style: function(headerStyle, headerHeight) {
                /*
                A temporary variable is created to mix-in dynamic styles with styles
                that are definted in state. The reason for this is that `behaviors` are purely
                functional and should not alter variables stored in `state`. There is a suite of helper 
                functions provided by the framework that are available via `BEST.helpers`, including the
                'clone' method.
                 */
                var temp = BEST.helpers.clone(headerStyle);
                temp['line-height'] = headerHeight + 'px';
                return temp;
            }
        },
        '#body' : {
            /*
            `overflow: "hidden"` can be set on a `<view>` component. Doing so will force DOM-nesting
            by attaching a DOMElement on to the Famous Node associated with the view.
            In this case, `overflow: "hidden"` is added in order to ensure that only one layout panel
            is visible at a given time.
             */
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
            scale: '[[identity|webGLScale]]',
            opacity: '[[identity|webGLOpacity]]',
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
            /*
            '[[setter|camel]]' in events is a shorthand that gets expanded during server side
            compilation to:
            'container-proportion' : function($state) {
                $state.set('containerProportion');
            }

            '$public' events define the outside messaging interface to a component. Messages
            can be sent to a component from outside of the framework with:
            BEST.message('selector', '$root', 'container-proportion', [0.5, 0.5]);
                'selector' corresponds the the selector used for BEST.deploy
                '$root' corresponds to the component that was deployed. Alternatively, a CSS selector can
                        be used to send messages to subcomponents of the deployed component.
             */
            'container-proportion' : '[[setter|camel]]',
            'title' : '[[setter]]',
            'header-height' : '[[setter|camel]]',
            'header-background-color' : '[[setter|camel]]',
            'panel-transition' : '[[setter|camel]]',
            'count' : '[[setter]]',
            'item-height' : '[[setter|camel]]',
            'item-style' : '[[setter|camel]]',
            'footer-background-style' : '[[setter|camel]]',
            'footer-button-style' : '[[setter|camel]]',
            'footer-button-size' : '[[setter|camel]]',
            'button-one-content' : '[[setter|camel]]',
            'button-two-content' : '[[setter|camel]]',
            'button-three-content' : '[[setter|camel]]',
        },
        /*
        '$private' events can only be triggered via behaviors under the '$self' selector
         */
        '$private' : {
            'animate-panel-one' : function($state) {
                if ($state.get('webGLOpacity') > 0) {
                    var curve = $state.get('webGLHideCurve');
                    $state.set('webGLScale', [0.001, 0.001, 0.001], curve)
                        .thenSet('webGLOpacity', 0, {duration: 1})
                        .thenSet('displayPanelOne', true);
                }
                else {
                    $state.set('displayPanelOne', true);
                }
            },
            'animate-panel-two' : function($state) {
                if ($state.get('webGLOpacity') > 0) {
                    var curve = $state.get('webGLHideCurve');
                    $state.set('webGLScale', [0.001, 0.001, 0.001], curve)
                        .thenSet('webGLOpacity', 0, {duration: 1})
                        .thenSet('displayPanelTwo', true);
                }
                else {
                    $state.set('displayPanelTwo', true);
                }
            },
            'animate-panel-three' : function($state) {
                $state.set('displayPanelThree', true);

                // // show webgl (overrides overflow: hidden)
                var duration = $state.get('panelTransition').duration;
                var curve = $state.get('webGLShowCurve');
                $state.set('_wait', duration, $state.get('panelTransition'))
                    .thenSet('webGLOpacity', 1, {duration: 1})
                    .thenSet('webGLScale', [1, 1, 1], curve);
            }
        },
        '#container' : {
            /*
            Subscribing to a `size-change` event creates a listener on the FamousNode associated
            with the selected component.
             */
            'size-change' : function($state, $payload) {
                $state.set('panelWidth', $payload[0]);

                // Re-trigger panel animation to account for updated
                // width
                var currentPanel = $state.get('currentPanel');
                if (currentPanel === 1) {
                    $state.set('animatePanelOne', true);
                }
                else if (currentPanel === 2) {
                    $state.set('animatePanelTwo', true);
                }
                else if (currentPanel === 3) {
                    $state.set('animatePanelThree', true);
                }
            }
        },
        /*
        'descendant' events (i.e., events that are not under the '$public/$private/$lifecycle')
        are triggered via descendant components emitting messages using $dispatcher.emit.
        See <scroll-view-item> for an example.
         */
        '#footer-bar' : {
            'button-one-click' : function($state) {
                $state.set('animatePanelOne', true);
                $state.set('currentPanel', 1);
            },
            'button-two-click' : function($state) {
                $state.set('animatePanelTwo', true);
                $state.set('currentPanel', 2);
            },
            'button-three-click' : function($state) {
                $state.set('animatePanelThree', true);
                $state.set('currentPanel', 3);
            },
        }
    },
    /*
    All of this examples state is stored in a single place of truth. The state is modified via events,
    and those events trigger changes that are picked up by the behaviors.
     */
    states: {
        // Container properties
        containerProportion: [0.8, 0.8],

        // Header properties
        title: 'Three Panel Layout',
        headerHeight: 225,
        headerStyle: {
            'background-color': '#333333',
            'text-align' : 'center',
            'color' : '#7099EE',
            'font-size' : '66px',
            'font-family': 'Lato',
            'font-weight': 'bold'
        },

        // Body properties
        // three panel properties
        currentPanel: 1,
        panelTransition: {duration: 450, 'curve' : 'outExpo'},

        // Scrollview properties
        count: 36,
        itemHeight: 200,
        itemStyle: {
            'color': 'white',
            'text-align' : 'center',
            'font-size' : '50px',
            'cursor' : 'pointer',
            'font-family': 'Lato'
        },

        // Template layout properties
        templateItemCount: 20,
        loremIpsum: '' +
            'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ' +
            'ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat ' +
            'eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,' +
            'wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis' +
            'pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam ' +
            'erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus',

            // WebGL example properties
            _wait: 0,
            webGLScale: [0.001, 0.001, 0.001],
            webGLOpacity: 0,
            webGLShowCurve: {duration: 600, curve: 'outExpo'},
            webGLHideCurve: {duration: 300, curve: 'outSine'},

        // Footer properties
        footerHeight: 150,
        footerBackgroundStyle: {
            'background-color' :'#333333',
            'font-size': '24px',
            'font-family': 'Lato'
        },
        footerButtonSize: [250, 100],
        footerButtonStyle: {
            'border' : '1px solid #7099EE',
            'color' : '#7099EE',
            'border-radius' : '5px',
            'text-align' : 'center',
            'font-family': 'Lato',
            'font-size' : '30px',
            'font-weight': 'bold'
        },
        buttonOneContent: 'Famo.us Layout',
        buttonTwoContent: 'Template Layout',
        buttonThreeContent: 'Platform Content'
    },
    tree: 'header-footer-example.jade'
})
.config({
    imports: {
        'super.demo.day:layouts' : [
            'header-footer', 'basic-scroll-view', 'footer-bar', 
            'three-panel-layout', 'template-scroll-layout'
        ],
        'super.demo.day' : ['attach-webgl']
    }
});
