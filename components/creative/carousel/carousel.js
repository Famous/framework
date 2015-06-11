// let layouts = require('./config/layouts');
let layouts = [[{size:3,startPos:[0,0]},{size:2,startPos:[3,0]},{size:1,startPos:[3,2]},{size:1,startPos:[0,3]},{size:1,startPos:[1,3]},{size:1,startPos:[2,3]},{size:2,startPos:[3,3]}],[{size:3,startPos:[0,0]},{size:2,startPos:[3,1]},{size:1,startPos:[3,0]},{size:1,startPos:[0,3]},{size:1,startPos:[3,3]},{size:1,startPos:[3,4]},{size:2,startPos:[1,3]}],[{size:3,startPos:[2,0]},{size:2,startPos:[0,1]},{size:1,startPos:[0,3]},{size:1,startPos:[0,4]},{size:1,startPos:[3,3]},{size:1,startPos:[4,3]},{size:2,startPos:[1,3]}]];

FamousFramework.module('creative:carousel', {
    behaviors: {
        '#app': {
        },

        '.container': {

        },

        '.element': {
            '$repeat': function (layouts, paddingSize, gridSize, depthDistance) {

                let layout = layouts[0];
                let result = [];

                for (let l = 0; l < layouts.length; l++) {
                    for (let i = 0; i < layouts[l].length; i++) {
                        result.push({
                            'align': [layouts[l][i].startPos[0] / gridSize[0], layouts[l][i].startPos[1] / gridSize[1]],
                            'size-proportional': [layouts[l][i].size / gridSize[0], layouts[l][i].size / gridSize[1]],
                            'size-differential': [-paddingSize, -paddingSize],
                        });
                    }
                }

                return result;
            },
            'position': function($index, depthDistance, offset) {
                return  [0, 0, ~~($index/7) * -depthDistance + offset];
            },
            style: function($index) {
                return {
                    'background-size': 'cover',
                    'background-position': '50% 50%',
                    'background-image': 'url({{@CDN_PATH}}images/' + $index + '.jpg)'
                }
            }
        },
    },

    events: {
        // '$lifecycle': {
        //     'post-load': function() {
        //         console.log('test')
        //     }
        // },
        '#app': {
            'click': function($state) {
                $state.set('offset', $state.get('offset') + $state.get('depthDistance'), {duration: 500});
            }
        }
    },

    states: {
        offset: 0,
        layouts: layouts,
        gridSize: [5, 5],
        paddingSize: 10,
        depthDistance: 1500
    },

    tree: 'carousel.html'


})


.config({
    includes: ['carousel.css'],
    // imports: {
    //     'creative:carousel' : ['carousel-item']
    // }
});


// document.addEventListener('keydown', function(e) {
//     console.log('yolo'); // keyevents only seem to work when adding them straight to the window
// });
