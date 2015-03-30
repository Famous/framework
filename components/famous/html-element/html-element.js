BEST.component('famous:html-element', {
    behaviors: {
        '$self': {
            '$yield': true,
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
            },
            '$self:locals': function(locals) {
                return locals;
            }
        }
    },
    events: {
        public: {
            '$yield': function(state, message) {
                var content = '';
                var surrogates = message.surrogateRoot.childNodes;
                for (var i = 0; i < surrogates.length; i++) {
                    var outerHTML = surrogates[i].outerHTML;
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
                    var style = state.get('style') || {};
                    style['-moz-user-select'] = '-moz-none';
                    style['-khtml-user-select'] = 'none';
                    style['-webkit-user-select'] = 'none';
                    style['-o-user-select'] = 'none';
                    style['user-select'] = 'none';
                    state.set('style', style);
                }
            },
            'backface-visible': function(state, message) {
                var style = state.get('style') || {};
                style['-webkit-backface-visibility'] = (message) ? 'visible' : 'hidden';
                style['backface-visibility'] = (message) ? 'visible' : 'hidden';
                state.set('style', style);
            },
            'box-shadow': function(state, message) {
                var style = state.get('style') || {};
                style['-webkit-box-shadow'] = message;
                style['-moz-box-shadow'] = message;
                style['box-shadow'] = message;
                state.set('style', style);

            },
            'true-size': function(state, message) {
                state.set('trueSize', !!message);
            },
            'template': function(state, locals) {
                state.set('locals', locals);
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
            },
            'locals': function($mustache, $state, $payload) {
                if ($state.get('didTemplate')) {
                    var initialContent = $state.get('initialContent');
                }
                else {
                    var initialContent = $state.get('content');
                    $state.set('initialContent', initialContent);
                    $state.set('didTemplate', true);
                }
                var templatedContent = $mustache(initialContent, $payload);
                $state.set('content', templatedContent);
            }
        }
    },
    states: {
        'id': null,
        'content': '',
        'style': {},
        'attributes': {},
        'locals': {},
        'didTemplate': false,
        'initialContent': ''
    }
});
