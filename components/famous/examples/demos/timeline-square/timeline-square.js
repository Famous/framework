BEST.component('famous:examples:demos:timeline-square', {
    tree: 'timeline-square.html',
    behaviors: {
        '#view': {
            'size': [300, 300],
            'position': function(time, _timeline) {
                return _timeline([
                    [0, [0, 0], 'linear'],
                    [750, [400, 300], 'outExpo'],
                    [1300, [100, 200], 'outBounce'],
                    [2000, [0, 0]]
                ])(time)
            },
            'rotation-z' : function(time, _timeline) {
                return _timeline([
                    [0, 0, 'inExpo'],
                    [1000, Math.PI, 'outExpo'],
                    [2000, Math.PI * 2]
                ])(time);
            },
            'scale' : function(time, _timeline) {
                return _timeline([
                    [0, [1, 1]],
                    [1000, [2, 2]],
                    [2000, [1, 1]]
                ])(time);
            },
            origin: [0.5, 0.5]
        },
        '#element': {
            'style': {
                'background-color' : 'gray',
                'font-size' : '30px',
                'line-height': '300px',
                'color': 'white',
                'text-align': 'center'
            }
        },
        '$self': {
            '$self:start' : function(start) {
                return true;
            }
        }
    },
    events: {
        public: {
        },
        handlers: {
            'start' : function($state, $payload) {
                $state.set('time', 2000, {duration: 2000});
            }
        }
    },
    states: {
        time: 0,
        start: false
    }
});
