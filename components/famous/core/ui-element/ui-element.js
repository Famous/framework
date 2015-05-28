BEST.module('famous:core:ui-element', 'HEAD', {
    behaviors: {
        '$self' : {
            '$yield': true,
            'assign-id': '[[identity|id]]',
            'assign-content': '[[identity|content]]',
            'assign-style': '[[identity|style]]',
            'assign-attributes': '[[identity|attributes]]',
            'assign-locals': '[[identity|locals]]',
            'famous:core:components:align': '[[identity|align]]',
            'famous:core:components:align-x': '[[identity|alignX]]',
            'famous:core:components:align-y': '[[identity|alignY]]',
            'famous:core:components:align-z': '[[identity|alignZ]]',
            'famous:core:components:mount-point': '[[identity|mountPoint]]',
            'famous:core:components:mount-point-x': '[[identity|mountPointX]]',
            'famous:core:components:mount-point-y': '[[identity|mountPointY]]',
            'famous:core:components:mount-point-z': '[[identity|mountPointZ]]',
            'famous:core:components:opacity': '[[identity|opacity]]',
            'famous:core:components:origin': '[[identity|origin]]',
            'famous:core:components:origin-x': '[[identity|originX]]',
            'famous:core:components:origin-y': '[[identity|originY]]',
            'famous:core:components:origin-z': '[[identity|originZ]]',
            'famous:core:components:position': '[[identity|position]]',
            'famous:core:components:position-x': '[[identity|positionX]]',
            'famous:core:components:position-y': '[[identity|positionY]]',
            'famous:core:components:position-z': '[[identity|positionZ]]',
            'famous:core:components:offset-position': '[[identity|offsetPosition]]',
            'famous:core:components:rotation': '[[identity|rotation]]',
            'famous:core:components:rotation-x': '[[identity|rotationX]]',
            'famous:core:components:rotation-y': '[[identity|rotationY]]',
            'famous:core:components:rotation-z': '[[identity|rotationZ]]',
            'famous:core:components:scale': '[[identity|scale]]',
            'famous:core:components:scale-x': '[[identity|scaleX]]',
            'famous:core:components:scale-y': '[[identity|scaleY]]',
            'famous:core:components:scale-z': '[[identity|scaleZ]]',
            'famous:core:components:size-absolute': '[[identity|sizeAbsolute]]',
            'famous:core:components:size-absolute-x': '[[identity|sizeAbsoluteX]]',
            'famous:core:components:size-absolute-y': '[[identity|sizeAbsoluteY]]',
            'famous:core:components:size-absolute-z': '[[identity|sizeAbsoluteZ]]',
            'famous:core:components:size-proportional': '[[identity|sizeProportional]]',
            'famous:core:components:size-proportional-x': '[[identity|sizeProportionalX]]',
            'famous:core:components:size-proportional-y': '[[identity|sizeProportionalY]]',
            'famous:core:components:size-proportional-z': '[[identity|sizeProportionalZ]]',
            'famous:core:components:size-differential': '[[identity|sizeDifferential]]',
            'famous:core:components:size-differential-x': '[[identity|sizeDifferentialX]]',
            'famous:core:components:size-differential-y': '[[identity|sizeDifferentialY]]',
            'famous:core:components:size-differential-z': '[[identity|sizeDifferentialZ]]'
        }
    },
    events: {
        '$public': {
            // events from view
            'align': 'setter',
            'align-x': 'setter|camel',
            'align-y': 'setter|camel',
            'align-z': 'setter|camel',
            'border' : function($DOMElement, $payload) { $DOMElement.setProperty('border', $payload); },
            'mount-point': 'setter|camel',
            'mount-point-x': 'setter|camel',
            'mount-point-y': 'setter|camel',
            'mount-point-z': 'setter|camel',
            'opacity': 'setter',
            'origin': 'setter',
            'origin-x': 'setter|camel',
            'origin-y': 'setter|camel',
            'origin-z': 'setter|camel',
            'position': 'setter',
            'position-x': 'setter|camel',
            'position-y': 'setter|camel',
            'position-z': 'setter|camel',
            'offset-position' : 'setter|camel',
            'overflow' : function($DOMElement, $payload) { $DOMElement.setProperty('overflow', $payload); },
            'rotation': 'setter',
            'rotation-x': 'setter|camel',
            'rotation-y': 'setter|camel',
            'rotation-z': 'setter|camel',
            'scale': 'setter',
            'scale-x': 'setter|camel',
            'scale-y': 'setter|camel',
            'scale-z': 'setter|camel',
            'size': function($state, $payload){ $state.set('sizeAbsolute', $payload); },
            'size-absolute': 'setter|camel',
            'size-absolute-x': 'setter|camel',
            'size-absolute-y': 'setter|camel',
            'size-absolute-z': 'setter|camel',
            'size-proportional': 'setter|camel',
            'size-proportional-x': 'setter|camel',
            'size-proportional-y': 'setter|camel',
            'size-proportional-z': 'setter|camel',
            'size-differential': 'setter|camel',
            'size-differential-x': 'setter|camel',
            'size-differential-y': 'setter|camel',
            'size-differential-z': 'setter|camel',

            // events from dom-element
            'attributes': 'setter',
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
            'content': 'setter',
            'id': 'setter',
            'style': 'setter',
            'template': function($state, $payload) { $state.set('locals', $payload); },
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
            '$yield': function($state, $payload) {
                var content = '';
                var surrogates = $payload.surrogateRoot.childNodes;
                for (var i = 0; i < surrogates.length; i++) {
                    var outerHTML = surrogates[i].outerHTML;
                    content += (outerHTML) ? outerHTML : '';
                }
                $state.set('content', content);
            }
        },
        '$private' : {
            'assign-id': function($DOMElement, $payload) { $DOMElement.setId($payload); },
            'assign-content': function($DOMElement, $payload) {
                $DOMElement.setContent($payload);
            },
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
