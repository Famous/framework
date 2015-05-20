BEST.module('famous:core:context', 'HEAD', {
    events: {
        '$public': {
            'attach': function($payload, $famousNode) {
                $payload($famousNode);
            },
            // HACK --> needed to mask WebGL until platform updates
            // opacity to pass down through tree
            'opacity': function($famousNode, $payload) {
                $famousNode.setOpacity($payload);
            }
        }
    }
});
