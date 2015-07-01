function getFormattedValue(field) {
    switch (field.type) {
        case 'float': return parseFloat(field.value);
        case 'int': return parseInt(field.value);
        case 'string': return field.value + '';
    }
}

FamousFramework.component('famous:ui:config-panel:controller', {

    behaviors: {
        '#configurable-content': { '$yield': '.configurable' },
        '#config-panel': {
            'data': function(statesData) {
                return statesData;
            }
        }
    },

    events: {
        '#config-panel': {
            'update': function($payload, $state, $dispatcher) {
                $dispatcher.broadcast('$states-configured', {
                    uid: $payload.uid,
                    key: $payload.key,
                    value: getFormattedValue($payload)
                });
            }
        },

        '#configurable-content': {
            '$states-exposed': function($payload, $state) {
                var statesData = $state.get('statesData');

                if (!statesData.groups) {
                    statesData.groups = [];
                }

                for (var i = 0; i < $payload.fields.length; i++) {
                    $payload.fields[i].uid = $payload.uid;
                }

                statesData.groups.push({
                    uid: $payload.uid,
                    label: $payload.group,
                    fields: $payload.fields
                });

                $state.set('statesData', statesData);
            }
        }
    },

    states: {
        statesData: {},
        updateData: {}
    },

    tree: `
        <node id="configurable-content"></node>
        <famous:ui:config-panel id="config-panel"></famous:ui:config-panel>
    `

});
