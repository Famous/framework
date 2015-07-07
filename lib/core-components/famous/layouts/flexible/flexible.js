FamousFramework.component('famous:layouts:flexible', {
    behaviors: {
        '$self' : {
            'direction' : '[[identity]]',
            'ratios' : '[[identity]]',
            'transition' : '[[identity]]'
        },
        '.flexible-layout': {
            // HACK: force creating a layout wrapper container
            'style': {}
        },
        '.flexible-layout-item': {
            '$yield': true
        }
    },
    events: {
        '$public': {
            direction: '[[setter]]',
            ratios: '[[setter]]',
            transition: '[[setter]]'
        },
        '$private' : {
            direction($famousNode, $payload) {
                if ($payload === 0) {
                    $famousNode.setDirection(FlexibleLayout.Direction.X);
                } else if ($payload === 1) {
                    $famousNode.setDirection(FlexibleLayout.Direction.Y);
                } else if ($payload === 2) {
                    $famousNode.setDirection(FlexibleLayout.Direction.Z);
                }
            },
            ratios($famousNode, $payload) {
                $famousNode.setRatios($payload);
            },
            transition($famousNode, $payload) {
                $famousNode.setTransition($payload);
            }
        }
    },
    states: {
        direction: 0,
        ratios: [],
        transition: null
    },
    tree: `
        <node class="flexible-layout">
            <node class="flexible-layout-item"></node>
        </node>
    `
}).config({
    famousNodeConstructorName: 'FlexibleLayout',
    includes: ['_constructor.js']
});
