function getScaleRatios(thumbSize, fullSize) {
    return {
        frontToBackScale: {
            front: [fullSize[0] / thumbSize[0], fullSize[1] / thumbSize[1]],
            back: [1, 1]
        },
        backToFrontScale: {
            front: [1, 1],
            back: [thumbSize[0] / fullSize[0], thumbSize[1] / fullSize[1]]
        }
    };
}

FamousFramework.component('famous-demos:lightbox:item', {
    behaviors: {
        '$camera': {
            'set-depth': 1500
        },
        '$self' : {
            'size': '[[identity|size]]',
            'position' : [300, 300]
        },
        '.item' : {
            'mount-point': [0, 0],
            'align': [0, 0],
            'origin': [0.5, 0.5],
            'style': {
                'backface-visibility': 'hidden'
            }
        },
        '#front' : {
            'rotation-y' : function(rotation) {
                return rotation;
            },
            'content': function(thumbImage) {
                return `<img src="${thumbImage}"/>`;
            },
            'scale': '[[identity|frontScale]]',
            'position': '[[identity|frontPosition]]',
            'size' : '[[identity|thumbSize]]'

        },
        '#back' : {
            'rotation-y' : function(rotation) {
                return rotation + Math.PI;
            },
            'position-z' : -5,
            'content': function(fullImage) {
                return `<img src="${fullImage}"/>`;
            },
            'scale': '[[identity|backScale]]',
            'position': '[[identity|backPosition]]',
            'size' : '[[identity|fullSize]]'
        }
    },
    events: {
        '$lifecycle' : {
            'post-load' : function($state) {
                var thumbSize = $state.get('thumbSize');
                var fullSize = $state.get('fullSize');

                $state.set('size', thumbSize.slice());
                $state.set(
                    'scaleRatios', 
                    getScaleRatios($state.get('thumbSize'), $state.get('fullSize'))
                );

                // Scale down and reposition the back image to match the size/position of
                // the initially displayed front image.
                $state.set('backScale', $state.get('scaleRatios').backToFrontScale.back.slice());
                $state.set(
                    'backPosition',
                    [(thumbSize[0] - fullSize[0])/2, (thumbSize[1] - fullSize[1])/2]
                );
            }
        },
        '#front' : {
            'tap' : function($state, $dispatcher) {
                $dispatcher.trigger('animate', {
                    direction: 'frontToBack',
                    rotation: Math.PI,
                    size: $state.get('fullSize'),
                    scale: $state.get('scaleRatios').frontToBackScale,
                });
            },
        },
        '#back' : {
            'tap' : function($state, $dispatcher) {
                $dispatcher.trigger('animate', {
                    direction: 'backToFront',
                    rotation: 0,
                    size: $state.get('thumbSize'),
                    scale: $state.get('scaleRatios').backToFrontScale
                });
            },
        },
        '$private' : {
            'animate' : function($state, $payload) {
                if (!$state.get('isAnimating')) {
                    // displaced due to scaling the node. Top-left corner needs to remain
                    // set so that the lightbox item can be properly positioned.
                    var thumbSize = $state.get('thumbSize');
                    var fullSize = $state.get('fullSize');
                    var frontPositionOffset = [0, 0];
                    var backPositionOffset = [0, 0];
                    if ($payload.direction === 'frontToBack') {
                        frontPositionOffset = [
                            (fullSize[0] - thumbSize[0])/2, (fullSize[1] - thumbSize[1])/2
                        ];
                    }
                    else {
                        backPositionOffset = [
                            (thumbSize[0] - fullSize[0])/2, (thumbSize[1] - fullSize[1])/2
                        ];
                    }

                    $state.set('isAnimating', true);
                    var transition = $state.get('transition');
                    $state.set('rotation', $payload.rotation, transition);
                    $state.set('frontScale', $payload.scale.front.slice(), transition);
                    $state.set('frontPosition', frontPositionOffset, transition);
                    $state.set('backScale', $payload.scale.back.slice(), transition);
                    $state.set('backPosition', backPositionOffset, transition);
                    $state.set('size', $payload.size, transition)
                        .thenSet('isAnimating', false);
                }
            }
        }
    },
    states: {
        thumbImage: 'http://www.timjchin.com/apps/lightbox/data/caprichos/Museo_del_Prado_-_Goya_-_Caprichos_-_No._01_-_Autorretrato._Francisco_Goya_y_Lucientes2C_pintor_thumb.jpg',
        fullImage: 'http://www.timjchin.com/apps/lightbox/data/caprichos/Museo_del_Prado_-_Goya_-_Caprichos_-_No._01_-_Autorretrato._Francisco_Goya_y_Lucientes2C_pintor.jpg',

        thumbSize: [300, 300],
        fullSize: [564, 800],

        frontScale: [1, 1],
        backScale: [1, 1],

        frontPosition: [0, 0],
        backPosition: [0, 0],

        rotation: 0,
        transition: {duration: 1200, curve: 'inOutBack'},
        isAnimating: false,
    },
    tree: `
        <node class='item' id='front'></node>
        <node class='item' id='back'></node>
    `
});