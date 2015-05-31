BEST.module('imtiaz.majeed:timeline:example', {
    behaviors: {
        '#circle-container': {
            'size': function(size) {
                return size;
            }, 
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#circle': {
            'style': function(borderSize, borderRadius) {
                return {
                    'background-color': 'whitesmoke',
                    'border': borderSize + 'px solid grey',
                    'text-align': 'center',
                    'line-height': '10',
                    'border-radius': borderRadius + '%',
                    'cursor': 'pointer',
                }
            },
            'unselectable': true
        },
        '#play-container': {
            'size': [100, 25],
            'position': [-100, 250],
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#play-button': {
            'style': function(buttonStyle) {
                return buttonStyle;
            },
            'unselectable': true
        },
        '#pause-container': {
            'size': [100, 25],
            'position': [0, 250],
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#pause-button': {
            'style': function(buttonStyle) {
                return buttonStyle;
            },
            'unselectable': true
        },
        '#rewind-container': {
            'size': [100, 25],
            'position': [100, 250],
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#rewind-button': {
            'style': function(buttonStyle) {
                return buttonStyle;
            },
            'unselectable': true
        },
    },
    events: {
        '#play-button': {
            'famous:events:click': function($timelines, $state) {
                $timelines
                    .get('bouncySize').start()
                    .get('bouncyThickness').start();
            }
        },
        '#pause-button': {
            'famous:events:click': function($timelines) {
                if ($timelines.get('bouncySize').isPaused()) {
                    $timelines
                        .get('bouncySize').resume()
                        .get('bouncyThickness').resume();
                } else {
                    $timelines
                        .get('bouncySize').halt()
                        .get('bouncyThickness').halt();
                }
            }
        },
        '#rewind-button': {
            'famous:events:click': function($timelines) {
                $timelines
                    .get('bouncySize').rewind()
                    .get('bouncyThickness').rewind();
            }
        }
    },
    states: {
        size: [200, 200],
        borderRadius: 50,
        borderSize: 1,
        buttonStyle: {
            'background-color': '#666',
            'color': 'white',
            'font-size': '20px',
            'font-weight': 'bold',
            'line-height': '1.2',
            'text-align': 'center',
            'cursor': 'pointer'
        }
    },
    tree: 'example.html',
})
.config({
    imports: {}
})
.timelines({
    'bouncyBorder': {
        auto: true,
        duration: 1000,
        flexframes: {
            0:      { 'borderRadius': [50,  {curve: 'easeInOut'}] },
            '50%':  { 'borderRadius': [10,  {curve: 'easeInOut'}] },
            1000:   { 'borderRadius': [50]  }
        }
    },
    'bouncySize': {
        auto: true,
        duration: 1000,
        speed: 0.5,
        flexframes: {
            0:      { 'size': [[200, 200],  {curve: 'outBounce'}] },
            '50%':  { 'size': [[100, 100],  {curve: 'outBounce'}] },
            '110%':   { 'size': [[200, 200]]  }
        }
    },
    'bouncyThickness': {
        auto: true,
        duration: 1000,
        repeat: 2,
        flexframes: {
            0:      { 'borderSize': [1,     {curve: 'easeInOut'}] },
            '50%':  { 'borderSize': [50,    {curve: 'easeInOut'}] },
            1000:   { 'borderSize': [1]     }
        }
    }
});