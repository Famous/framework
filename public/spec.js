BEST.register('famous:core:components', {
    events: {
        '$public': {
            'align': function($famousNode, $payload) { $famousNode.setAlign($payload[0], $payload[1], $payload[2]); },
            'align-x': function($famousNode, $payload) { $famousNode.setAlign($payload, null, null); },
            'align-y': function($famousNode, $payload) { $famousNode.setAlign(null, $payload, null); },
            'align-z': function($famousNode, $payload) { $famousNode.setAlign(null, null, $payload); },
            
            'camera': function($camera, $payload) { $camera.set($payload[0], $payload[1]); },

            'mount-point': function($famousNode, $payload) { $famousNode.setMountPoint($payload[0], $payload[1], $payload[2]); },
            'mount-point-x': function($famousNode, $payload) { $famousNode.setMountPoint($payload, null, null); },
            'mount-point-y': function($famousNode, $payload) { $famousNode.setMountPoint(null, $payload, null); },
            'mount-point-z': function($famousNode, $payload) { $famousNode.setMountPoint(null, null, $payload); },
            
            'opacity': function($famousNode, $payload) { $famousNode.setOpacity($payload); },
            
            'origin': function($famousNode, $payload) { $famousNode.setOrigin($payload[0], $payload[1], $payload[2]); },
            'origin-x': function($famousNode, $payload) { $famousNode.setOrigin($payload, null, null); },
            'origin-y': function($famousNode, $payload) { $famousNode.setOrigin(null, $payload, null); },
            'origin-z': function($famousNode, $payload) { $famousNode.setOrigin(null, null, $payload); },
            
            'position': function($famousNode, $payload) { $famousNode.setPosition($payload[0], $payload[1], $payload[2]); },
            'position-x': function($famousNode, $payload) { $famousNode.setPosition($payload, null, null); },
            'position-y': function($famousNode, $payload) { $famousNode.setPosition(null, $payload, null); },
            'position-z': function($famousNode, $payload) { $famousNode.setPosition(null, null, $payload); },
            
            'offset-position': function($famousNode, $payload) {
                var currentPos = $famousNode.getPosition();
                $famousNode.setPosition(
                    currentPos[0] + $payload[0] || 0,
                    currentPos[1] + $payload[1] || 0,
                    currentPos[2] + $payload[2] || 0
                );
            },

            'rotation': function($famousNode, $payload) { $famousNode.setRotation($payload[0], $payload[1], $payload[2], $payload[3]); },
            'rotation-x': function($famousNode, $payload) { $famousNode.setRotation($payload, null, null); },
            'rotation-y': function($famousNode, $payload) { $famousNode.setRotation(null, $payload, null); },
            'rotation-z': function($famousNode, $payload) { $famousNode.setRotation(null, null, $payload); },
            
            'scale': function($famousNode, $payload) { $famousNode.setScale($payload[0], $payload[1], $payload[2]); },
            'scale-x': function($famousNode, $payload) { $famousNode.setScale($payload, null, null); },
            'scale-y': function($famousNode, $payload) { $famousNode.setScale(null, $payload, null); },
            'scale-z': function($famousNode, $payload) { $famousNode.setScale(null, null, $payload); },
            
            'size-absolute': function($famousNode, $payload) {
                $famousNode.setSizeMode(1, 1, 1);
                $famousNode.setAbsoluteSize($payload[0], $payload[1], $payload[2]);
            },
            
            'size-proportional': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, 0, 0);
                $famousNode.setProportionalSize($payload[0], $payload[1], $payload[2]);
            },

            'size-differential': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, 0, 0);
                $famousNode.setDifferentialSize($payload[0], $payload[1], $payload[2]);
            }
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
            '$miss': function($DOMElement, $famousNode, $payload) {
                var eventName = $payload.eventName;
                var listener = $payload.listener;

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    listener(event);
                });
            }
        }
    }
});

BEST.register('famous:examples:clickable-square', {
    tree: '' +
        '<famous:core:view id="context">' +
        '  <famous:core:dom-element id="surface">' +
        '    <h1>{{ count }}</h1>' +
        '  </famous:core:dom-element>' +
        '</famous:core:view>',
    behaviors: {
        '#context': {
            'size': [200, 200],
            'position': function(offset) {
                return [offset, offset]
            }
        },
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
        '#context': {
            'famous:events:click': function($state, $payload) {
                $state.set('count', $state.get('count') + 1);
                console.log('Click event on context: ', $payload);
            }
        },
        '$public': {
            'hello' : function() {
                console.log('hello!');
            }
        }
    },
    states: {
        count: 0,
        offset: 0
    }
});

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



// COMPONENTS:
BEST.execute('arkady.pevzner:control-flow:test', 'body');
// BEST.execute('arkady.pevzner:square', 'body');
// BEST.execute('famous:examples:clickable-square', 'body');
// BEST.execute('arkady.pevzner:dispatcher-test', 'body');
