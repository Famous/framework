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
        '$self' : {
            'size': '[[identity|size]]'
        },
        '.lightbox-item' : {
            'mount-point': [0, 0],
            'align': [0, 0],
            'origin': [0.5, 0.5]
        },
        '#front' : {
            'rotation-y' : function(rotation) {
                return rotation;
            },
            'scale': '[[identity|frontScale]]',
            'position': '[[identity|frontPosition]]',
            'size' : '[[identity|thumbSize]]'
        },
        '#front-overlay' : {
            'style': {
                'border': '2px solid #93CFB5',
                // TODO --> add browser supported prefixes
                'background': 'radial-gradient(ellipse at center, rgba(0,0,0,0.47) 0%,rgba(0,0,0,0.73) 85%,rgba(0,0,0,0.77) 100%)',
                'backface-visibility' : 'hidden'
            },
            'position-z': 5,
            'opacity': '[[identity|overlayOpacity]]',
            'scale': '[[identity|overlayScale]]',
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'content' : function(overlayContent) {
                return `
                    <div class="overlay-text">
                        ${overlayContent}
                    </div>
                `;
            }
        },
        '#front-exploding-border' : {
            '$if': '[[identity|selected]]',
            style: {
                'border' : '3px solid white'
            },
            scale: '[[identity|borderScale]]',
            opacity: '[[identity|borderOpacity]]',
            origin: [0.5, 0.5]
        },
        '#front-image' : {
            'content': function(thumbImage) {
                return `<img src="${thumbImage}" style="width: 100%" />`;
            }
        },
        '#back' : {
            '$if': '[[identity|selected]]',
            'rotation-y' : function(rotation) {
                return rotation + Math.PI;
            },
            'position-z' : -5,
            'content': function(fullImage) {
                return `<img src="${fullImage}" style="width: 100%" />`;
            },
            'scale': '[[identity|backScale]]',
            'position': '[[identity|backPosition]]',
            'size' : '[[identity|fullSize]]'
        }
    },
    events: {
        '$lifecycle' : {
            'post-load' : function($state, $dispatcher) {
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

                $state.set('overlayScale', $state.get('overlayStartScale').slice());
            }
        },
        '#front' : {
            'tap' : function($state, $dispatcher, $index) {
                if ($state.get('isAnimating')) return;
                $dispatcher.trigger('animate', {
                    direction: 'frontToBack',
                    rotation: Math.PI,
                    size: $state.get('fullSize'),
                    scale: $state.get('scaleRatios').frontToBackScale,
                });

                $dispatcher.emit('front-tap', $index);
            },
            'mouseover' : function($state, $dispatcher) {
                $dispatcher.trigger('animateOverlay', {
                    opacity: 1,
                    scale: [1, 1]
                });
            },
            'mouseout' : function($state, $dispatcher) {
                $dispatcher.trigger('animateOverlay', {
                    opacity: 0,
                    scale: $state.get('overlayStartScale')
                });
            }
        },
        '#back' : {
            'tap' : function($state, $dispatcher, $index) {
                if ($state.get('isAnimating')) return;
                $dispatcher.trigger('animate', {
                    direction: 'backToFront',
                    rotation: 0,
                    size: $state.get('thumbSize'),
                    scale: $state.get('scaleRatios').backToFrontScale
                });

                $dispatcher.emit('back-tap', $index);
            },
        },
        '$public': {
            'selected': '[[setter]]',
            'thumb-image': function($state, $payload) {
                $state.set('thumbImage', $payload);
            },
            'full-image': function($state, $payload) {
                $state.set('fullImage', $payload);
            },
            'overlay-content': function($state, $payload) {
                $state.set('overlayContent', $payload);
            }
        },
        '$private' : {
            'animate' : function($state, $payload, $dispatcher) {
                if($payload.direction === 'frontToBack'){
                    $dispatcher.trigger('animateExploder');
                }
                if (!$state.get('isAnimating')) {
                    // displaced due to scaling the node. Top-left corner needs to remain
                    // set so that the lightbox item can be properly positioned.
                    var thumbSize = $state.get('thumbSize');
                    var fullSize = $state.get('fullSize');
                    var frontPositionOffset = [0, 0];
                    var backPositionOffset = [0, 0];
                    var transition;
                    if ($payload.direction === 'frontToBack') {
                        frontPositionOffset = [
                            (fullSize[0] - thumbSize[0])/2, (fullSize[1] - thumbSize[1])/2
                        ];
                        transition = $state.get('transitionIn');

                        // animate border on thumb click
                        
                    }
                    else {
                        transition = $state.get('transitionOut');
                        backPositionOffset = [
                            (thumbSize[0] - fullSize[0])/2, (thumbSize[1] - fullSize[1])/2
                        ];
                    }

                    $state.set('isAnimating', true);
                    $state.set('rotation', $payload.rotation, transition);
                    $state.set('frontScale', $payload.scale.front.slice(), transition);
                    $state.set('frontPosition', frontPositionOffset, transition);
                    $state.set('backScale', $payload.scale.back.slice(), transition);
                    $state.set('backPosition', backPositionOffset, transition);
                    $state.set('size', $payload.size, transition)
                        .thenSet('isAnimating', false);

                    $state.set('overlayOpacity', $state.get('overlayOpacity'), {duration: transition.duration * 0.5})
                        .thenSet('overlayOpacity', 0, {duration: 200});
                }
            },
            'animateExploder' : function($state){
                $state.set('borderOpacity', 1);
                $state.set('borderScale', [1, 1])
                var borderTransition = $state.get('borderTransition');
                $state.set('borderScale', $state.get('borderMaxScale'), borderTransition);
                $state.set('borderOpacity', 0, borderTransition)
                    .thenSet('borderScale', [1, 1]);
            },
            'animateOverlay' : function($state, $payload) {
                var transition = $state.get('overlayOpacityTransition');
                $state.set('overlayOpacity', $payload.opacity, transition);
                $state.set('overlayScale', $payload.scale, transition);
            }
        }
    },
    states: {
        thumbImage: undefined,
        fullImage: undefined,

        thumbSize: [300, 300],
        fullSize: [564, 800],

        frontScale: [1, 1],
        backScale: [1, 1],

        frontPosition: [0, 0],
        backPosition: [0, 0],

        rotation: 0,
        transitionIn: {duration: 1300, curve: 'inOutBack'},
        transitionOut: {duration: 1000, curve: 'inOutBack'},
        isAnimating: false,

        overlayOpacity: 0,
        overlayStartScale: [0.9, 0.9],
        overlayOpacityTransition: {duration: 200, 'curve': 'outExpo'},

        borderScale: [1, 1],
        borderOpacity: 0,
        borderMaxScale: [2.5, 2.5],
        borderTransition: {duration: 350},

        selected: false
    },
    tree: `
        <node class='lightbox-item' id='front'>
            <node id='front-exploding-border'></node>
            <node class='image-node' id='front-image'></node>
            <node id='front-overlay'></node>
        </node>
        <node class='lightbox-item' id='back'></node>
    `
})
.config({ includes: ['item.css'] });
