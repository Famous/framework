'use strict';

var test = require('tape');
var Famous = require('famous').core.FamousEngine;
var Transitionable = require('famous').transitions.Transitionable;

var StateManager = require('./../lib');

test('StateManager', function(t) {
  t.ok(StateManager, 'exports');

  var dogState = {
    age: 4,
    name: 'Yorkie',
    breed: 'Yorkshire Terrier',
    isSleeping: false,
    isHungry: true,
    cutenessLevel: 8.1,
    playfulnessLevel: 8.8,
    size: [100, 200, 300],
    points: 10,
    fluffiness: 10
  };

  var SM = new StateManager(dogState, Famous, Transitionable);

  console.log('GETTER');
  t.equal(SM.getState('age'), 4, 'should get state');
  t.equal(SM.getState('breed'), 'Yorkshire Terrier', 'should get state');
  t.equal(SM.getState('isSleeping'), false, 'should get state');
  t.equal(SM.getState('isHungry'), true, 'should get state');

  console.log('SETTER');
  SM.setState('isSleeping', true);
  t.equal(SM.getState('isSleeping'), true, 'should set state');

  console.log('LATEST STATE CHANGE');
  SM.setState('age', SM.get('age'));
  var latest = SM.getLatestStateChange();
  var stateKey = Object.keys(latest);
  t.true(stateKey.length === 1 && stateKey[0] === 'age', 'should set key for latest state');
  t.equal(latest[stateKey], 4, 'should set value for latest state');

  console.log('SUBSCRIBE TO');
  var ageObserverValue;
  var ageObserverFn = function(key, value) {
    ageObserverValue = value;
  };
  SM.subscribeTo('age', ageObserverFn);
  SM.set('age', SM.get('age'));
  t.equal(ageObserverValue, 4, 'Subscribe to updates on state set');
  SM.unsubscribeFrom('age', ageObserverFn);
  SM.set('age', 10);
  t.equal(ageObserverValue, 4, 'UnsubscribeFrom stops updates on state set');
  ageObserverValue = -1;
  SM.subscribeTo('age', ageObserverFn);
  SM.set('age', SM.get('age'));
  SM.unsubscribe(ageObserverFn);
  SM.set('age', 4);
  t.equal(ageObserverValue, 10, 'Unsubrice stops updates on state set');

  console.log('GLOBAL SUBSCRIBE');
  var count = 0;
  var globalObserver = function() {
    count++;
  };
  SM.subscribe(globalObserver);
  SM.chain('points').add(10).subtract(10);
  SM.chain('age').add(2).subtract(2);
  t.equal(count, 4, 'Global observer works with state changes that are part of constructor');

  SM.set('newProperty', 8);
  t.equal(SM.get('newProperty'), 8, 'StateManager properly sets/retrieves dynamcially added state');
  t.equal(count, 5, 'Global observer works with state changes on dynamcially added properties');

  SM.unsubscribe(globalObserver);
  SM.set('newProperty', 10);
  t.equal(count, 5, 'Global observer properly unsubscribes');

  console.log('ONCE SUBSCRIBE');
  var onceValue = 0;
  var once = function() {
    onceValue++;
  };
  SM.subscribeOnce(once);
  SM.triggerGlobalChange();
  t.equal(onceValue, 1, 'subscribeOnce should trigger on first triggerGlobalChange');
  SM.triggerGlobalChange();
  t.equal(onceValue, 1, 'subscribeOnce should not trigger on subsequent triggerGlobalChange');

  console.log('OPERATION');
  SM.setState('age', 5);
  SM.chain('age').add(1);
  t.equal(SM.getState('age'), 6, 'should be able to add');
  SM.chain('age').subtract(1);
  t.equal(SM.getState('age'), 5, 'should be able to subtract');
  SM.chain('age').multiply(2);
  t.equal(SM.getState('age'), 10, 'should be able to nultiply');
  SM.chain('age').timesPI();
  t.equal(SM.getState('age'), 10 * Math.PI, 'should be able to multiply by PI');
  SM.chain('age').divide(2 * Math.PI);
  t.equal(SM.getState('age'), 5, 'should be able to divide');
  SM.chain('age').pow(2);
  t.equal(SM.getState('age'), 25, 'should be able to perform exponents');
  SM.chain('age').sqrt();
  t.equal(SM.getState('age'), 5, 'should be able to perform square root');
  SM.chain('age').multiply(-1);
  SM.chain('age').abs();
  t.equal(SM.getState('age'), 5, 'should be able to take absolute value');
  SM.chain('age').sin();
  t.equal(SM.getState('age'), Math.sin(5), 'should be able to perform sine');
  SM.chain('age').cos();
  t.equal(SM.getState('age'), Math.cos(Math.sin(5)), 'should be able to perform cosine');
  SM.chain('age').tan();
  t.equal(SM.getState('age'), Math.tan(Math.cos(Math.sin(5))), 'should be able to perform tangent');
  SM.chain('playfulnessLevel').ceil();
  t.equal(SM.getState('playfulnessLevel'), 9, 'should be able to round up');
  SM.chain('cutenessLevel').floor();
  t.equal(SM.getState('cutenessLevel'), 8, 'should be able to round down');
  SM.chain('name').concat('Yorkie');
  t.equal(SM.getState('name'), 'YorkieYorkie', 'should be able to concatenate strings');
  SM.chain('name').substring([0, 6]);
  t.equal(SM.getState('name'), 'Yorkie', 'should be able to substring');
  SM.chain('name').toUpper();
  t.equal(SM.getState('name'), 'YORKIE', 'should be able to set uppercase');
  SM.chain('name').toLower();
  t.equal(SM.getState('name'), 'yorkie', 'should be able to set lowercase');
  SM.chain('isHungry').flip();
  t.equal(SM.getState('isHungry'), false, 'should be able to flip boolean');
  SM.chain('isHungry').toInt();
  t.equal(SM.getState('isHungry'), 0, 'should be able to convert boolean to integer');

  t.test('Should work with arrays', function(st) {
    st.test('Array: Should retrieve values', function(stt){
      stt.plan(3);
      stt.equal(SM.getState('size')[0], 100);
      stt.equal(SM.getState('size')[1], 200);
      stt.equal(SM.getState('size')[2], 300);
    });

    st.test('Array: Should operate with constant', function(stt){
      stt.plan(3);
      SM.chain('size').add(5);
      stt.equal(SM.getState('size')[0], 105);
      stt.equal(SM.getState('size')[1], 205);
      stt.equal(SM.getState('size')[2], 305);
      SM.chain('size').subtract(5);
    });

    st.test('Array: Should operate with array', function(stt){
      stt.plan(3);
      SM.chain('size').add([5]);
      stt.equal(SM.getState('size')[0], 105);
      stt.equal(SM.getState('size')[1], 200);
      stt.equal(SM.getState('size')[2], 300);
      SM.chain('size').subtract(5);
    });

    st.end();
  });

  console.log('ADDING A CUSTOM OPERATOR');
  SM.addOperator('triple', function (a) {
    return 3 * a;
  });
  SM.chain('cutenessLevel').triple();
  t.equal(SM.getState('cutenessLevel'), 24, 'should be able to add custom operators');

  SM.addOperator('addThenMultiplyBy2', function (a, b) {
    return (a + b) * 2;
  });
  SM.chain('points').addThenMultiplyBy2(5);
  t.equal(SM.getState('points'), 30, 'should be able to add multiple operators (1/2)');
  SM.chain('points').triple();
  t.equal(SM.getState('points'), 90, 'should be able to add multiple operators (2/2)');


  console.log('CHAINING');
  SM.chain('cutenessLevel')
    .multiply(2) //48
    .add(25) // 73
    .triple() // 219
    .multiply(3)
    .divide(3);
  t.equal(SM.getState('cutenessLevel'), 219, 'should be able to chain operations');

  //console.log('THROWS ERROR ON NON-STANDARD INPUTS');
  //t.test('Should check for invalid inputs', function(st){
  //  st.plan(1);
  //
  //  try {
  //    SM.chain('cutenessLevel').add([1, 2]);
  //    st.end();
  //  }
  //  catch(err) {
  //    st.ok(err, 'Caught error attempting to add array to integer');
  //    st.end();
  //  }
  //});

  t.end();
});
