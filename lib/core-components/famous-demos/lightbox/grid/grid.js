function calculatePositions(itemSize, itemCount, rowGutter, columnGutter, topMargin, width) {
    var result = [];
    var offsetX = 0;
    var offsetY = topMargin;
    var centerRowOffset = 0;
    var row = 0;
    for (var i = 0; i < itemCount; i++) {
        result.push([offsetX, offsetY]);
        
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
            'position-z' : function(itemDepth, selectedIndex, $index) {
                if ($index === selectedIndex) {
                    return 0;
                }
                else {
                    return itemDepth;
                }
            }
        }
    },
    events: {
        '$lifecycle' : {
            'post-load' : function($state) {
                // // Hack because MutationObserver doesn't seem to
                // // get triggered with instant function call
                // setTimeout(function(){
                    
                // }, 100)
            }
        },
        '$self' : {
            'size-change' : function($state, $event) {
                $state.set('size', $event.value);

                $state.set('positions', calculatePositions(
                    $state.get('itemSize'),
                    20,
                    $state.get('rowGutter'),
                    $state.get('columnGutter'),
                    $state.get('topMargin'),
                    $state.get('size')[0]
                ).slice());
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
            'front-tap' : function($state, $index) {
                $state.set('selectedIndex', $index);
                $state.set('itemDepth', -1000, $state.get('pushBackTransition'));

                // Center item
                var positions = $state.get('positions');
                var selectedItemPosition = [
                    positions[$index][0],
                    positions[$index][1] + $state.get('scrollOffset')
                ];
                $state.set('centerPosition', selectedItemPosition);
                var centerPosition = getCenterPosition($state.get('size'), $state.get('modalSize'));
                $state.set('centerPosition', centerPosition, $state.get('centerTransition'));
            },
            'back-tap' : function($state, $index) {
                $state.set('itemDepth', 0, $state.get('bringBackTransition'));
                var positions = $state.get('positions');
                var selectedItemPosition = [
                    positions[$index][0],
                    positions[$index][1] + $state.get('scrollOffset')
                ];
                $state.set('centerPosition', selectedItemPosition, $state.get('centerTransition'))
                    .thenSet('selectedIndex', null);
            }
        }
    },
    states: {
        rowGutter: 50,
        columnGutter: 50,
        itemSize: [300, 300],
        modalSize: [564, 800],
        scrollOffset: 0,
        selectedIndex: null,
        centerPosition: null,
        itemDepth: 0,
        pushBackTransition: {duration: 1500, 'curve': 'outBounce'},
        bringBackTransition: {duration: 1500, 'curve': 'outExpo'},
        centerTransition: {duration: 700},
        centerPosition: [0, 0],
        topMargin: 50
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
    },
    includes: ['grid.css']
});