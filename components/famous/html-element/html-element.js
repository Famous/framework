BEST.component('famous:html-element', {
    behaviors: {
        '$self': {
            '$self:id': function(id) {
                return id;
            },
            '$self:content': function(content) {
                return content;
            },
            '$self:style': function(style) {
                return style;
            },
            '$self:attributes': function(attributes) {
                return attributes;
            },
            '$self:true-size': function(trueSize) {
                return trueSize;
            }
        }
    },
    events: {
        public: {
            '$yield': function(state, message) {
                var content = '';
                for (var i = 0; i < message.length; i++) {
                    var outerHTML = message[i].outerHTML;
                    content += (outerHTML) ? outerHTML : '';
                }
                state.set('content', content);
            },
            'id': function(state, message) {
                state.set('id', message);
            },
            'content': function(state, message) {
                state.set('content', message);
            },
            'style': function(state, message) {
                state.set('style', message);
            },
            'attributes': function(state, message) {
                state.set('attributes', message);
            },
            'unselectable': function(state, message) {
                if (message) {
                    state.set('style', {
                        '-moz-user-select': '-moz-none',
                        '-khtml-user-select': 'none',
                        '-webkit-user-select': 'none',
                        '-o-user-select': 'none',
                        'user-select': 'none'
                    });
                }
            },
            'backface-visible': function(state, message) {
                var style = {
                    '-webkit-backface-visibility': (message) ? 'visible' : 'hidden',
                    'backface-visibility': (message) ? 'visible' : 'hidden'
                };
                state.set('style', style);
            },
            'true-size': function(state, message) {
                state.set('trueSize', true);
            }
        },
        handlers: {
            'id': function($HTMLElement, $payload) {
                $HTMLElement.id($payload);
            },
            'content': function($HTMLElement, $payload) {
                $HTMLElement.content($payload);
            },
            'style': function($HTMLElement, $payload) {
                for (var styleName in $payload) {
                    $HTMLElement.property(styleName, $payload[styleName]);
                }
            },
            'attributes': function($HTMLElement, $payload) {
                for (var attributeName in $payload) {
                    $HTMLElement.attribute(attributeName, $payload[attributeName]);
                }
            },
            'true-size': function($HTMLElement, $payload) {
                $HTMLElement.trueSize(!!$payload, !!$payload);
            }
        }
    },
    states: {
        'id': null,
        'content': '',
        'style': {},
        'attributes': {}
    }
});
