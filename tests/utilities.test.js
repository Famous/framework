var array   = require('../src/utilities/array');
var object  = require('../src/utilities/object');
var http    = require('../src/utilities/http');

describe('array helper', function() {
    var total = 0;
    var arr1 = [1, 2, 3, 4, 5];
    var arr2 = [5, 6, 7, 8, 9];
    var cb = function (num) { total += num };

    it('should be able to iterate over an array', function() {
        array.each(arr1, cb);
        expect(total).toEqual(15);
    });

    it('should be able to perform a union on two arrays', function() {
        var arr3 = array.union(arr1, arr2);
        expect(arr3).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    });
});

describe('object helpers', function() {
    var obj1 = {1: 'a', 2: 'b', 3: 'c'};
    var obj2 = {4: 'a', 5: 'b', 6: 'c'};

    it('should be able to clone an object', function() {
        var obj3 = object.clone(obj1);
        expect(obj3).toEqual(obj1);
    });
  
    it('should be able to merge two objects', function() {
        var obj4 = object.merge(obj1, obj2);
        expect(obj4).toEqual({1: 'a', 2: 'b', 3: 'c', 4: 'a', 5: 'b', 6: 'c'});
    });
});

describe('http helpers', function() {
    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should be able to get from a url', function() {
        var url = 'www.google.com';
        var doneFn = jasmine.createSpy("success");
    
        http.get(url, doneFn);
    
        expect(jasmine.Ajax.requests.mostRecent().url).toEqual(url)
        expect(doneFn).not.toHaveBeenCalled();
    
        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "contentType:": 'text/javascript',
            "responseText": 'sample response'
        });
    
        expect(doneFn).toHaveBeenCalledWith('sample response');
    });

    it('should be able to get from an array for urls', function() {
        var urls = ['www.google.com', 'www.famo.us'];
        var doneFn = jasmine.createSpy("success");
    
        http.join(urls, doneFn);
    
        expect(jasmine.Ajax.requests.first().url).toEqual(urls[0])
        expect(jasmine.Ajax.requests.mostRecent().url).toEqual(urls[1])
    
        jasmine.Ajax.requests.first().respondWith({
            "status": 200,
            "contentType:": 'text/javascript',
            "responseText": 'google'
        });
    
        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "contentType:": 'text/javascript',
            "responseText": 'famous'
        });
    
        expect(doneFn).toHaveBeenCalledWith(['google', 'famous']);
    });
});
