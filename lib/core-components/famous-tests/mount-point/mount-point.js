FamousFramework.module('famous-tests:mount-point', {
    behaviors: {
        '$self' : {
            start: true
        },
        '#mount-point' : {
            size: [200, 50],
            position : [100, -50],
            content: function(mountPoint) {
                return 'Mount point: [' +  mountPoint + ']';
            }
        },
        '#origin' : {
            size: [200, 50],
            position : [300, -50],
            content: function(origin) {
                return 'Origin: [' +  origin + ']';
            }
        },
        '#container' : {
            'size': [500, 500],
            'position': [100, 100]
        },
        '#border' : {
            'style' : {
                'border' : '1px solid black'
            }
        },
        '.block' : {
            style: {
                'background-color' : 'black',
                'opacity' : 0.8,
                'color' : 'white'
            },
            size: [100, 100],
            'mount-point' : function(mountPoint) {
                return mountPoint;
            },
            'origin' : function(origin) {
                return origin;
            },
            'rotation-z' : function(rotateZ) {
                return rotateZ;
            }
        },

        '#top-left' : {
            'align' : [0, 0]
        },
        '#top-mid' : {
            'align' : [0.5, 0]
        },
        '#top-right' : {
            'align' : [1, 0]
        },


        '#mid-left' : {
            'align' : [0, 0.5]
        },
        '#mid-mid' : {
            'align' : [0.5, 0.5]
        },
        '#mid-right' : {
            'align' : [1, 0.5]
        },
        

        '#bottom-left' : {
            'align' : [0, 1]
        },
        '#bottom-mid' : {
            'align' : [0.5, 1]
        },
        '#bottom-right' : {
            'align' : [1, 1]
        },
    },
    events: {
        '$private' : {
            'start' : function($state) {
                $state.set('rotateZ', Math.PI * 4, {duration: 10000});
            }
        }
    },
    states: {
        mountPoint: [0.5, 0.5],
        origin: [0, 0],
        rotateZ: 0
    },
    tree: 'mount-point.html',
});
