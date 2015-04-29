BEST.register('arkady.pevzner:square', {
    tree: '' +
        '<famous:core:view id="button-view">' +
        '  <famous:core:dom-element id="button">' +
        '  </famous:core:dom-element>' +
        '</famous:core:view>' +

        '<famous:core:view id="square-view">' +
        '  <famous:core:dom-element id="surface">' +
        '  </famous:core:dom-element>' +

        '  <famous:core:view id="label">' +
        '     <famous:core:dom-element id="default-label">' +
        '     </famous:core:dom-element>' +
        '  </famous:core:view>' +
        '</famous:core:view>',

    behaviors: {
        '#square-view' : {
            'rotation-z' : function(rotationZ) {
                return rotationZ;
            },
            position: function(position, offset) {
                return [position[0], position[1] + offset];
            },
            origin: function(origin) {
                return origin;
            },
            size: function(size) {
                return size;
            },
            '$if' : function(showSquare) {
                return showSquare;
            }
        },
        '#surface' : {
            content: function(content) {
                return content;
            },
            style: function(backgroundColor) {
                return {
                    'background-color' : backgroundColor,
                    'border' : '1px solid black'
                }
            }
        },
        '#label' : {
            position: [0, 50],
            $yield: true
        },
        '#default-label' : {
            content: 'Default Label'
        },
        '#button' : {
            style: {
                'border': '1px solid black',
                'text-align' : 'center',
                'line-height' : '40px',
                'cursor' : 'pointer'
            },
            content: 'show/hide'
        },
        '#button-view' : {
            size: [80, 40],
            position: function (buttonPosition) {
                return buttonPosition;
            }
        }
    },
    events: {
        $public: {
            'rotation-y' : function($state, $payload) {
                $state.set('rotationY', $payload);
            },
            'rotation-z' : function($state, $payload) {
                $state.set('rotationZ', $payload);
            },
            'position' : function($state, $payload) {
                $state.set('position', $payload);
            },
            'content' : function($state, $payload) {
                $state.set('content', $payload);
            },
            'origin' : function($state, $payload) {
                $state.set('origin', $payload);
            },
            'size' : function($state, $payload) {
                $state.set('size', $payload);
            },
            'background-color' : function($state, $payload) {
                $state.set('backgroundColor', $payload);
            },
            'button-position' : function($state, $payload) {
                $state.set('buttonPosition', $payload);
            }
        },
        '#button' : {
            'famous:events:click': function($state, $payload, $dispatcher) {
                $state.set('showSquare', !$state.get('showSquare'));
                $dispatcher.emit('custom-event',  'payload');
            }
        }
    },
    states: {
        backgroundColor: 'whitesmoke',
        content: 'Square',
        offset: 50,
        position: [0, 0],
        buttonPosition: [0, 0],
        size: [200, 200],
        showSquare: true
    }
});

BEST.register('arkady.pevzner:control-flow:test', {
    tree: '' +
        '<arkady.pevzner:square class="repeat">'+
        '   <famous:core:dom-element id="label">' +
        '       <div>Yielded Label</div>' +
        '   </famous:core:dom-element>' +
        '</arkady.pevzner:square>',

    behaviors: {
        '.repeat' : {
            size: [200, 200],
            '$repeat' : function(count, horizontalOffset, backgroundColor) {
                var messages = [];
                for (var i = 0; i < count; i++) {
                    messages.push({
                        'rotation-y': 0,
                        'content': 'Node '+ i,
                        'background-color' : backgroundColor
                    });
                }
                return messages;
            },
            'rotation-z': function($index, count) {
                return (Math.PI * 2)/count * $index;
            },
            'position': function($index, horizontalOffset, verticalOffset) {
                return [horizontalOffset, 250 * $index + verticalOffset];
            },
            'button-position': function($index, horizontalOffset, verticalOffset) {
                return [0, 250 * $index + verticalOffset];
            },
            origin: [0.5, 0.5]
        }
    },
    events: {
        '$public': {
            'count' : function($state, $payload){
                $state.set('count', $payload);
            },
            'horizontal-offset' : function($state, $payload){
                $state.set('horizontalOffset', $payload);
            },
            'vertical-offset' : function($state, $payload){
                $state.set('verticalOffset', $payload);
            },
            'background-color' : function($state, $payload) {
                $state.set('backgroundColor', $payload);
            }
        }
    },
    states: {
        count: 10,
        horizontalOffset: 150,
        verticalOffset: 150,
        backgroundColor : 'whitesmoke'
    }
});

BEST.register('arkady.pevzner:dispatcher-test', {
    tree: '' +
        '<arkady.pevzner:square class="square">'+
        '</arkady.pevzner:square>',

    behaviors: {
        '.square' : {
        }
    },
    events: {
        '$public': {
        },
        '.square' : {
            'custom-event' : function($state, $payload) {
                console.log($payload)
            }
        }
    },
    states: {
    }
});
