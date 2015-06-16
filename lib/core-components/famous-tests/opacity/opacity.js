FamousFramework.module('famous-tests:opacity', {
    behaviors: {
        '$self' : {
            size: [800, 50]
        },
        '#node1' : {
            position: [0, 50]
        },
        '#node2' : {
            position: [0, 300],
            opacity: 0.2
        },
        '#node3label' : {
            content: 'Opacity of 0% applied to the node beneath this label',
            style: {
                color: 'white'
            },
            size: [200, 25],
            position: [0, 550]
        },
        '#node3' : {
            position: [0, 600],
            opacity: 0
        },
        '.block' : {
            style: '[[identity|myStyle]]',
            size: [200, 200]
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
            opacity: 1
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
        <h1 style="color:white;">You should see two squares, one opaque, and the other semi-transparent. You should also see one logo.</h1>

        <node id='node1' class='block'>
            <node>
                <node>
                    <div>Opacity: 100%</div>
                </node>
            </node>
        </node>

        <node id='node2' class='block'>
            <node>
                <node>
                    <div>Opacity: 20%</div>
                </node>
            </node>
        </node>

        <node id='node3label'></node>
        <node id='node3' class='block'>
            <node>
                <node>
                    <div>Opacity: 0%</div>
                </node>
            </node>
        </node>

        <famous-tests:opacity:child id="child1"></famous-tests:opacity:child>
        <famous-tests:opacity:child id="child2"></famous-tests:opacity:child>
        <famous-tests:opacity:child id="child3"></famous-tests:opacity:child>
    `
});

