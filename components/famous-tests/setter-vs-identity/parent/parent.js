FamousFramework.scene('famous-tests:setter-vs-identity:parent', {
    behaviors: {
        '#child': {
            'childSize': [300, 300]
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
        'famous-tests:setter-vs-identity': ['child']
    }
});