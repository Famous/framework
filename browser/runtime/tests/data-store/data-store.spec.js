'use strict';

var test = require('tape');
var DataStore = require('../../lib/data-store/data-store');

test('----- DataStore', function(t) {
    t.plan(3);

    t.test('Registers/Retrieves modules', function(st){
        st.plan(1);
        var name = 'test:module';
        var tag = 'HEAD';
        var definition = {a: 1};
        DataStore.registerModule(name, tag, definition);
        var retrievedModule = DataStore.getModule(name, tag);
        st.ok(retrievedModule.a === definition.a, 'registers and retrieves modules');
    });

    t.test('Saves/Retrieves executed components', function(st){
        st.plan(1);
        var component = {};
        DataStore.saveExecutedComponent('body', component);
        var retrievedComponent = DataStore.getExecutedComponent('body');
        st.ok(component === retrievedComponent, 'saved & retrieved component are equal');
    });
    
    t.test('Registers components', function(st) {
        st.plan(2);
        var component = {};
        var uid = 'uid';
        DataStore.registerComponent(uid, component);
        var retrievedComponent = DataStore.getComponent(uid);
        st.ok(component === retrievedComponent, 'saved & retrieved component are equal');

        var component2 = {};
        try {
            DataStore.registerComponent(uid, component2);
        }
        catch (e) {
            st.pass('Does not save component w/ already registered UID');
        }
    });
});
