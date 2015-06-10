BEST.scene('famous-demos:scroll-view-example', {
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
            <node class="scroll-view-item">Item 0</node>
            <node class="scroll-view-item">Item 1</node>
            <node class="scroll-view-item">Item 2</node>
            <node class="scroll-view-item">Item 3</node>
            <node class="scroll-view-item">Item 4</node>
            <node class="scroll-view-item">Item 5</node>
            <node class="scroll-view-item">Item 6</node>
            <node class="scroll-view-item">Item 7</node>
            <node class="scroll-view-item">Item 8</node>
            <node class="scroll-view-item">Item 9</node>
            <node class="scroll-view-item">Item 10</node>
            <node class="scroll-view-item">Item 11</node>
            <node class="scroll-view-item">Item 12</node>
            <node class="scroll-view-item">Item 13</node>
            <node class="scroll-view-item">Item 14</node>
            <node class="scroll-view-item">Item 15</node>
        </scroll-view>
    `
})
.config({
    imports: {
        'famous:layouts' : ['scroll-view']
    }
});
