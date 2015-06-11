FamousFramework.module('famous:core:dom-element', {
    behaviors: {
        '$self': {
            '$yield': true,
            'assign-id': function(id) { return id; },
            'assign-content': function(content) { return content; },
            'assign-style': function(style) { return style; },
            'assign-attributes': function(attributes) { return attributes; },
            'assign-locals': function(locals) { return locals; }
        }
    },
    events: {
        '$public': {
            '$yield': function($state, $payload) {
                var content = '';
                if ($payload && $payload.surrogateRoot) {
                    var surrogates = $payload.surrogateRoot.childNodes;
                    for (var i = 0; i < surrogates.length; i++) {
                        var outerHTML = surrogates[i].outerHTML;
                        content += (outerHTML) ? outerHTML : '';
                    }
                }
                $state.set('content', content);
            },
            'id': function($state, $payload) { $state.set('id', $payload); },
            'content': function($state, $payload) { $state.set('content', $payload); },
            'style': function($state, $payload) { $state.set('style', $payload); },
            'attributes': function($state, $payload) { $state.set('attributes', $payload); },
            'unselectable': function($state, $payload) {
                if ($payload) {
                    var style = $state.get('style') || {};
                    style['-moz-user-select'] = '-moz-none';
                    style['-khtml-user-select'] = 'none';
                    style['-webkit-user-select'] = 'none';
                    style['-o-user-select'] = 'none';
                    style['user-select'] = 'none';
                    $state.set('style', style);
                }
            },
            'backface-visible': function($state, $payload) {
                var style = $state.get('style') || {};
                style['-webkit-backface-visibility'] = ($payload) ? 'visible' : 'hidden';
                style['backface-visibility'] = ($payload) ? 'visible' : 'hidden';
                $state.set('style', style);
            },
            'box-shadow': function($state, $payload) {
                var style = $state.get('style') || {};
                style['-webkit-box-shadow'] = $payload;
                style['-moz-box-shadow'] = $payload;
                style['box-shadow'] = $payload;
                $state.set('style', style);
            },
            'template': function($state, $payload) { $state.set('locals', $payload); },
        },
        '$private': {
            'assign-id': function($DOMElement, $payload) { $DOMElement.setId($payload); },
            'assign-content': function($DOMElement, $payload) { $DOMElement.setContent($payload); },
            'assign-style': function($DOMElement, $payload) {
                for (var styleName in $payload) {
                    $DOMElement.setProperty(styleName, $payload[styleName]);
                }
            },
            'assign-attributes': function($DOMElement, $payload) {
                for (var attributeName in $payload) {
                    $DOMElement.setAttribute(attributeName, $payload[attributeName]);
                }
            },
            'assign-locals': function($mustache, $state, $payload) {
                if ($state.get('didTemplate')) {
                    var initialContent = $state.get('initialContent');
                }
                else {
                    var initialContent = $state.get('content');
                    $state.set('initialContent', initialContent);
                    $state.set('didTemplate', true);
                }
                var templatedContent = $mustache(initialContent+'', $payload);
                $state.set('content', templatedContent);
            }
        }
    },
    states: {
        'locals': {},
        'didTemplate': false,
        'initialContent': ''
    }
});
