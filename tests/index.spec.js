'use strict';

var test = require('tape');
var path = require('path');

var StateManager = require('./../lib');

test('StateManager', function(t) {
  t.ok(StateManager, 'exports');

  var dogState = {
    age: 4,
    breed: 'Yorkshire Terrier',
    isSleeping: false,
    isHungry: true
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

  t.end();
});
