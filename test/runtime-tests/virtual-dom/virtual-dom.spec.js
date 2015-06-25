'use strict';

var test = require('tape');
var VirtualDOM = require('./../../../lib/virtual-dom/virtual-dom');
var VirtualDomStub = require('./../helpers/virtual-dom-stub');

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

test('----- Virtual DOM', function(t) {
    t.plan(7);

    t.test('exports', function(st){
        st.plan(1);
        st.ok(VirtualDOM, 'VirtualDOM exports');
    });

    t.test('query', function(st) {
        st.plan(5);

        var domTree = VirtualDomStub.getStubOne();
        var info = VirtualDomStub.stubOneInfo;

        var parentById = VirtualDOM.query(domTree, '#' + info.PARENT_ID);
        var children = parentById[0].children;
        st.ok(parentById[0] && children.length === info.CHILD_COUNT, 'query by id');

        var firstChild = VirtualDOM.query(domTree, '.' + info.FIRST_CHILD_CLASS_NAME)[0];
        st.ok(firstChild === children[0], 'query by class');

        var grandchildren = VirtualDOM.query(domTree, info.GRANDCHILD_NAME);
        st.ok(grandchildren.length === info.GRANDCHILDREN_COUNT, 'query by name [name:subname]');

        var childrenFromAttribute = VirtualDOM.queryAttribute(domTree, info.UID_KEY);
        st.ok(childrenFromAttribute.length === info.CHILD_COUNT, 'query by attribute name');

        var firstChildFromAttributeValue = VirtualDOM.queryAttribute(domTree, info.UID_KEY, '0');
        st.ok(firstChild === firstChildFromAttributeValue[0], 'query by attribute value');
    });

    t.test('parse', function(st) {
        st.plan(1);
        var str = '' +
            '<div id="parent">' +
            '   <div class="child"></div>' +
            '   <div class="child"></div>' +
            '   <div class="child"></div>' +
            '</div>';
        var el = VirtualDOM.parse(str);
        st.ok(el.children[0].children.length === 3, 'parses string into DOM Element');
    });

    t.test('transfer child nodes', function(st) {
        st.plan(1);

        var domTree = VirtualDomStub.getStubOne();
        var info = VirtualDomStub.stubOneInfo;
        var newParent = document.createElement('new-parent');
        VirtualDOM.transferChildNodes(domTree.children[0], newParent);
        st.ok(domTree.children[0].children.length === 0 && newParent.children.length === info.CHILD_COUNT, 'transfers child nodes between elements');
    });

    t.test('gets / removes node by uid', function(st) {
        st.plan(3);

        var stub = VirtualDomStub.getStubOne();
        st.ok(VirtualDOM.getNodeByUID(stub, 5), 'gets node by uid');
        VirtualDOM.removeNodeByUID(stub, 5);
        st.notOk(VirtualDOM.getNodeByUID(stub, 5), 'removes node by uid');

        try {
            VirtualDOM.removeNodeByUID(stub, 10);
        }
        catch (e) {
            st.ok(e, 'throws error if removal by uid attempted & node with corresponding uid does not exist');
        }
    });

    t.test('checks for if node is decendant of another node', function(st) {
        st.plan(4);
        var domTree = VirtualDomStub.getStubOne();
        var info = VirtualDomStub.stubOneInfo;

        var firstGrandChild = VirtualDOM.query(domTree, info.GRANDCHILD_NAME)[0];
        st.ok(firstGrandChild, 'first grandchild exists');
        st.ok(VirtualDOM.isDescendant(firstGrandChild, domTree), 'confirms when node is descendant');

        var firstChild = VirtualDOM.query(domTree, info.CHILD_NAME)[0];
        st.ok(firstChild, 'first child exists');
        st.notOk(VirtualDOM.isDescendant(firstChild, firstGrandChild), 'confirms when node is not descendant');
    });

    t.test('should attach data from json to node', function(st) {
        st.plan(2);
        var dom = VirtualDOM.create('alpha:beta');
        var data = {a: 1, b: 2};
        var dataStr = 'test-data';
        VirtualDOM.attachAttributeFromJSON(dom, data, dataStr);
        var dataStrFromNode = VirtualDOM.getAttribute(dom, dataStr);
        st.ok(dataStrFromNode, 'data attribute attached to node');
        st.equal(JSON.parse(dataStrFromNode).a, data.a, 'data attribute attached to node has correct value');
    });
});
