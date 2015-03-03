'use strict';

var test = require('tape');
var path = require('path');

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
    playfulnessLevel: 8.8
  }

  var globalObserverFlag = false;
  var ageObserverFlag = false;

  var globalObserver = function (key, value) {
    globalObserverFlag = true;
  }

  var SM = new StateManager(dogState, globalObserver);

  console.log('GETTER');
  t.equal(SM.getState('age'), 4, 'should get state');
  t.equal(SM.getState('breed'), 'Yorkshire Terrier', 'should get state');
  t.equal(SM.getState('isSleeping'), false, 'should get state');
  t.equal(SM.getState('isHungry'), true, 'should get state');

  console.log('SETTER');
  SM.setState('isSleeping', true);
  t.equal(SM.getState('isSleeping'), true, 'should set state');


  console.log('SUBSCRIBE');
  var ageObserver = function(key, value) {
    ageObserverFlag = true;
  }
  SM.subscribeTo('age', ageObserver);
  t.equal(SM._observers['age'][0], globalObserver, 'should add global observer to list of observers');
  t.equal(SM._observers['age'][1], ageObserver, 'should add subscribed observers to list of observers');

  console.log('OBSERVER');
  SM.setState('age', 5);
  t.equal(globalObserverFlag, true, 'should invoke global observer');
  t.equal(ageObserverFlag, true, 'should invoke subscribed observer');
  t.equal(SM._observerExists('age', ageObserver), true, 'should return when an observer exists for a given state field');
  t.equal(SM._observerExists('breed', ageObserver), false, 'should return false when an observer does not exist for a given state field');

  console.log('OPERATION');
  SM.get('age').add(1);
  t.equal(SM.getState('age'), 6, 'should be able to add');
  SM.get('age').subtract(1);
  t.equal(SM.getState('age'), 5, 'should be able to subtract');
  SM.get('age').multiply(2);
  t.equal(SM.getState('age'), 10, 'should be able to nultiply');
  SM.get('age').timesPI();
  t.equal(SM.getState('age'), 10 * Math.PI, 'should be able to multiply by PI');
  SM.get('age').divide(2 * Math.PI);
  t.equal(SM.getState('age'), 5, 'should be able to divide');
  SM.get('age').pow(2);
  t.equal(SM.getState('age'), 25, 'should be able to perform exponents');
  SM.get('age').sqrt();
  t.equal(SM.getState('age'), 5, 'should be able to perform square root');
  SM.get('age').multiply(-1);
  SM.get('age').abs();
  t.equal(SM.getState('age'), 5, 'should be able to take absolute value');
  SM.get('age').sin();
  t.equal(SM.getState('age'), Math.sin(5), 'should be able to perform sine');
  SM.get('age').cos();
  t.equal(SM.getState('age'), Math.cos(Math.sin(5)), 'should be able to perform cosine');
  SM.get('age').tan();
  t.equal(SM.getState('age'), Math.tan(Math.cos(Math.sin(5))), 'should be able to perform tangent');
  SM.get('playfulnessLevel').ceil();
  t.equal(SM.getState('playfulnessLevel'), 8, 'should be able to round up');
  SM.get('cutenessLevel').floor();
  t.equal(SM.getState('cutenessLevel'), 8, 'should be able to round down');
  SM.get('name').concat('Yorkie');
  t.equal(SM.getState('name'), 'YorkieYorkie', 'should be able to concatenate strings');
  SM.get('name').substring([0, 6]);
  t.equal(SM.getState('name'), 'Yorkie', 'should be able to substring');
  SM.get('name').toUpper();
  t.equal(SM.getState('name'), 'YORKIE', 'should be able to set uppercase');
  SM.get('name').toLower();
  t.equal(SM.getState('name'), 'yorkie', 'should be able to set lowercase');
  SM.get('isHungry').flip();
  t.equal(SM.getState('isHungry'), false, 'should be able to flip boolean');
  SM.get('isHungry').toInt();
  t.equal(SM.getState('isHungry'), 0, 'should be able to convert boolean to integer')
  SM.addOperator('triple', function (a) { return 3 * a });
  SM.get('cutenessLevel').triple();
  t.equal(SM.getState('cutenessLevel'), 24, 'should be able to add custom operators');

  console.log('CHAINING');
  SM.get('cutenessLevel')
    .multiply(374)
    .add(25)
    .triple()
    .divide(3);
  t.equal(SM.getState('cutenessLevel'), 9001, 'should be able to chain operations');

  t.end();
});
