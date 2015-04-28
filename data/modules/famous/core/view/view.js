BEST.module('famous:core:view', {
    behaviors: 'behaviors.js',
    events: {
        '$public': {
            'align': 'setter',
            'align-x': 'setter|camel',
            'align-y': 'setter|camel',
            'align-z': 'setter|camel',
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
            'rotation': 'setter',
            'rotation-x': 'setter|camel',
            'rotation-y': 'setter|camel',
            'rotation-z': 'setter|camel',
            'scale': 'setter',
            'scale-x': 'setter|camel',
            'scale-y': 'setter|camel',
            'scale-z': 'setter|camel',
            'size': function($state, $payload) {
                $state.set('sizeAbsolute', $payload);
            },
            'size-absolute': 'setter|camel',
            'size-proportional': 'setter|camel',
            'size-differential': 'setter|camel',
            'overflow' : function($DOMElement, $payload) {
                $DOMElement.setProperty('overflow', $payload);
            }
        }
    }
})
.config({})