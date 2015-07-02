function calculatePositions(itemSize, itemCount, rowGutter, columnGutter, topMargin, width) {
    var result = [];
    var offsetX = 0;
    var offsetY = topMargin;
    var centerRowOffset = 0;
    var row = 0;
    for (var i = 0; i < itemCount; i++) {
        result.push([offsetX, offsetY, 0]);
        
        if ((offsetX + 2 * itemSize[0] + columnGutter) < width) {
            offsetX += itemSize[0] + columnGutter
        }
        else {
            // make adjustment to center the rows
            if (row++ === 0) {
                centerRowOffset = (width - offsetX - itemSize[0]) / 2;
                for (var j = 0; j < result.length; j++) {
                    result[j][0] += centerRowOffset
                }
            }

            offsetX = centerRowOffset;
            offsetY += itemSize[1] + rowGutter;
        }
    }
    return result;
}

function getCenterPosition(totalSize, modalSize) {
    return [
        (totalSize[0] - modalSize[0]) / 2,
        (totalSize[1] - modalSize[1]) / 2
    ];
}

FamousFramework.component('famous-demos:lightbox:grid', {
    behaviors: {
        '$camera': {
            'set-depth': 1500
        },
        '$self' : {
            'grid-dimension-update' : function(topMargin, rowGutter, columnGutter) {
                return true;
            }
        },
        '#lightbox-container' : {
            content: '' // create DOMElement to capture scroll events
        },
        '#item-view' : {
            'position-y' : '[[identity|itemViewOffset]]'
        },
        '.grid-item' : {
            '$repeat' : function(positions) {
                return positions || [];
            },
            'position-x' : function(positions, centerPosition, selectedIndex, $index) {
                if ($index === selectedIndex) {
                    return centerPosition[0];
                }
                else {
                    return positions[$index][0];
                }
            },
            'position-y' : function(positions, scrollOffset, centerPosition, selectedIndex, $index) {
                if ($index === selectedIndex) {
                    return centerPosition[1];
                }
                else {
                    return positions[$index][1] + scrollOffset;
                }
            },
            'position-z' : function(positions, selectedIndex, $index) {
                if ($index === selectedIndex) {
                    return 0;
                }
                else {
                    return positions[$index][2];
                }
            }
        },
        '#lightbox-overlay' : {
            style: {
                'background-color' : 'black'
            },
            opacity: '[[identity|overlayOpacity]]',
            'position-z' : function(pushBackDepth) {
                return -pushBackDepth * 0.6;
            },
            'size' : function(size) {
                return [size[0] * 5, size[1] * 5]
            },
            'align' : [0.5, 0.5],
            'mount-point' : [0.5, 0.5]
        }
    },
    events: {
        '$public' : {
            'row-gutter' : '[[setter|camel]]',
            'column-gutter' : '[[setter|camel]]',
            'top-margin' : '[[setter|camel]]'
        },
        '$private' : {
            'set-positions' : function($state) {
                var oldPositions = $state.get('positions') || [];
                var newPositions = calculatePositions(
                    $state.get('itemSize'),
                    $state.get('itemCount'),
                    $state.get('rowGutter'),
                    $state.get('columnGutter'),
                    $state.get('topMargin'),
                    $state.get('size')[0]
                ).slice();

                var gridReflowStagger = $state.get('gridReflowStagger');
                var gridTransition = $state.get('gridTransition');
                for (var i = 0; i < newPositions.length; i++) {
                    $state.set(['positions', i], oldPositions[i] || [0, 0], {duration: 1 + gridReflowStagger * i})
                        .thenSet(['positions', i], newPositions[i], gridTransition);
                }
            },
            'grid-dimension-update' : function($state, $dispatcher) {
                if ($state.get('positionsInitialized')) {
                    $dispatcher.trigger('set-positions');
                }
            },
            'initialize-positions' : function($state) {
                var count = $state.get('itemCount');
                var initialPositions = [];
                for (var i = 0; i < count; i++) {
                    initialPositions.push([0, 0, 0]);
                }
                $state.set('positions', initialPositions);
                $state.set('positionsInitialized', true);
            },
            'animate-depth' : function($state, $payload) {
                var count = $state.get('itemCount');
                var stagger = $state.get('pushBackStagger');
                var itemStagger;
                var currentItemDepth;
                var curve;
                var transition;
                for (var i = 0; i < count; i++) {
                    curve = i === $payload.selectedIndex ?  'outExpo' : $payload.transition.curve;
                    var duration = $payload.transition.duration;
                    transition = {
                        curve: curve,
                        duration: duration - (0.5 - Math.random()) * stagger * (duration * 0.5)
                    };
                    $state.set(['positions', i, 2], -$payload.depth, transition);
                }

                var overlayTransition = $state.get('overlayTransition');
                if ($payload.direction === 'back') {
                    $state.set('overlayOpacity', 0, {duration: $payload.transition.duration * 0.25})
                        .thenSet('overlayOpacity', $state.get('overlayOpacityFinal'), overlayTransition);
                }
                else {
                    $state.set('overlayOpacity', 0, overlayTransition);
                }
            }
        },
        '$self' : {
            'size-change' : function($state, $event, $dispatcher) {
                if (!$state.get('positionsInitialized')) {
                    $dispatcher.trigger('initialize-positions');
                }

                $state.set('size', $event.value);
                $dispatcher.trigger('set-positions');
            }
        },
        '#lightbox-container' : {
            'wheel' : function($state, $event) {
                var offset = $state.get('scrollOffset') - $event.deltaY;

                if (offset < 0) {
                    $state.set('scrollOffset', $state.get('scrollOffset') - $event.deltaY);
                }
            }
        },
        '.grid-item' : {
            'front-tap' : function($state, $index, $dispatcher) {
                $state.set('selectedIndex', $index);

                // Center item
                var positions = $state.get('positions');
                var selectedItemPosition = [
                    positions[$index][0],
                    positions[$index][1] + $state.get('scrollOffset')
                ];
                $state.set('centerPosition', selectedItemPosition);
                var centerPosition = getCenterPosition($state.get('size'), $state.get('modalSize'));
                $state.set('centerPosition', centerPosition, $state.get('bringToCenterTransition'));

                $dispatcher.trigger('animate-depth', {
                    depth: $state.get('pushBackDepth'),
                    transition: $state.get('pushBackTransition'),
                    selectedIndex: $index,
                    direction: 'back'
                });
            },
            'back-tap' : function($state, $index, $dispatcher) {
                var positions = $state.get('positions');
                var selectedItemPosition = [
                    positions[$index][0],
                    positions[$index][1] + $state.get('scrollOffset')
                ];
                $state.set('centerPosition', selectedItemPosition, $state.get('returnFromCenterTransition'))
                    .thenSet('selectedIndex', null);

                $dispatcher.trigger('animate-depth', {
                    depth: 0,
                    transition: $state.get('bringBackTransition'),
                    selectedIndex: $index,
                    direction: 'forward'
                });
            }
        }
    },
    states: {
        positionsInitialized: false,
        itemCount: 40,
        selectedIndex: null,
        scrollOffset: 0,

        // grid dimensions
        rowGutter: 50,
        columnGutter: 50,
        topMargin: 50,
        itemSize: [300, 300],
        modalSize: [564, 800],

        // modal options
        pushBackDepth: 1500,
        centerPosition: [0, 0],

        // overlay optinos
        overlayOpacity: 0,
        overlayOpacityFinal: 0.8,

        // transitions
        gridTransition             : {duration: 1000, 'curve': 'inOutElastic'},
        pushBackTransition         : {duration: 1000, 'curve': 'outBounce'},
        bringBackTransition        : {duration: 1000, 'curve': 'inOutBack'},
        bringToCenterTransition    : {duration: 1300, curve: 'inOutBack'},
        returnFromCenterTransition : {duration: 1300, curve: 'outExpo'},
        overlayTransition          : {duration: 300},
        pushBackStagger: 0,
        gridReflowStagger: 80
    },
    tree: `
        <node id='lightbox-container'>
            <node id='lightbox-overlay'></node>
            <item class='grid-item'></item>
        </node>
    `
})
.config({
    imports: {
        'famous-demos:lightbox' : ['item'],
    },
    includes: ['grid.css'],
    expose: [
        {key: 'topMargin', name: 'Top Margin', range: [0, 300]},
        {key: 'rowGutter', name: 'Row Gutter', range: [0, 300]},
        {key: 'columnGutter', name: 'Column Gutter', range: [0, 300]},
        {key: 'pushBackStagger', name: 'Lightbox Duration Variance', range: [0, 1], step: 0.05},
        {key: 'pushBackDepth', name: 'Lightbox Depth', range: [500, 4000]}
    ]
});