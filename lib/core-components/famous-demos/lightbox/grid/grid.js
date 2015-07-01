function calculatePositions(itemSize, itemCount, rowGutter, colGutter, width, height) {
    var result = [];
    for (var i = 0; i < itemCount; i++) {
        result.push(
            [50, 50 + i * (itemSize[1] + rowGutter)]
        );
    }
    return result;
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
            'position-x' : function(positions, $index) {
                return positions[$index][0];
            },
            'position-y' : function(positions, $index, scrollOffset) {
                return positions[$index][1] + scrollOffset;
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
                // Hack because MutationObserver doesn't seem to
                // get triggered with instant function call
                setTimeout(function(){
                    $state.set('gridPositions', calculatePositions(
                        $state.get('itemSize'),
                        20,
                        $state.get('rowGutter')
                    ).slice());

                    $state.set('positions', $state.get('gridPositions').slice());
                }, 100)
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
            },
            'back-tap' : function($state, $index) {
                $state.set('selectedIndex', $index);
                $state.set('itemDepth', 0, $state.get('bringBackTransition'));
            }
        }
    },
    states: {
        rowGutter: 50,
        columngutter: 50,
        containerSize: [1000, 1000],
        itemSize: [300, 300],
        modalSize: [564, 800],
        scrollOffset: 0,
        selectedIndex: null,
        itemDepth: 0,
        pushBackTransition: {duration: 1500, 'curve': 'outBounce'},
        bringBackTransition: {duration: 1500, 'curve': 'inOutElastic'}
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