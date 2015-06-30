function buildLabel(label) {
    return `<label class="famous-ui__config-panel__group-label">${label}</label>`;
}

function buildField(field) {
    switch (field.type) {
        case 'float':
            return `
                <input class="famous-ui__config-panel__control" type="range" min="${field.min}" max="${field.max}" value="${field.value}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        case 'int':
            return `
                <input class="famous-ui__config-panel__control" type="number" min="${field.min}" max="${field.max}" value="${field.value}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        case 'string':
            return `
                <input class="famous-ui__config-panel__control" type="text" value="${field.value}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
    }
}

FamousFramework.component('famous:ui:config-panel', {
    behaviors: {
        '#panel-container': {
            'position': function(offsetPosition) { return offsetPosition; }
        },

        '#panel': {
            'opacity': function(panelOpenness, panelFullOpacity) { return panelFullOpacity * panelOpenness; },
            'position': function(panelOpenness, panelWidth) { return [-panelWidth + (panelWidth * panelOpenness), 0]; },
            'style': function(panelStyle) { return panelStyle; },
            'size': function(panelWidth) {
                return [panelWidth, undefined];
            }
        },

        '#panel-content': {
            'position-y': function(buttonSize, gutterSize) { return buttonSize + (gutterSize * 2); },
            'style': function(gutterSize) {
                return {
                    'color': 'white',
                    'padding-left': gutterSize + 'px',
                    'padding-right': gutterSize + 'px'
                };
            },
            'size': [undefined, undefined],
            'content': function(data) {
                var out = '';
                if (data.groups) {
                    for (var i = 0; i < data.groups.length; i++) {
                        var group = data.groups[i];
                        out = out.concat('<div class="famous-ui__config-panel__group">');
                        out = out.concat(buildLabel(group.label));
                        for (var j = 0; j < group.fields.length; j++) {
                            out = out.concat(buildField(group.fields[j]));
                        }
                        out = out.concat('</div>');
                    }
                }
                return out;
            }
        },

        '#toggle-button': {
            'origin': [0.5, 0.5],
            'rotation-z': function(buttonRotation) { return buttonRotation; },
            'opacity': function(panelOpenness) { return 0.5 + (panelOpenness / 2); },
            'position-y': function(gutterSize) { return gutterSize; },
            'position-x': function(gutterSize) { return gutterSize; },
            'size-absolute': function(buttonSize) { return [buttonSize, buttonSize]; },
            'style': { 'z-index': 2, 'cursor': 'pointer' },
            'unselectable': true
        }
    },

    events: {
        '$public': {
            'open': function($state) {
                $state.set('isOpen', true);
                $state.set('buttonRotation', $state.get('buttonOpenRotation'), {
                    duration: $state.get('openCloseDuration'),
                    curve: $state.get('openCloseCurve')
                });
                $state.set('panelOpenness', 1.0, {
                    duration: $state.get('openCloseDuration'),
                    curve: $state.get('openCloseCurve')
                });
            },

            'close': function($state) {
                $state.set('isOpen', false);
                $state.set('buttonRotation', $state.get('buttonClosedRotation'), {
                    duration: $state.get('openCloseDuration'),
                    curve: $state.get('openCloseCurve')
                });
                $state.set('panelOpenness', 0.0, {
                    duration: $state.get('openCloseDuration'),
                    curve: $state.get('openCloseCurve')
                });
            },

            /**
             * `data` receives the payload for all of the initial controls to
             * render within the panel. The format of the data should be:
             * {
             *   groups: [
             *     { label: 'Grid',
             *       fields: [
             *           { name: 'Column Gutters',
             *             type: 'float', // 'int','string','boolean'
             *             value: 0, // Starting value
             *             min: 0, // Optional min number
             *             max: 100, // Optional max number
             *           }
             *       ]
             *     }
             *   ]
             * }
             */
            'data': function($state, $payload) {
                $state.set('data', $payload || []);
            },

            'align': function($state, $payload) {
                if ($payload === 'right' || $payload === 'left') {
                    $state.set('panelAlign', $payload);
                }
                else {
                    $state.set('panelAlign', $state.get('panelAlign'));
                }
            }
        },

        '#toggle-button': {
            'click': function($state, $dispatcher) {
                if ($state.get('isOpen')) {
                    $dispatcher.trigger('close');
                }
                else {
                    $dispatcher.trigger('open');
                }
            }
        },

        '#panel-content': {
            'input': function($event) {
                console.log($event);
            }
        }
    },

    states: {
        buttonClosedRotation: 0,
        buttonOpenRotation: Math.PI / 4,
        buttonRotation: 0,
        buttonSize: 40,
        gutterSize: 20,
        data: {
            groups: [{
                label: 'Grid',
                fields: [
                    { name: 'Column Gutters', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Row Gutters', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Top Margin', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Bottom Margin', type: 'float', value: 0, min: 0, max: 100 }
                ]
            },{
                label: 'Lightbox',
                fields: [
                    { name: 'Deactivate Depth', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Duration Variance', type: 'float', value: 0, min: 0, max: 100 }
                ]
            },{
                label: 'Title Transition',
                fields: [
                    { name: 'Title Spring Damping', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Title Spring Period', type: 'float', value: 0, min: 0, max: 100 }
                ]
            },{
                label: 'Tag Transition',
                fields: [
                    { name: 'Tag Spring Damping', type: 'float', value: 0, min: 0, max: 100 },
                    { name: 'Tag Spring Period', type: 'float', value: 0, min: 0, max: 100 }
                ]
            }]
        },
        isOpen: false,
        openCloseCurve: 'inOutElastic',
        openCloseDuration: 1000,
        offsetPosition: [0, 100],
        panelAlign: 'left',
        panelFullOpacity: 0.8,
        panelOpenness: 0.0,
        panelStyle: { 'background-color': 'black', 'overflow-y': 'scroll', 'overflow-x': 'hidden' },
        panelWidth: 300 
    },

    tree: `
        <node id="panel-container">
            <node id="toggle-button">
                <img src="{{BASE_URL}}assets/plus.svg" style="width: 100%; height: 100%;">
            </node>
            <node id="panel">
                <node id="panel-content"></node>
            </node>
        </node>
    `
})
.config({
    includes: ['assets/style.css']
});
