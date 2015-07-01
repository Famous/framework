function buildLabel(label) {
    return `<label class="famous-ui__config-panel__group-label">${label}</label>`;
}

function buildField(group, field) {
    switch (field.type) {
        case 'float':
            return `
                <input class="famous-ui__config-panel__control" type="range" min="${field.min}" max="${field.max}" value="${field.value}" step="${field.max / 1000.0}" data-group="${group.label}" data-field="${field.name}" data-key="${field.key}" data-type="${field.type}" data-uid="${field.uid}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        case 'int':
            return `
                <input class="famous-ui__config-panel__control" type="number" min="${field.min}" max="${field.max}" value="${field.value}" data-group="${group.label}" data-field="${field.name}" data-key="${field.key}" data-type="${field.type}" data-uid="${field.uid}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        case 'string':
            return `
                <input class="famous-ui__config-panel__control" type="text" value="${field.value}" data-group="${group.label}" data-field="${field.name}" data-key="${field.key}" data-type="${field.type}" data-uid="${field.uid}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
    }
}

function buildStyle(gutterSize, panelWidth) {
    return `
        <style type="text/css">
            .famous-ui__config-panel__group {
                margin-bottom: ${gutterSize}px;
            }

            .famous-ui__config-panel__group-label {
                display: block;
                font-family: 'Helvetica Neue', Helvetica, sans-serif;
                font-weight: 200;
                overflow: hidden;
                padding-bottom: 5px;
                text-decoration: underline;
                text-overflow: ellipsis;
                text-transform: uppercase;
                white-space: nowrap;
                width: ${panelWidth - gutterSize * 2}px;
            }

            .famous-ui__config-panel__control-label {
                display: block;
                font-family: 'Helvetica Neue', Helvetica, sans-serif;
                font-size: 0.8em;
                font-weight: 200;
                margin-bottom: 10px;
                margin-top: 5px;
            }

            .famous-ui__config-panel__control {
                box-sizing: border-box;
                display: block;
                outline: none;
                width: ${panelWidth - gutterSize * 2}px;
            }
        </style>
    `;
}

FamousFramework.component('famous:ui:config-panel', {
    behaviors: {
        '#panel-container': {
            'position': function(offsetPosition) { return offsetPosition; }
        },

        '#panel': {
            'opacity': function(panelOpenness, panelFullOpacity, isPanelHovered) { return panelFullOpacity * panelOpenness; },
            'position': function(panelOpenness, panelWidth) { return [-panelWidth + (panelWidth * panelOpenness), 0]; },
            'style': function(panelStyle) { return panelStyle; },
            'size': function(panelWidth, panelOpenness) {
                if (panelOpenness >= 1.0) {
                    return [panelWidth, undefined];
                }
                else {
                    return [panelWidth, window.innerHeight * panelOpenness];
                }
            }
        },

        '#gradient': {
            'position': function(panelOpenness, panelWidth) { return [-panelWidth + (panelWidth * panelOpenness), 0]; },
            'size': function(panelWidth, gutterSize, buttonSize) { return [panelWidth, buttonSize * 1.5 + gutterSize * 2] },
            'style': {
                'z-index': 2,
                'background': 'linear-gradient(to bottom, rgba(0, 0, 0, 1),  rgba(0, 0, 0, 0))'
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
            'size': [undefined, true],
            'content': function(data, gutterSize, panelWidth) {
                var out = buildStyle(gutterSize, panelWidth);
                if (data.groups) {
                    for (var i = 0; i < data.groups.length; i++) {
                        var group = data.groups[i];
                        out = out.concat('<div class="famous-ui__config-panel__group">');
                        out = out.concat(buildLabel(group.label));
                        for (var j = 0; j < group.fields.length; j++) {
                            out = out.concat(buildField(group, group.fields[j]));
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
                // Give the button some extra spin on the way back
                $state.set('buttonRotation', $state.get('buttonRotation') + Math.PI * 2);
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
            'input': function($event, $dispatcher) {
                var out = {};

                var target = $event.target;
                if (target) {
                    out.field = target.getAttribute('data-field');
                    out.key = target.getAttribute('data-key');
                    out.group = target.getAttribute('data-group');
                    out.type = target.getAttribute('data-type');
                    out.uid = target.getAttribute('data-uid');
                }

                out.value = $event.value;

                $dispatcher.emit('update', out);
            }
        }
    },

    states: {
        buttonClosedRotation: 0,
        buttonOpenRotation: Math.PI / 4,
        buttonRotation: 0,
        buttonSize: 40,
        gutterSize: 20,
        data: {},
        isOpen: false,
        openCloseCurve: 'inOutBack',
        openCloseDuration: 1000,
        offsetPosition: [0, 0],
        panelFullOpacity: 0.8,
        panelOpenness: 0.0,
        panelStyle: { 'background-color': 'black', 'overflow-y': 'scroll', 'overflow-x': 'hidden' },
        panelWidth: 300 
    },

    tree: `
        <node id="panel-container">
            <node id="gradient"></node>
            <node id="toggle-button">
                <img src="{{BASE_URL}}assets/plus.svg" style="width: 100%; height: 100%;">
            </node>
            <node id="panel">
                <node id="panel-content"></node>
            </node>
        </node>
    `
});
