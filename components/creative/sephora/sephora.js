BEST.module('creative:sephora', {
    behaviors: {
        '#background': { style: { background: '#000' } },
        '#bottle': { 'type': 'bottle' },
        '#bottle-label': { 'type': 'bottle-label' },
        '#five-black': { 'type': 'five-black' },
        '#five-color': { 'type': 'five-color' },
        '#five-light': { 'type': 'five-light' },
        '#getit': { 'type': 'getit' },
        '#letter-a': { 'type': 'letter-a' },
        '#letter-e': { 'type': 'letter-e' },
        '#letter-h': { 'type': 'letter-h' },
        '#letter-o': { 'type': 'letter-o' },
        '#letter-p': { 'type': 'letter-p' },
        '#letter-r': { 'type': 'letter-r' },
        '#letter-s': { 'type': 'letter-s' },
        '#light': { 'type': 'light' },
        '#container': {
            'mount-point': [0.5, 0.5, 0.5],
            'align': [0.5, 0.5, 0.5],
            'origin': [0.5, 0.5, 0.5],
            size: [320, 568]
        },
        '.sephora-container': {}
        // 'sprite' : {
        //     // type: function(type) {
        //     //     console.log(type);
        //     //     return type;
        //     // }
        //     $repeat : function(ids) {
        //         var result = [];
        //         for (var i = 0; i < ids.length; i++) {
        //             result.push({
        //                 position: [0, i * 200 - 200]
        //             });
        //         }
        //         return result;
        //     },
        //     type: function($index, ids, type, selectedIndex) {
        //         if (type && $index === selectedIndex) {
        //             return type;
        //         }
        //         else {
        //             return ids[$index];
        //         }
        //
        //     }
        // }
    },
    events: {
        // '#getit': {
        //     'click': function ($behaviors, $state, $payload) {
        //         $payload.currentTarget.set('type', 'letter-s');
        //         $behaviors['#getit'].set('type', 'letter-s');
        //     }
        // }
        // 'sprite': {
        //     'sprite-click' : function($state, $payload) {
        //         // console.log('---------');
        //         // console.log($payload);
        //         // console.log($payload.detail.index);
        //         // console.log('---------');
        //         $state.set('selectedIndex', $payload.detail);
        //         $state.set('type', 'letter-e');
        //     }
        // }
    },
    states: {
        // type: 'letter-a',
        // ids : ['bottle', 'bottle-label', 'five-black']
    },
    tree: 'sephora.html'
})
.config({
    imports: {
        'creative:sephora': ['sprite']
    },
    includes: ['sephora.css']
});
