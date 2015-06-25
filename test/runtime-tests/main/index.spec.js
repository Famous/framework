'use strict';

window.Famous = require('famous');
var test = require('tape');
var FamousFramework = require('./../../../lib');
var DataStore = require('./../../../lib/data-store/data-store');

test('----- FamousFramework', function(t) {
    t.plan(1);

    t.test('exports', function(st) {
        st.plan(4);
        st.ok(FamousFramework, 'FamousFramework exports');
        st.ok(DataStore, 'DataStore exports');
        st.ok(FamousFramework.register && FamousFramework.execute && FamousFramework.message && FamousFramework.deploy, 'FamousFramework exports register/execture/message/deploy');
        st.ok(FamousFramework.register === FamousFramework.scene && FamousFramework.register === FamousFramework.module && FamousFramework.register === FamousFramework.component, 'FamousFramework aliases `scene`/`module`/`component` to `register`.');
    });
});
