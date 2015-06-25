'use strict';
var test = require('tape');
var ControlFlowDataManager = require('./../../../lib/control-flow/control-flow-data-manager');
var VirtualDomStub = require('./../helpers/virtual-dom-stub');

var CONTROL_FLOW_CONSTANTS = require('./../../../lib/control-flow/control-flow-utils').CONSTANTS;
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
    t.plan(3);

    t.test('exports', function(st) {
        st.plan(7);
        st.ok(ControlFlowDataManager, 'ControlFlowDataManager exports');
        var controlFlowDataMgnr = new ControlFlowDataManager();
        st.ok(controlFlowDataMgnr, 'ControlFlowDataManager can be instantiated');
        st.ok(controlFlowDataMgnr.getIfBehaviors, 'controlFlowDataManager.getIfBehaviors exists');
        st.ok(controlFlowDataMgnr.getRepeatBehaviors, 'controlFlowDataManager.getRepeatBehaviors exists');
        st.ok(controlFlowDataMgnr.getYieldBehaviors, 'controlFlowDataManager.getYieldBehaviors exists');
        st.ok(controlFlowDataMgnr.getIfData, 'controlFlowDataManager.getIfData exists');
        st.ok(controlFlowDataMgnr.getRepeatData, 'controlFlowDataManager.getRepeatData exists');
    });

    t.test('correctly parses behavior list into categories (if / repeat / yield)', function(st) {
        st.plan(3);
        var controlFlowDataMgnr = new ControlFlowDataManager(MOCK_BEHAVIOR_LIST);

        var ifBehaviors = controlFlowDataMgnr.getIfBehaviors();
        st.ok(ifBehaviors.length === 2 && ifBehaviors[0].selector === '#if', 'if behaviors registered');

        var repeatBehaviors = controlFlowDataMgnr.getRepeatBehaviors();
        st.ok(repeatBehaviors.length === 1 && repeatBehaviors[0].selector === '#repeat', 'repeat behaviors registered');

        var yieldBehaviors = controlFlowDataMgnr.getYieldBehaviors();
        st.ok(yieldBehaviors.length === 1 && yieldBehaviors[0].selector === '#yield', 'yield behaviors registered');
    });


    /*
    Virtual DOM Stub One:

    wrapper
        parent:element#PARENT
            child:element.FIRST_CHILD(uid=0)
                grandchild:element
                    greatgrandchild:element
            child:element(uid=1)
                grandchild:element
            child:element(uid=2)
                grandchild:element
            child:element(uid=3)
            child:element(uid=4)
            child:element(uid=5)
     */

    t.test('initializes data for if behavior', function(st) {
        st.plan(4);

        var controlFlowDataMgnr = new ControlFlowDataManager();
        var ifData = controlFlowDataMgnr.getIfData();
        st.equal(Object.keys(ifData).length, 0, 'ifData object is initially empty');

        var blueprint = VirtualDomStub.getStubOne();
        var selector = 'grandchild:element';
        var payload = true;
        controlFlowDataMgnr.initializeDataForIfBehavior(selector, payload, blueprint);

        st.ok(ifData[selector], 'attaches data object using selector');
        st.equal(ifData[selector].payload, payload, 'payload of data object matches passed in payload');
        st.ok(
            ifData[selector].parentUIDs[0] && ifData[selector].parentUIDs[1] && ifData[selector].parentUIDs[2],
            'parent uids of data object match the parent uids found by querying blueprint with selector'
        );
    });
});
