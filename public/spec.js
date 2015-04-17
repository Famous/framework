BEST.register('famous:core:components', {
    events: {
        '$public': {
            'align': function($align, $payload) { $align.set($payload[0], $payload[1], $payload[2] || 0); },
            'align-x': function($align, $payload) { $align.setX($payload); },
            'align-y': function($align, $payload) { $align.setY($payload); },
            'align-z': function($align, $payload) { $align.setZ($payload); },
            'camera': function($camera, $payload) { $camera.set($payload[0], $payload[1]); },
            'mount-point': function($mountPoint, $payload) { $mountPoint.set($payload[0], $payload[1], $payload[2] || 0); },
            'mount-point-x': function($mountPoint, $payload) { $mountPoint.setX($payload); },
            'mount-point-y': function($mountPoint, $payload) { $mountPoint.setY($payload); },
            'mount-point-z': function($mountPoint, $payload) { $mountPoint.setZ($payload); },
            'opacity': function($opacity, $payload) { $opacity.set($payload); },
            'origin': function($origin, $payload) { $origin.set($payload[0], $payload[1], $payload[2] || 0); },
            'origin-x': function($origin, $payload) { $origin.setX($payload); },
            'origin-y': function($origin, $payload) { $origin.setY($payload); },
            'origin-z': function($origin, $payload) { $origin.setZ($payload); },
            'position': function($position, $payload) { $position.set($payload[0], $payload[1], $payload[2] || 0); },
            'position-x': function($position, $payload) { $position.setX($payload); },
            'position-y': function($position, $payload) { $position.setY($payload); },
            'position-z': function($position, $payload) { $position.setZ($payload); },
            'offset-position': function($position, $payload) {
                var currentPos = $position.getState();
                $position.set(
                    currentPos.x + $payload[0] || 0,
                    currentPos.y + $payload[1] || 0,
                    currentPos.z + $payload[2] || 0
                );
            },
            'rotation': function($rotation, $payload) { $rotation.set($payload[0], $payload[1], $payload[2] || 0); },
            'rotation-x': function($rotation, $payload) { $rotation.setX($payload); },
            'rotation-y': function($rotation, $payload) { $rotation.setY($payload); },
            'rotation-z': function($rotation, $payload) { $rotation.setZ($payload); },
            'scale': function($scale, $payload) { $scale.set($payload[0], $payload[1], $payload[2] || 1); },
            'scale-x': function($scale, $payload) { $scale.setX($payload); },
            'scale-y': function($scale, $payload) { $scale.setY($payload); },
            'scale-z': function($scale, $payload) { $scale.setZ($payload); },
            'size-absolute': function($size, $payload) {
                $size.setMode(1, 1, 1);
                $size.setAbsolute($payload[0], $payload[1], $payload[2]);
            },
            'size-proportional': function($size, $payload) { $size.setProportional($payload[0], $payload[1], $payload[2]); },
            'size-differential': function($size, $payload) { $size.setDifferential($payload[0], $payload[1], $payload[2]); }
        }
    }
});

BEST.register('famous:core:dom-element', {
    behaviors: {
        '$self': {
            '$yield': true,
            '$self:assign-id': function(id) { return id; },
            '$self:assign-content': function(content) { return content; },
            '$self:assign-style': function(style) { return style; },
            '$self:assign-attributes': function(attributes) { return attributes; },
            '$self:assign-locals': function(locals) { return locals; }
        }
    },
    events: {
        '$public': {
            '$yield': function($state, $payload) {
                var content = '';
                var surrogates = $payload.surrogateRoot.childNodes;
                for (var i = 0; i < surrogates.length; i++) {
                    var outerHTML = surrogates[i].outerHTML;
                    content += (outerHTML) ? outerHTML : '';
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
                var templatedContent = $mustache(initialContent, $payload);
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

BEST.register('famous:core:view', {
    behaviors: {
        '$self': {
            '$yield' : true,
            'famous:core:components:align': function(align) { return align; },
            'famous:core:components:align-x': function(alignX) { return alignX; },
            'famous:core:components:align-y': function(alignY) { return alignY; },
            'famous:core:components:align-z': function(alignZ) { return alignZ; },
            'famous:core:components:mount-point': function(mountPoint) { return mountPoint; },
            'famous:core:components:mount-point-x': function(mountPointX) { return mountPointX; },
            'famous:core:components:mount-point-y': function(mountPointY) { return mountPointY; },
            'famous:core:components:mount-point-z': function(mountPointZ) { return mountPointZ; },
            'famous:core:components:opacity': function(opacity) { return opacity; },
            'famous:core:components:origin': function(origin) { return origin; },
            'famous:core:components:origin-x': function(originX) { return originX; },
            'famous:core:components:origin-y': function(originY) { return originY; },
            'famous:core:components:origin-z': function(originZ) { return originZ; },
            'famous:core:components:position': function(position) { return position; },
            'famous:core:components:position-x': function(positionX) { return positionX; },
            'famous:core:components:position-y': function(positionY) { return positionY; },
            'famous:core:components:position-z': function(positionZ) { return positionZ; },
            'famous:core:components:offset-position': function(offsetPosition) { return offsetPosition; },
            'famous:core:components:rotation': function(rotation) { return rotation; },
            'famous:core:components:rotation-x': function(rotationX) { return rotationX; },
            'famous:core:components:rotation-y': function(rotationY) { return rotationY; },
            'famous:core:components:rotation-z': function(rotationZ) { return rotationZ; },
            'famous:core:components:scale': function(scale) { return scale; },
            'famous:core:components:scale-x': function(scaleX) { return scaleX; },
            'famous:core:components:scale-y': function(scaleY) { return scaleY; },
            'famous:core:components:scale-z': function(scaleZ) { return scaleZ; },
            'famous:core:components:size-absolute': function(sizeAbsolute) { return sizeAbsolute; },
            'famous:core:components:size-proportional': function(sizeProportional) { return sizeProportional; },
            'famous:core:components:size-differential': function(sizeDifferential) { return sizeDifferential; }
        }
    },
    events: {
        '$public': {
            'align': function($state, $payload) { $state.set('align', $payload); },
            'align-x': function($state, $payload) { $state.set('alignX', $payload); },
            'align-y': function($state, $payload) { $state.set('alignY', $payload); },
            'align-z': function($state, $payload) { $state.set('alignZ', $payload); },
            'mount-point': function($state, $payload) { $state.set('mount-point', $payload); },
            'mount-point-x': function($state, $payload) { $state.set('mountPointX', $payload); },
            'mount-point-y': function($state, $payload) { $state.set('mountPointY', $payload); },
            'mount-point-z': function($state, $payload) { $state.set('mountPointZ', $payload); },
            'opacity': function($state, $payload) { $state.set('opacity', $payload); },
            'origin': function($state, $payload) { $state.set('origin', $payload); },
            'origin-x': function($state, $payload) { $state.set('originX', $payload); },
            'origin-y': function($state, $payload) { $state.set('originY', $payload); },
            'origin-z': function($state, $payload) { $state.set('originZ', $payload); },
            'position': function($state, $payload) { $state.set('position', $payload); },
            'position-x': function($state, $payload) { $state.set('positionX', $payload); },
            'position-y': function($state, $payload) { $state.set('positionY', $payload); },
            'position-z': function($state, $payload) { $state.set('positionZ', $payload); },
            'offset-position' : function($state, $payload) { $state.set('offsetPosition', $payload); },
            'rotation': function($state, $payload) { $state.set('rotation', $payload); },
            'rotation-x': function($state, $payload) { $state.set('rotationX', $payload); },
            'rotation-y': function($state, $payload) { $state.set('rotationY', $payload); },
            'rotation-z': function($state, $payload) { $state.set('rotationZ', $payload); },
            'scale': function($state, $payload) { $state.set('scale', $payload); },
            'scale-x': function($state, $payload) { $state.set('scaleX', $payload); },
            'scale-y': function($state, $payload) { $state.set('scaleY', $payload); },
            'scale-z': function($state, $payload) { $state.set('scaleZ', $payload); },
            'size': function($state, $payload) { $state.set('sizeAbsolute', $payload); },
            'size-absolute': function($state, $payload) { $state.set('sizeAbsolute', $payload); },
            'size-proportional': function($state, $payload) { $state.set('sizeProportional', $payload); },
            'size-differential': function($state, $payload) { $state.set('sizeDifferential', $payload); },
            'overflow' : function($DOMElement, $payload) { $DOMElement.setProperty('overflow', $payload); }
        }
    }
});

BEST.register('famous:events', {
    events: {
        '$public': {
            '$miss': function($DOMElement, $node, $payload) {
                var proxy = $payload.proxy;
                var selector = $payload.selector;
                var listener = $payload.listener;
                $node.famousNode.addUIEvent(proxy);
                $DOMElement.on(proxy, function(event) {
                    listener('famous:events:' + proxy, event, selector);
                });
            }
        }
    }
});

BEST.register('famous:examples:clickable-square', {
    tree: '' +
        '<famous:core:view id="context">' +
        '  <famous:core:dom-element id="surface">' +
        '      <h1>{{ count }}</h1>' +
        '  </famous:core:dom-element>' +
        '</famous:core:view>',
    behaviors: {
        '#context': { 'size': [200, 200] },
        '#surface': {
            'template': function(count) { return { count: count }; },
            'style': {
                'background-color': 'gray',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#surface': {
            'famous:events:click': function($state) {
                $state.set('count', $state.get('count') + 1);
            }
        }
    },
    states: { count: 0 }
});

BEST.execute('famous:examples:clickable-square', 'body');
