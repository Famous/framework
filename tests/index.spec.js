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
  t.equal(SM.get('age'), 4);
  t.equal(SM.get('breed'), 'Yorkshire Terrier');
  t.equal(SM.get('isSleeping'), false);
  t.equal(SM.get('isHungry'), true);

  SM.set('isSleeping', true);

  console.log('SETTER');
  t.equal(SM.get('isSleeping'), true);

  var ageObserver = function(key, value) {
    ageObserverFlag = true;
  }

  console.log('SUBSCRIBE');
  SM.subscribeTo('age', ageObserver);
  t.equal(SM._observers['age'][0], globalObserver);
  t.equal(SM._observers['age'][1], ageObserver);

  console.log('OBSERVER');
  SM.set('age', 5);
  t.equal(globalObserverFlag, true);
  t.equal(ageObserverFlag, true);
  t.equal(SM._observerExists('age', ageObserver), true);
  t.equal(SM._observerExists('breed', ageObserver), false);

  console.log('OPERATION');
  SM.add('age', 1);
  t.equal(SM.get('age'), 6);
  SM.subtract('age', 1);
  t.equal(SM.get('age'), 5);
  SM.multiply('age', 2);
  t.equal(SM.get('age'), 10);
  SM.timesPI('age');
  t.equal(SM.get('age'), 10 * Math.PI);
  SM.divide('age', 2 * Math.PI);
  t.equal(SM.get('age'), 5);
  SM.pow('age', 2);
  t.equal(SM.get('age'), 25);
  SM.sqrt('age');
  t.equal(SM.get('age'), 5);
  SM.multiply('age', -1);
  SM.abs('age');
  t.equal(SM.get('age'), 5);
  SM.sin('age');
  t.equal(SM.get('age'), Math.sin(5));
  SM.cos('age');
  t.equal(SM.get('age'), Math.cos(Math.sin(5)));
  SM.tan('age');
  t.equal(SM.get('age'), Math.tan(Math.cos(Math.sin(5))));
  SM.ceil('playfulnessLevel');
  t.equal(SM.get('playfulnessLevel'), 8);
  SM.ceil('cutenessLevel');
  t.equal(SM.get('cutenessLevel'), 8);
  SM.concat('name', 'Yorkie');
  t.equal(SM.get('name'), 'YorkieYorkie');
  SM.substring('name', [0, 6]);
  t.equal(SM.get('name'), 'Yorkie');
  SM.toUpper('name');
  t.equal(SM.get('name'), 'YORKIE');
  SM.toLower('name');
  t.equal(SM.get('name'), 'yorkie');
  SM.flip('isHungry');
  t.equal(SM.get('isHungry'), false);
  SM.toInt('isHungry');
  SM.addOperator('triple', function (a) { return 3 * a });
  SM.operate('cutenessLevel', null, 'triple');
  t.equal(SM.get('cutenessLevel'), 24);

  t.end();
});
