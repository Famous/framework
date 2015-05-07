var _ = require('underscore');

BEST.scene('matthew.trost:browserify-example', 'HEAD', {
    tree: '<dom-element id="el"><p>Hi</p></dom-element>',
    behaviors: {
        '#el': {
            'style': function() {
                var a = [1,2,3];
                _.each(a, function(el){console.log(el);});
                return {
                    'background-color': 'red'
                };
            }
        }
    }
});
