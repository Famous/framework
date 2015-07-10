FamousFramework.scene('famous-tests:custom-famous-node', {
    behaviors: {
        '$self' : {
            'top-padding' : '[[identity|topPadding]]',
            'bottom-padding' : '[[identity|bottomPadding]]',
            'left-padding' : '[[identity|leftPadding]]',
            'right-padding' : '[[identity|rightPadding]]',
        },
        'node':  {
            style: {
                'background-color' : 'peru'
            }
        }
    },
    events: {
        $public: {
            'top-padding' : '[[setter|topPadding]]',
            'right-padding' : '[[setter|rightPadding]]',
            'bottom-padding' : '[[setter|bottomPadding]]',
            'left-padding' : '[[setter|leftPadding]]'
        },
        '$private' : {
            'top-padding' : function($famousNode, $payload) {
                $famousNode.setTopPadding($payload);
            },
            'right-padding' : function($famousNode, $payload) {
                $famousNode.setRightPadding($payload);
            },
            'bottom-padding' : function($famousNode, $payload) {
                $famousNode.setBottomPadding($payload);
            },
            'left-padding' : function($famousNode, $payload) {
                $famousNode.setLeftPadding($payload);
            }
        }
    },
    states: {
        'leftPadding': 40,
        'topPadding': 0,
        'rightPadding': 40,
        'bottomPadding': 0
    }, 
    tree: `
        <node id='one'>Child of custom padded node</node>
    `
})
.config({
    includes: ['register-node-constructor.js'],
    famousNodeConstructorName: 'PaddedNode'
});
