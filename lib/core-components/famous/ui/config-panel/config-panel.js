function getFormattedValue(meta, value) {
    switch (meta.type) {
        case 'float': return parseFloat(value);
        case 'int': return parseInt(value);
        case 'string': return value + '';
    }
}

function buildLabel(label) {
    return `<label class="famous-ui__config-panel__group-label">${label}</label>`;
}

function buildField(group, field) {
    if (field.range) {
        if (field.type === 'int') {
            return `
                <input class="famous-ui__config-panel__control"
                    type="number"
                    value="${field.value}"
                    data-group="${group.label}"
                    data-field="${field.name}"
                    data-key="${field.key}"
                    data-type="int"
                    data-uid="${field.uid}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        }
        else {
            return `
                <input class="famous-ui__config-panel__control"
                    type="range"
                    min="${field.range[0]}"
                    max="${field.range[1]}"
                    step="${field.step || '1'}"
                    value="${field.value}"
                    data-group="${group.label}"
                    data-field="${field.name}"
                    data-key="${field.key}"
                    data-type="float"
                    data-uid="${field.uid}">
                <label class="famous-ui__config-panel__control-label">${field.name}</label>
            `;
        }
    }
    else {
        return `
            <input class="famous-ui__config-panel__control"
                type="text"
                value="${field.value}"
                data-group="${group.label}"
                data-field="${field.name}"
                data-key="${field.key}"
                data-type="string"
                data-uid="${field.uid}">
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
                margin-bottom: 10px;
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
                margin-bottom: 12px;
                margin-top: 2px;
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
            'style': {
                'background-color': 'black',
                'overflow-y': 'scroll',
                'overflow-x': 'hidden',
                'z-index': 2 // Just to be a jerk
            },
            'size': function(panelWidth) {
                return [panelWidth, undefined];
            }
        },

        '#gradient': {
            'position': function(panelOpenness, panelWidth) { return [-panelWidth + (panelWidth * panelOpenness), 0]; },
            'size': function(panelWidth, gutterSize, buttonSize) { return [panelWidth, buttonSize * 1.5 + gutterSize * 2] },
            'style': {
                'z-index': 3,
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
            'size': [undefined, undefined],
            'content': function(statesData, gutterSize, panelWidth) {
                var out = buildStyle(gutterSize, panelWidth);
                if (statesData.groups) {
                    for (var i = 0; i < statesData.groups.length; i++) {
                        var group = statesData.groups[i];
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
            'style': { 'z-index': 4, 'cursor': 'pointer' },
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
                out.value = getFormattedValue(out, $event.value);
                $dispatcher.publish('$states-configured', out);
            }
        },

        '$lifecycle': {
            'post-load': function($state, $dispatcher) {
                var statesData = $state.get('statesData');
                if (!statesData.groups) { statesData.groups = []; }
                $dispatcher.subscribe('$states-exposed', function(key, payload) {
                    for (var i = 0; i < payload.fields.length; i++) {
                        payload.fields[i].uid = payload.uid;
                    }
                    statesData.groups.push({
                        uid: payload.uid,
                        label: payload.name,
                        fields: payload.fields
                    });
                    $state.set('statesData', statesData);
                });
            }
        }
    },

    states: {
        buttonClosedRotation: 0,
        buttonOpenRotation: Math.PI / 4,
        buttonRotation: 0,
        buttonSize: 40,
        gutterSize: 20,
        statesData: {},
        isOpen: false,
        openCloseCurve: 'inOutBack',
        openCloseDuration: 1000,
        offsetPosition: [0, 0],
        panelFullOpacity: 0.8,
        panelOpenness: 0.0,
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
