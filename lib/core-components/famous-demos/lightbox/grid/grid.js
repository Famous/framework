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
        '#container' : {
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
        }
    },
    events: {
        '$private' : {
            'set-position' : function($state) {
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
                for (var i = 0; i < count; i++) {
                    $state.set(['positions', i, 2], $payload.depth, $payload.transition);
                }
            }
        },
        '$self' : {
            'size-change' : function($state, $event, $dispatcher) {
                if (!$state.get('positionsInitialized')) {
                    $dispatcher.trigger('initialize-positions');
                }

                $state.set('size', $event.value);
                $dispatcher.trigger('set-position');
            }
        },
        '#container' : {
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
                $state.set('centerPosition', centerPosition, $state.get('centerTransition'));

                $dispatcher.trigger('animate-depth', {
                    depth: $state.get('pushBackDepth'),
                    transition: $state.get('pushBackTransition')
                });
            },
            'back-tap' : function($state, $index, $dispatcher) {
                var positions = $state.get('positions');
                var selectedItemPosition = [
                    positions[$index][0],
                    positions[$index][1] + $state.get('scrollOffset')
                ];
                $state.set('centerPosition', selectedItemPosition, $state.get('centerTransition'))
                    .thenSet('selectedIndex', null);

                $dispatcher.trigger('animate-depth', {
                    depth: 0,
                    transition: $state.get('bringBackTransition')
                });
            }
        }
    },
    states: {
        positionsInitialized: false,
        rowGutter: 50,
        columnGutter: 50,
        itemSize: [300, 300],
        modalSize: [564, 800],
        scrollOffset: 0,
        selectedIndex: null,
        centerPosition: null,
        pushBackDepth: -1000,
        pushBackTransition: {duration: 1500, 'curve': 'outBounce'},
        bringBackTransition: {duration: 1500, 'curve': 'outExpo'},
        gridTransition: {curve: 'inOutElastic', duration: 1000},
        centerTransition: {duration: 700},
        centerPosition: [0, 0],
        topMargin: 50,
        gridReflowStagger: 80,
        itemCount: 20
    },
    tree: `
        <node id='container'>
            <item class='grid-item'></item>
        </node>
    `
})
.config({
    imports: {
        'famous-demos:lightbox' : ['item']
    }
});