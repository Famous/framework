FamousFramework.scene('famous-demos:scroll-view-example', {
    behaviors: {
        '$self': {
        },
        'scroll-view' : {
            'item-height' : 100,
            'scroll-view-size' : [400, 700],
            'scroll-view-position' : [75, 100]
        },
        '#label' : {
            'position': [75, 25],
            'size' : [400, 100],
            'style' : {
                'color' : '#40b2e8',
                'font-family' : 'Lato',
                'font-size' : '18px'
            }
        },
        '.scroll-view-item' : {
            style: {
                'background-color' : 'white',
                'border' : '1px solid black',
                'color' : '#40b2e8',
                'font-family' : 'Lato',
                'font-size' : '30px',
                'padding' : '10px'
            },
            'size-absolute-y': 100,
            '$repeat' : function(count) {
                var result = [];
                for(var i =0; i < count; i++) {
                    result.push({
                        content: `Item ${ i + 1 }`
                    });
                }
                return result;
            }
        }
    },
    events: {
        '$public' : {
            count: '[[setter]]'
        },
        'node' : {
            'click' : function($index) {
                console.log('Click on Item ', $index);
            }
        }
    },
    states: {
        count: 10
    }, 
    tree: `
        <node id='label'>
            <div>Send a message to the component using \`FamousFramework.message\` to update the number of items.</div>
        </node>
        <scroll-view>
            <node class="scroll-view-item"></node>
        </scroll-view>
    `
})
.config({
    imports: {
        'famous:layouts' : ['scroll-view']
    }
});
