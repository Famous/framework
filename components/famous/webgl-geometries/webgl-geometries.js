BEST.component('famous:webgl-geometries', {
    events: {
        handlers: {
            'box': function($box, $payload) {
                console.log('box: ', $box)
                console.log('payload: ', $payload)
                debugger;
                return $box;
            }
        }
    }
});
