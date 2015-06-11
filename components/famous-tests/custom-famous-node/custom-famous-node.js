FamousFramework.scene('famous-tests:custom-famous-node', {
    behaviors: {
        '$self' : {
            'set-top-padding' : '[[identity|topPadding]]',
            'set-bottom-padding' : '[[identity|bottomPadding]]',
            'set-left-padding' : '[[identity|leftPadding]]',
            'set-right-padding' : '[[identity|rightPadding]]',
        },
        'node':  {
            style: {
                'background-color' : 'peru'
            }
        }
    },
    events: {
        $public: {
            'set-top-padding' : '[[setter|camel]]',
            'set-right-padding' : '[[setter|camel]]',
            'set-bottom-padding' : '[[setter|camel]]',
            'set-left-padding' : '[[setter|camel]]'
        },
        '$private' : {
            'set-top-padding' : function($famousNode, $payload) {
                $famousNode.setTopPadding($payload);
            },
            'set-right-padding' : function($famousNode, $payload) {
                $famousNode.setRightPadding($payload);
            },
            'set-bottom-padding' : function($famousNode, $payload) {
                $famousNode.setBottomPadding($payload);
            },
            'set-left-padding' : function($famousNode, $payload) {
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
