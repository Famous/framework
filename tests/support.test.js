var deps = require('../src/support/deps');

describe('find tree dependencies', function() {
  it('should return an array of tree dependencies', function() {
    var tree = '<famous:view><famous:html-element id="box" famous:events:click="clickHandle"><p>Hello World!</p></famous:html-element></famous:view><famous:view><arkady:circle><imti:rectangle></imti:rectangle></arkady:circle></famous:view>';
    var PARSER = new DOMParser();

    var parsedBody = PARSER.parseFromString(tree, 'text/html').body;
    var virtualDOM = document.createElement('__wrapper');

    while (parsedBody.childNodes.length > 0) {
      virtualDOM.appendChild(parsedBody.childNodes[0]);
    }

    var actualOutput = deps.findTreeDeps(virtualDOM);
    var expectedOutput = ['famous:view', 'famous:html-element', 'famous:events', 'famous:view', 'arkady:circle', 'imti:rectangle'];
    expect(actualOutput).toEqual(expectedOutput);
  });
});
