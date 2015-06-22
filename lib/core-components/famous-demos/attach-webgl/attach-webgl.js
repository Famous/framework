FamousFramework.scene('famous-demos:attach-webgl', {
    behaviors: {
        '#webgl-node' : {
            size: [200, 200],
            position: '[[identity]]',
            style: {
                'cursor': 'pointer'
            }
        },
        '#label' : {
            position: [50, 50],
            size: [400, 100],
            style: {
                color: 'white'
            }
        }
    },
    events: {
        '#webgl-node' : {
            'click' : function($state) {
                var newPosition = [Math.random() * 500, Math.random() * 500];
                $state.set('position', newPosition, {duration: 400, 'curve' : 'outExpo'});
            }
        }
    },
    tree: `
        <node id='label'>
            <div>Click on the geodesic sphere to update its position:</div>
        </node>

        <node id="webgl-node"></node>
    `,
    states: {
        'position' : [100, 100]
    }
})
/**
 * Config:
 *      Include other files (.js, .css, etc) in your project.
 */
.config({ includes: ['webgl-example.js'] });
