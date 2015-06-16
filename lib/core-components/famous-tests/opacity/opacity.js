FamousFramework.module('famous-tests:opacity', {
    behaviors: {
        '#node1' : {
            position: [0, 50]
        },
        '#node2' : {
            position: [0, 300],
            opacity: 0.2
        },
        '#node3' : {
            position: [300, 50],
            opacity: 0
        },
        '#child1' : {
            position: [300, 300]
        },
        '#child2' : {
            position: [600, 50],
            opacity: 0
        },
        '#child3' : {
            position: [600, 50],
            opacity: 0.0001
        },
        'node' : {
            style: function(myStyle) {
                console.log('myStyle', myStyle);
                return myStyle;

            },
            size: [200, 200]
        }

    },
    events: {
    },
    states: {
        myStyle : {
            'background-color' : 'white',
            'text-align' : 'center',
            'line-height' : '200px',
            'color' : 'black',
            'cursor' : 'pointer'
        }
    },
    tree: `
        <h1 style="color:white;">You should see two squares, one opaque, and the other semi-transparent</h1>

        <node id='node1'>
            <node>
                <node>
                    <div>Opacity: 100%</div>
                </node>
            </node>
        </node>

        <node id='node2'>
            <node>
                <node>
                    <div>Opacity: 20%</div>
                </node>
            </node>
        </node>

        <node id='node3'>
            <node>
                <node>
                    <div>Opacity: 0%</div>
                </node>
            </node>
        </node>

        <famous-tests:opacity:child id="child1">default opacity 0</famous-tests:opacity:child>

        <famous-tests:opacity:child id="child2">opacity set to 0</famous-tests:opacity:child>

        <famous-tests:opacity:child id="child3">opacity set to 0.0001</famous-tests:opacity:child>
    `
});
