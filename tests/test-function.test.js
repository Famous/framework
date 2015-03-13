var TestFunction = require('./fixtures/test-function');

describe('testFunction', function() {
    var myFunction = new TestFunction();
  
    it('should be able to add to list', function() {
        expect(myFunction.addToList).toBeDefined();
        myFunction.addToList('stuff');
        expect(myFunction.list[0]).toEqual('stuff');
    });
  
    it('should be able to get the list', function() {
        expect(myFunction.getList).toBeDefined();
        expect(myFunction.getList()).toEqual(['stuff'])
    });
});
