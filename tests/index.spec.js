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
  SM.add('age', 1);
  t.equal(SM.getState('age'), 6);
  SM.subtract('age', 1);
  t.equal(SM.getState('age'), 5);
  SM.multiply('age', 2);
  t.equal(SM.getState('age'), 10);
  SM.timesPI('age');
  t.equal(SM.getState('age'), 10 * Math.PI);
  SM.divide('age', 2 * Math.PI);
  t.equal(SM.getState('age'), 5);
  SM.pow('age', 2);
  t.equal(SM.getState('age'), 25);
  SM.sqrt('age');
  t.equal(SM.getState('age'), 5);
  SM.multiply('age', -1);
  SM.abs('age');
  t.equal(SM.getState('age'), 5);
  SM.sin('age');
  t.equal(SM.getState('age'), Math.sin(5));
  SM.cos('age');
  t.equal(SM.getState('age'), Math.cos(Math.sin(5)));
  SM.tan('age');
  t.equal(SM.getState('age'), Math.tan(Math.cos(Math.sin(5))));
  SM.ceil('playfulnessLevel');
  t.equal(SM.getState('playfulnessLevel'), 8);
  SM.ceil('cutenessLevel');
  t.equal(SM.getState('cutenessLevel'), 8);
  SM.concat('name', 'Yorkie');
  t.equal(SM.getState('name'), 'YorkieYorkie');
  SM.substring('name', [0, 6]);
  t.equal(SM.getState('name'), 'Yorkie');
  SM.toUpper('name');
  t.equal(SM.getState('name'), 'YORKIE');
  SM.toLower('name');
  t.equal(SM.getState('name'), 'yorkie');
  SM.flip('isHungry');
  t.equal(SM.getState('isHungry'), false);
  SM.toInt('isHungry');
  SM.addOperator('triple', function (a) { return 3 * a });
  SM.operate('cutenessLevel', null, 'triple');
  t.equal(SM.getState('cutenessLevel'), 24);

  console.log('CHAINING');
  SM.multiply('cutenessLevel', 374).add('cutenessLevel', 25);
  t.equal(SM.getState('cutenessLevel'), 9001);;

  console.log('EASY CHAINING');
  console.log(SM.add('cutenessLevel'), 1);
  t.equal(SM.getState('cutenessLevel'), 8992);

  t.end();
});
