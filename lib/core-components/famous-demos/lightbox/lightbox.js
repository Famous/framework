FamousFramework.component('famous-demos:lightbox', {
    behaviors: {
        '#config' : { 'position-y' : 50 },
        '#http' : { 'request' : { url: 'https://s3-us-west-2.amazonaws.com/famous-framework/lightbox/caprichos.json' } },
        '#grid': { 'data': '[[identity|data]]' }
    },

    events: {
        '#http': {
            'response': function($payload, $state) {
                $state.set('data', $payload.response.data);
            }
        }
    },

    tree: `
        <famous:ui:config-panel id="config"></famous:ui:config-panel>
        <famous:service:http id="http"></famous:service:http>
        <famous-demos:lightbox:grid id="grid"></famous-demos:lightbox:grid>
    `
});
