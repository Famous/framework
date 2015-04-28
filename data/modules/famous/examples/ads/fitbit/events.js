{
    '.fitbit' : {
        'start-hover': function($state, $payload) {
            var fitbitIndex = $payload.detail.index;
            var color = $state.get('fitbitInfo')[fitbitIndex].color;
            $state.set('buttonColor', color);
            $state.set('findFitRotation', Math.PI/2, $state.get('rotationCurve'));
        },
        'end-hover': function($state, $payload) {
            $state.set('buttonColor', null);
            $state.set('findFitRotation', 0, $state.get('rotationCurve'));
        },
        'click': function() {
            
        }
    },
    '$private' : {
        'assign-start-ad' : function($state) {
            $state.set('t1', 1000, {duration: 1000})
                .thenSet('t2', 2000, {duration: 2000})
                .thenSet('t3', 1000, {duration: 1000})
                .thenSet('animationComplete', true);
        },
        'foo-foo': 'setter|camel'
    }
}