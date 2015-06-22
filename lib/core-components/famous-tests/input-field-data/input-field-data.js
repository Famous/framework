FamousFramework.scene('famous-tests:input-field-data', {
    behaviors: {
        '$self': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        }
    },
    events: {
        '#input-field': {
            'famous:events:change': function($state, $event) {
                alert($event.value);
            },
            'input': function($state, $event) {
                console.log('$event.value: ', $event.value);
            }
        }
    },
    states: {},
    tree: `
        <input id="input-field" placeholder="What is your name?"></input>
    `
});
