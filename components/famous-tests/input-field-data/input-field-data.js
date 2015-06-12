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
            'change': function($state, $payload) {
                alert($payload.value);
            },
            'value': function($state, $payload) {
                console.log('$payload.value: ', $payload.value);
            }
        }
    },
    states: {},
    tree: `
        <input id="input-field" placeholder="What is your name?"></input>
    `
});