BEST.component('famous-demos:sap-ad', {
    tree: 'sap-ad.html',
    behaviors: {
        '#ad-container': {
            'size': function(size) {
                return size;
            },
        }
    },
    events: {},
    states: {
        size: [300, 600]
    }
});
