BEST.scene('imtiaz.majeed:dom-skyscraper:side', {
    behaviors: {
        '#tile': {
            '$repeat': function() {
                var messages = [];
                for (var i = 0; i < 9; i++) {
                    messages.push({ i: i });
                }
                return messages;
            },
            'size': [100, 100],
            'position': function($index) {
                var id = $index % 9;
                var x = (id % 3) * 110;
                var y = ~~(id / 3) * 110;
                return [x, y, 0];
            },
            'style': function() {
                return { 'background': '#000' }
            }
        }
    },
    events: {},
    states: {},
    tree: 'side.html'
});