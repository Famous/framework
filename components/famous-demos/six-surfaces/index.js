BEST.component('famous-demos:six-surfaces', {
    tree: 'six-surfaces.html',
    behaviors: {
        '.square': {
            'size': function(size, $time) {
                var chg = (Math.sin($time / 1000) / 2) + 1;
                return [chg * size, chg * size];
            },
            'rotation-z': function($time) {
                return $time / 1000;
            },
            'origin': [0.5, 0.5],
            'position': function() {
                var wih = window.innerHeight * 0.75;
                var wiw = window.innerWidth * 0.75;
                var px = Math.floor(Math.random() * wiw);
                var py = Math.floor(Math.random() * wih);
                return [px, py];
            }
        },
        '.surface': {
            'style': function() {
                var hue = Math.floor(Math.random() * 240) + 140;
                return {
                    'color': 'white',
                    'text-align': 'center',
                    'font-family': 'Helvetica',
                    'font-weight': 'bold',
                    'background-color': 'hsla(' + hue + ', 80%, 60%, 0.8)',
                    'border': '1px solid black'
                };
            }
        }
    },
    states: {
        size: 130
    }
});
