FamousFramework.scene('famous-tests:does-behavior-void:parent', {
    behaviors: {
        '#child': {
            '$repeat': function() {
                var children = [];
                for (var i = 0; i < 10; i++) {
                    children.push(i);
                }
                return children;
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <child id="child"></child>
    `
})
.config({
    imports: {
        'famous-tests:does-behavior-void': ['child']
    }
});