'use strict';

var test = require('tape');
var famous = require('famous');
var Node = famous.core.Node;
var Transitionable = famous.transitions.Transitionable;

var StateManager = require('./../../lib/state-manager/state-manager');

var fixtures = require('./fixtures');
var clone = fixtures.clone;
var _state = fixtures.state;
var _observerState = fixtures.observerState;

var FamousNode = new Node();

test('StateManager', function(t) {

    t.test('constructor', function(t) {
        t.equal(typeof StateManager, 'function', 'should be a function');

        t.doesNotThrow(function() {
            new StateManager(clone(_state), FamousNode, Transitionable);
        });

        t.ok(StateManager, 'should export');

        t.end();
    });

    t.test('getting state #1 - get', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        t.equal(SM.get('number'), 1, 'should get number state');
        t.equal(SM.get('string'), 'two', 'should get string state');
        t.deepEqual(SM.get('array'), [3, 3, 3], 'should get array state');
        t.equal(SM.get('boolean'), true, 'should get boolean state');


        t.equal(SM.get([
            'nestedState',
                'moreNesting',
                    'nestingArray',
                        1
        ]), 2, 'should get nested state');

        t.end();
    });

    t.test('getting state #2 - getStateObject', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        t.deepEqual(SM.getStateObject(), _state, 'should get entire state object');

        t.end();
    });

    t.test('getting state #3 - latestStateChange', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM.set('number', 2);
        t.deepEqual(SM.getLatestStateChange(), ['number', 2], 'should get last state that was set and value');

        t.end();
    });

    t.test('setting state #1 - set(value)', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM.set('number', 2);
        SM.set('string', 'three');
        SM.set('array', [4, 4, 4]);
        SM.set('boolean', false);
        SM.set(['nestedState', 'moreNesting', 'nestingArray', 1], 3);

        t.equal(SM.get('number'), 2, 'should set number state');
        t.equal(SM.get('string'), 'three', 'should set string state');
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should set array state');
        t.equal(SM.get('boolean'), false, 'should set boolean state');

        t.equal(SM.get([
            'nestedState',
                'moreNesting',
                    'nestingArray',
                        1
        ]), 3, 'should set nested state');

        t.end();
    });

    t.test('setting state #2 - set(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM.set('number', 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0.5, 'should tween number state');

        time = 0;
        SM.set('array', [5, 5, 5], { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state');

        time = 0;
        SM.set(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state');

        t.end();
    });

    t.test('setting state #3 - set(value).set(value).set(value)', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM
            .set('number', 2)
            .set('string', 'three')
            .set('array', [4, 4, 4])
            .set('boolean', false)
            .set(['nestedState', 'moreNesting', 'nestingArray', 1], 3);

        t.equal(SM.get('number'), 2, 'should set number state');
        t.equal(SM.get('string'), 'three', 'should set string state');
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should set array state');
        t.equal(SM.get('boolean'), false, 'should set boolean state');

        t.equal(SM.get([
            'nestedState',
                'moreNesting',
                    'nestingArray',
                        1
        ]), 3, 'should set nested state');

        t.end();
    });

    t.test('setting state #4 - set(transition).set(transition).set(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0, { duration: 1000 })
            .set('array', [5, 5, 5], { duration: 1000 })
            .set(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0.5, 'should tween number state');
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state');
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state');

        t.end();
    });

    t.test('setting state #5 - set(value).set(transition).set(value)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0)
            .set('array', [5, 5, 5], { duration: 1000 })
            .set(['nestedState', 'moreNesting', 'nestingArray', 0], 0);
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0, 'should set number state');
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state');
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0, 'should set nested state');

        t.end();
    });

    t.test('setting state #6 - set(transition).thenSet(transition).thenSet(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0, { duration: 1000 })
            .thenSet('array', [5, 5, 5], { duration: 1000 })
            .thenSet(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0.5);
        time = 1000;
        SM.onUpdate();
        t.equal(SM.get('number'), 0);
        time = 1500;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state after tweening number state');
        time = 2000;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [5, 5, 5]);
        time = 2500;
        SM.onUpdate();
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state after tweening number state');

        t.end();
    });

    t.test('setting state #7 - set(transition).set(transition).thenSet(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0, { duration: 1000 })
            .set('array', [5, 5, 5], { duration: 1000 })
            .thenSet(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0.5);
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state while tweening number state');
        time = 1000;
        SM.onUpdate();
        t.equal(SM.get('number'), 0);
        t.deepEqual(SM.get('array'), [5, 5, 5]);
        time = 1500;
        SM.onUpdate();
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state after tweening array state');

        t.end();
    });

    t.test('setting state #8 - set(value).set(transition).thenSet(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0)
            .set('array', [5, 5, 5], { duration: 1000 })
            .thenSet(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0);
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state while setting number state');
        time = 1000;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [5, 5, 5]);
        time = 1500;
        SM.onUpdate();
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state after tweening array state');

        t.end();
    });

    t.test('setting state #9 - set(value).thenSet(transition).thenSet(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0)
            .thenSet('array', [5, 5, 5], { duration: 1000 })
            .thenSet(['nestedState', 'moreNesting', 'nestingArray', 0], 0, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0);
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state while setting number state');
        time = 1000;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [5, 5, 5]);
        time = 1500;
        SM.onUpdate();
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0.5, 'should tween nested state after tweening array state');

        t.end();
    });

    t.test('setting state #10 - set(value).thenSet(transition).thenSet(value)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0)
            .thenSet('array', [5, 5, 5], { duration: 1000 })
            .thenSet(['nestedState', 'moreNesting', 'nestingArray', 0], 0);
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 0);
        t.deepEqual(SM.get('array'), [4, 4, 4], 'should tween array state while setting number state');
        time = 1000;
        SM.onUpdate();
        t.deepEqual(SM.get('array'), [5, 5, 5]);
        t.equal(SM.get(['nestedState', 'moreNesting', 'nestingArray', 0]), 0, 'should tween nested state after tweening array state');

        t.end();
    });

    t.test('setting state #11 - same state set(value).set(value).set(value)', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM
            .set('number', 0)
            .set('number', 1)
            .set('number', 2)
            .set('number', 3);

        t.equal(SM.get('number'), 3, 'should override state');

        t.end();
    });

    t.test('setting state #12 - same state set(transition).set(transition).set(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        time = 0;
        SM
            .set('number', 0, { duration: 1000 })
            .set('number', 1, { duration: 1000 })
            .set('number', 2, { duration: 1000 })
            .set('number', 3, { duration: 1000 });
        SM.onUpdate();
        t.equal(SM.get('number'), 1);
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('number'), 2, 'should override state transition');
        time = 1000;
        SM.onUpdate();
        t.equal(SM.get('number'), 3);

        t.end();
    });

    t.test('setting state #13 - simultaneous set(transition).thenSet(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM
            .set('w', 0)
            .set('x', 0)
            .set('y', 0)
            .set('z', 0);

        time = 0;
        SM
            .set('w', 1, { duration: 1000 })
            .thenSet('x', 1, { duration: 1000 });

        SM
            .set('y', 1, { duration: 500 })
            .thenSet('z', 1, { duration: 1000 });

        time = 500;
        SM.onUpdate();
        t.equal(SM.get('w'), 0.5);
        t.equal(SM.get('y'), 1);
        time = 1000;
        SM.onUpdate();
        t.equal(SM.get('w'), 1);
        t.equal(SM.get('z'), 0.5, 'should transition z');
        time = 1500;
        SM.onUpdate();
        t.equal(SM.get('z'), 1);
        t.equal(SM.get('x'), 0.5, 'should transition x');

        t.end();
    });

    t.test('setting state #14 - state batching set(value)', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM.set({
            'x': 0,
            'y': 0,
            'z': 0
        });

        t.equal(SM.get('x'), 0, 'should set x');
        t.equal(SM.get('y'), 0, 'should set y');
        t.equal(SM.get('z'), 0, 'should set z');

        t.end();
    });

    t.test('setting state #15 - state batching set(transition)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM.set({
            'x': 0,
            'y': 0,
            'z': 0
        });

        t.equal(SM.get('x'), 0);
        t.equal(SM.get('y'), 0);
        t.equal(SM.get('z'), 0);

        time = 0;
        SM.set({
            'x': 1,
            'y': 1,
            'z': 1
        }, { duration: 1000 });
        time = 500;
        SM.onUpdate();
        t.equal(SM.get('x'), 0.5, 'should tween x');
        t.equal(SM.get('y'), 0.5, 'should tween y');
        t.equal(SM.get('z'), 0.5, 'should tween z');

        t.end();
    });

    t.test('setting state #16 - state batching set(transition).thenSet(value).thenSet(value).thenSet(value)', function(t) {
        var time = 0;

        Transitionable.Clock = {
            now: function() {
                return time;
            }
        };

        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        SM.set({
            'x': 0,
            'y': 0,
            'z': 0
        });

        SM.set({
            'a': 0,
            'b': 0,
            'c': 0
        });

        t.equal(SM.get('x'), 0);
        t.equal(SM.get('y'), 0);
        t.equal(SM.get('z'), 0);

        t.equal(SM.get('a'), 0);
        t.equal(SM.get('b'), 0);
        t.equal(SM.get('c'), 0);

        time = 0;
        SM.set({
            'x': 1,
            'y': 1,
            'z': 1
        }, { duration: 1000 })
        .thenSet('a', 1, { duration: 1000 })
        .thenSet('a', 2, { duration: 1000 })
        .thenSet('a', 3, { duration: 1000 });

        time = 500;
        SM.onUpdate();
        t.equal(SM.get('x'), 0.5, 'should tween x');
        t.equal(SM.get('y'), 0.5, 'should tween y');
        t.equal(SM.get('z'), 0.5, 'should tween z');

        time = 1000;
        SM.onUpdate();
        t.equal(SM.get('x'), 1, 'should tween x');
        t.equal(SM.get('y'), 1, 'should tween y');
        t.equal(SM.get('z'), 1, 'should tween z');

        time = 2000;
        SM.onUpdate();
        t.equal(SM.get('a'), 1, 'should tween a');

        time = 3000;
        SM.onUpdate();
        t.equal(SM.get('a'), 2, 'should chain tween a');

        time = 4000;
        SM.onUpdate();
        t.equal(SM.get('a'), 3, 'should chain tween a again');

        t.end();
    });

    t.test('subscribing to state #1 - subscribeTo', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        var observerState = clone(_observerState);
        var observerFunc = function(key, value) {
            if (observerState.hasFired) {
                observerState.hasFiredMoreThanOnce = true;
            }
            observerState.hasFired = true;
            observerState.args.push(key, value);
        };

        SM.subscribeTo('number', observerFunc);
        SM.set('number', 0);
        t.ok(observerState.hasFired, 'should fire observer on state change');
        t.deepEqual(observerState.args, ['number', 0], 'should receive arguments of state change');

        t.end();
    });

    t.test('subscribing to state #2 - subscribe', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        var observerState = clone(_observerState);
        var globalObserverFunc = function(key, value) {
            if (observerState.hasFired) {
                observerState.hasFiredMoreThanOnce = true;
            }
            observerState.hasFired = true;
            observerState.args.push(key, value);
        };

        SM.subscribe(globalObserverFunc);
        SM.set('number', 0);
        SM.set('string', 'three');
        t.ok(observerState.hasFired, 'should fire observer on state change');
        t.ok(observerState.hasFiredMoreThanOnce, 'should fire observer on every state change');

        t.end();
    });

    t.test('subscribing to state #3 - subscribeOnce + triggerGlobalChange', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        var observerState = clone(_observerState);
        var observerFunc = function(key, value) {
            if (observerState.hasFired) {
                observerState.hasFiredMoreThanOnce = true;
            }
            observerState.hasFired = true;
            observerState.args.push(key, value);
        };

        SM.subscribeOnce(observerFunc);
        SM.set('number', 0);
        SM.triggerGlobalChange();
        t.ok(observerState.hasFired, 'should fire observer on first state change');
        SM.set('string', 'three');
        t.ok(!observerState.hasFiredMoreThanOnce, 'should not fire observer on subsequent state change');

        t.end();
    });

    t.test('unsubscribing from state #1 - unsubscribeFrom', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        var observerState = clone(_observerState);
        var observerFunc = function(key, value) {
            if (observerState.hasFired) {
                observerState.hasFiredMoreThanOnce = true;
            }
            observerState.hasFired = true;
            observerState.args.push(key, value);
        };

        SM.subscribeTo('number', observerFunc);
        SM.set('number', 0);
        t.ok(observerState.hasFired, 'should be true');

        SM.unsubscribeFrom('number', observerFunc);
        SM.set('number', 1);
        t.ok(!observerState.hasFiredMoreThanOnce, 'should not fire observer once unsubscribed');

        t.end();
    });

    t.test('unsubscribing from state #2 - unsubscribe', function(t) {
        var SM = new StateManager(clone(_state), FamousNode, Transitionable);

        var observerState = clone(_observerState);
        var observerFunc = function(key, value) {
            if (observerState.hasFired) {
                observerState.hasFiredMoreThanOnce = true;
            }
            observerState.hasFired = true;
            observerState.args.push(key, value);
        };

        SM.subscribe(observerFunc);
        SM.set('number', 0);
        t.ok(observerState.hasFired, 'should be true');

        SM.unsubscribe(observerFunc);
        SM.set('number', 1);
        t.ok(!observerState.hasFiredMoreThanOnce, 'should not fire observer once unsubscribed');

        t.end();
    });

    t.end();
});
