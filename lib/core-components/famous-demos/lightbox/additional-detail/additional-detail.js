FamousFramework.component('famous-demos:lightbox:additional-detail', {
    behaviors: {
        '$self' : {
            'size': [300, 600],
            'position' : '[[identity]]',
            'opacity' : '[[identity]]'
        },
        '.additional-detail-title' : {
            'position-x' : '[[identity|titlePositionX]]',
            'position-y' : '[[identity|positionY]]',
            'content': function(detailTitle) {
                return detailTitle;
            }
        },
        '.additional-detail-info' : {
            'position-x' : '[[identity|infoPositionX]]',
            'position-y' : function(positionY) {
                return positionY + 175;
            },
            'content': function(detailContent) {
                return detailContent;
            }
        }
    },
    events: {
        '$lifecycle' : {
            'post-load' : function($state) {
                $state.set('opacity', 0);
            }
        },
        '$self' : {
            'additional-detail-position' : function($state, $payload) {
                var outPositionX = $payload.totalSize[0];

                $state.set('outPositionX', outPositionX);
                $state.set('inPositionX', $payload.centerPosition[0] + $payload.modalSize[0] + 25);

                $state.set('titlePositionX', outPositionX);
                $state.set('infoPositionX', outPositionX);
                $state.set('positionY', $payload.centerPosition[1]  + 25);
            }
        },
        '$public' : {
            'animate-in' : function($state, $payload) {
                if (!$payload) return;
                $state.set('opacity', 1);

                $state.set('titlePositionX', $state.get('titlePositionX'), {duration: $state.get('titleDelay')})
                    .thenSet('titlePositionX', $state.get('inPositionX'), $state.get('titleTransition'));
                $state.set('infoPositionX', $state.get('inPositionX'), $state.get('infoTransition'));
            },
            'animate-out' : function($state, $payload) {
                if (!$payload) return;

                var transition = $state.get('exitTransition');

                $state.set('titlePositionX', $state.get('outPositionX'), transition);
                $state.set('infoPositionX', $state.get('outPositionX'), transition)
                    .thenSet('opacity', 0)
            },
            'detail-content' : function($state, $payload) {
                console.log('content');
                $state.set('detailContent', $payload);
            },
            'detail-title' : function($state, $payload) {
                $state.set('detailTitle', $payload);
            }
        }
    },
    states: {
        inPositionX: null,
        outPositionX: null,

        titlePositionX: 0,
        infoPositionX: 0,
        positionY: 0,

        titleDelay: 200,
        titleTransition: {duration: 500, curve: 'outExpo'},
        infoTransition: {duration: 500, curve: 'outCirc'},
        exitTransition: {duration: 300, curve: 'outExpo'}
    },
    tree: `
        <node class='additional-detail-title'></node>
        <node class='additional-detail-info'></node>
    `
})
.config({
    includes: ['additional-detail.css']
});