FamousFramework.module('famous-tests:opacity', {
    behaviors: {
        '#node1' : {
            position: [0, 50]
        },
        '#node2' : {
            position: [0, 300],
            opacity: 0.5
        },
        'node' : {
            style: function(myStyle) {
                console.log('weafkwejkfajwkf');
                return myStyle

            },
            size: [200, 200]
        }
    },
    events: {
    },
    states: {
        myStyle : {
            'background-color' : 'black',
            'text-align' : 'center',
            'line-height' : '200px',
            'color' : 'white',
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
                    <div>Opacity: 50%</div>
                </node>
            </node>
        </node>
    `,
});
