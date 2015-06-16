FamousFramework.scene('famous-demos:scroll-view-example', {
    behaviors: {
        '$self': {
        },
        'scroll-view' : {
            'item-height' : 100,
            'scroll-view-size' : [400, 700],
            'scroll-view-position' : [75, 75]
        },
        'node' : {
            style: {
                'background-color' : 'white',
                'border' : '1px solid black',
                'color' : '#40b2e8',
                'font-family' : 'Lato',
                'font-size' : '30px',
                'padding' : '10px'
            },
            'size-absolute-y': 100
        }
    },
    events: {
        'node' : {
            'click' : function($index) {
                console.log('Click on Item ', $index);
            }
        }
    },
    states: {
    }, 
    tree: `
        <scroll-view>
            <node class="scroll-view-item"><div>Item 0</div></node>
            <node class="scroll-view-item"><div>Item 1</div></node>
            <node class="scroll-view-item"><div>Item 2</div></node>
            <node class="scroll-view-item"><div>Item 3</div></node>
            <node class="scroll-view-item"><div>Item 4</div></node>
            <node class="scroll-view-item"><div>Item 5</div></node>
            <node class="scroll-view-item"><div>Item 6</div></node>
            <node class="scroll-view-item"><div>Item 7</div></node>
            <node class="scroll-view-item"><div>Item 8</div></node>
            <node class="scroll-view-item"><div>Item 9</div></node>
            <node class="scroll-view-item"><div>Item 10</div></node>
            <node class="scroll-view-item"><div>Item 11</div></node>
            <node class="scroll-view-item"><div>Item 12</div></node>
            <node class="scroll-view-item"><div>Item 13</div></node>
            <node class="scroll-view-item"><div>Item 14</div></node>
            <node class="scroll-view-item"><div>Item 15</div></node>
        </scroll-view>
    `
})
.config({
    imports: {
        'famous:layouts' : ['scroll-view']
    }
});
