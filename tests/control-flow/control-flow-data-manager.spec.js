'use strict';
var test = require('tape');
var ControlFlowDataMngr = require('../../lib/control-flow/control-flow-data-manager');

var CONTROL_FLOW_CONSTANTS = require('../../lib/control-flow/control-flow-utils').CONSTANTS;
var IF_KEY = CONTROL_FLOW_CONSTANTS.IF_KEY;
var REPEAT_KEY = CONTROL_FLOW_CONSTANTS.REPEAT_KEY;
var YIELD_KEY = CONTROL_FLOW_CONSTANTS.YIELD_KEY;

var MOCK_BEHAVIOR_LIST = [
    {selector: '#if', action: true, params: []},
    {selector: '#if2', action: true, params: []},
    {selector: '#repeat', action: [1,2,3,4], params: ['count']},
    {selector: '#yield', action: '#header', params: []},
    {selector: '#foo', action: false, params: ['bar']}
];
MOCK_BEHAVIOR_LIST[0].name = IF_KEY;
MOCK_BEHAVIOR_LIST[1].name = IF_KEY;
MOCK_BEHAVIOR_LIST[2].name = REPEAT_KEY;
MOCK_BEHAVIOR_LIST[3].name = YIELD_KEY;
MOCK_BEHAVIOR_LIST[4].name = 'foo';

test('----- Control Flow Data Manager', function(t) {
    t.plan(2);

    t.test('exports', function(st) {
        st.plan(2);
        st.ok(ControlFlowDataMngr, 'ControlFlowDataManager exports');
        var controlFlowDataMgnr = new ControlFlowDataMngr();
        st.ok(controlFlowDataMgnr, 'ControlFlowDataManager can be instantiated');
    });

    t.test('correctly parses behavior list into categories (if / repeat / yield)', function(st) {
        st.plan(3);
        var controlFlowDataMgnr = new ControlFlowDataMngr(MOCK_BEHAVIOR_LIST);

        var ifBehaviors = controlFlowDataMgnr.getIfBehaviors();
        st.ok(ifBehaviors.length === 2 && ifBehaviors[0].selector === '#if', 'if behaviors registered');

        var repeatBehaviors = controlFlowDataMgnr.getRepeatBehaviors();
        st.ok(repeatBehaviors.length === 1 && repeatBehaviors[0].selector === '#repeat', 'repeat behaviors registered');

        var yieldBehaviors = controlFlowDataMgnr.getYieldBehaviors();
        st.ok(yieldBehaviors.length === 1 && yieldBehaviors[0].selector === '#yield', 'yield behaviors registered');
    });
});