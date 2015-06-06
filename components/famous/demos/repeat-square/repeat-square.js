BEST.module('famous:demos:repeat-square', {
    tree: 'repeat-square.html',
    behaviors: {
        '.square': {
            '$repeat' : function(count) {
                count = count || 1;
                var colors = ['red', 'honeydew', 'lavenderblush', 'olivedrab', 'peru'];
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        'change-color' : colors[i % colors.length],
                        'position': [50, 100 + i * 250]
                    });
                };
                return result;
            },
            'change-color': function(_backgroundColor) {
                return _backgroundColor;
            }
        },
        '#root2': {
            'position': function() {
                return [300, 0, 0]
            }
        },
        '.label-view': {
            size: [100, 50]
        }
    },
    events: {
        '$public': {
            'update-count' : function($state, $payload) {
                $state.set('count', $payload);
            },
            'change-color': function($state, $payload) {
                $state.set('_backgroundColor', $payload);
            }
        }
    },
    states: {
        count: 5,
        _backgroundColor: 'red'
    }
})
.config({
    imports: {
        'famous:core': ['dom-element', 'view', 'ui-element'],
        'famous:demos': ['clickable-square']
    }
});;
