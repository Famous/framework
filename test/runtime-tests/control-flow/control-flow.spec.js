'use strict';
var test = require('tape');

var Behaviors = require('./../../../lib/behaviors/behaviors');
var ControlFlow = require('./../../../lib/control-flow/control-flow');
var ControlFlowDataMngr = require('./../../../lib/control-flow/control-flow-data-manager');
var VirtualDOM = require('./../../../lib/virtual-dom/virtual-dom');
var VirtualDomStub = require('./../helpers/virtual-dom-stub');


var CONTROL_FLOW_CONSTANTS = require('./../../../lib/control-flow/control-flow-utils').CONSTANTS;
var IF_KEY = CONTROL_FLOW_CONSTANTS.IF_KEY;

test('----- Control Flow', function(t) {
    t.plan(2);

    t.test('exports', function(st) {
        st.plan(2);
        st.ok(ControlFlow, 'ControlFlow exports');
        st.ok(ControlFlow.initializeIfBehaviors, 'ControlFlow.initializeIfBehaviors exports');
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
    t.test('initializes if behaviors', function(st) {
        st.plan(5);

        var MOCK_BEHAVIOR_LIST = [
            {selector: '[uid="3"]', action: true, params: []},
            {selector: '[uid="4"]', action: false, params: []}
        ];
        MOCK_BEHAVIOR_LIST[0].name = IF_KEY;
        MOCK_BEHAVIOR_LIST[1].name = IF_KEY;

        var controlFlowDataMngr = new ControlFlowDataMngr(MOCK_BEHAVIOR_LIST);
        st.ok(controlFlowDataMngr, 'ControlFlowDataManager instantiated');

        var blueprint = VirtualDomStub.getStubOne();
        var expandedBlueprint = VirtualDOM.clone(blueprint);

        // initializeIfBehaviors has a dependency on Behaviors.getPayloadFromUID which needs to be stubbed
        // out since this particular test is not concerned with getting values from the component's State Manager
        // in order to calculat the behavior payload.
        var getPayloadFromUID = Behaviors.getPayloadFromUID;
        Behaviors.getPayloadFromUID = function (behavior, uid) {
            return behavior.action;
        };
        ControlFlow.initializeIfBehaviors(blueprint, expandedBlueprint, null, controlFlowDataMngr);

        st.ok(expandedBlueprint.querySelector('[uid="3"]'), 'dom nodes remain in expandedBlueprint if payload is true');
        st.notOk(expandedBlueprint.querySelector('[uid="4"]'), 'dom nodes removed from expandedBlueprint if payload is false');

        var ifData = controlFlowDataMngr.getIfData();
        st.equal(Object.keys(ifData).length, 2, "controlFlowDataMngr's ifData has one entry for each selector from behavior list");
        st.equal(controlFlowDataMngr.getIfPayload('[uid="4"]'), false, 'ifData has correct payload');

        // for a given selector, check that the data is in the expected state

        // Tear down test:
        // Reset stubbed out function.
        Behaviors.getPayloadFromUID = getPayloadFromUID;
    });
});
