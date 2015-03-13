/**
 * Example class to test.
 */
function TestFunction () {
    this.list = [];
}

TestFunction.prototype.getList = function getList() {
    return this.list;
}

TestFunction.prototype.addToList = function addToList(stuff) {
    this.list.push(stuff);
}

TestFunction.prototype.clearList = function clearList() {
    this.list = [];
}

module.exports = TestFunction;
