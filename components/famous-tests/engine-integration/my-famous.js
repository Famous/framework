var DOMElement = Famous.domRenderables.DOMElement;

var Size = Famous.components.Size;

FamousFramework.attach('#ctx', function(renderNode) {
    var domEl = new DOMElement(renderNode);
    domEl.setContent('Hello Famous!');
    domEl.setProperty('background-color', 'red');

    var size = new Size(renderNode);
    size.setMode(1, 1, 1);
    size.setAbsolute(200, 200);
});
