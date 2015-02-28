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
  t.equal(SM.getState('age'), 4);
  t.equal(SM.getState('breed'), 'Yorkshire Terrier');
  t.equal(SM.getState('isSleeping'), false);
  t.equal(SM.getState('isHungry'), true);

  console.log('SETTER');
  SM.setState('isSleeping', true);
  t.equal(SM.getState('isSleeping'), true);


  console.log('SUBSCRIBE');
  var ageObserver = function(key, value) {
    ageObserverFlag = true;
  }
  SM.subscribeTo('age', ageObserver);
  t.equal(SM._observers['age'][0], globalObserver);
  t.equal(SM._observers['age'][1], ageObserver);

  console.log('OBSERVER');
  SM.setState('age', 5);
  t.equal(globalObserverFlag, true);
  t.equal(ageObserverFlag, true);
  t.equal(SM._observerExists('age', ageObserver), true);
  t.equal(SM._observerExists('breed', ageObserver), false);

  console.log('OPERATION');
  SM.get('age').add(1);
  t.equal(SM.getState('age'), 6);
  SM.get('age').subtract(1);
  t.equal(SM.getState('age'), 5);
  SM.get('age').multiply(2);
  t.equal(SM.getState('age'), 10);
  SM.get('age').timesPI();
  t.equal(SM.getState('age'), 10 * Math.PI);
  SM.get('age').divide(2 * Math.PI);
  t.equal(SM.getState('age'), 5);
  SM.get('age').pow(2);
  t.equal(SM.getState('age'), 25);
  SM.get('age').sqrt();
  t.equal(SM.getState('age'), 5);
  SM.get('age').multiply(-1);
  SM.get('age').abs();
  t.equal(SM.getState('age'), 5);
  SM.get('age').sin();
  t.equal(SM.getState('age'), Math.sin(5));
  SM.get('age').cos();
  t.equal(SM.getState('age'), Math.cos(Math.sin(5)));
  SM.get('age').tan();
  t.equal(SM.getState('age'), Math.tan(Math.cos(Math.sin(5))));
  SM.get('playfulnessLevel').ceil();
  t.equal(SM.getState('playfulnessLevel'), 8);
  SM.get('cutenessLevel').floor();
  t.equal(SM.getState('cutenessLevel'), 8);
  SM.get('name').concat('Yorkie');
  t.equal(SM.getState('name'), 'YorkieYorkie');
  SM.get('name').substring([0, 6]);
  t.equal(SM.getState('name'), 'Yorkie');
  SM.get('name').toUpper();
  t.equal(SM.getState('name'), 'YORKIE');
  SM.get('name').toLower();
  t.equal(SM.getState('name'), 'yorkie');
  SM.get('isHungry').flip();
  t.equal(SM.getState('isHungry'), false);
  SM.get('isHungry').toInt();
  t.equal(SM.getState('isHungry'), 0)
  SM.addOperator('triple', function (a) { return 3 * a });
  SM.get('cutenessLevel').operate(null, 'triple');
  t.equal(SM.getState('cutenessLevel'), 24);

  console.log('CHAINING');
  SM.get('cutenessLevel').multiply(374).add(25);
  t.equal(SM.getState('cutenessLevel'), 9001);;

  t.end();
});
