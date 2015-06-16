var Node = FamousFramework.FamousEngine.core.Node;

function PaddedNode(options) {
    this.options = Object.create(PaddedNode.DEFAULT_PROPERTIES);
    Node.apply(this, this.options);

    this.setOptions(options || {});

    this.layoutNode = Node.prototype.addChild.call(this);
    this.layoutNode.setSizeMode(1, 1, 0);

    console.log(this.layoutNode)

    var _this = this;
    this.addComponent({
        onSizeChange: function() {
            _layout(_this);
        }
    });
}

PaddedNode.prototype = Object.create(Node.prototype);
PaddedNode.prototype.constructor = PaddedNode;

PaddedNode.DEFAULT_PROPERTIES = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
};

function _layout(paddedNode) {
    if (!paddedNode.getParent()) return;
    var parentSize = paddedNode.getParent().getSize();
    paddedNode.layoutNode.setPosition(paddedNode.options.left, paddedNode.options.top);
    paddedNode.layoutNode.setAbsoluteSize(
        parentSize[0] - paddedNode.options.left - paddedNode.options.right,
        parentSize[1] - paddedNode.options.top - paddedNode.options.bottom);
}

PaddedNode.prototype.addChild = function addChild(child) {
    return this.layoutNode.addChild.call(this.layoutNode, child);
};

PaddedNode.prototype.getChildren = function getChildren() {
    return this.layoutNode.getChildren.call(this.layoutNode);
};

PaddedNode.prototype.setOptions = function setOptions(options) {
    if (options.top) this.setTopPadding(options.top);
    if (options.right) this.setRightPadding(options.right);
    if (options.bottom) this.setBottomPadding(options.bottom);
    if (options.left) this.setLeftPadding(options.left);
    _layout(this);
};

PaddedNode.prototype.setPadding = function setPadding() {
    // CSS Args
};

PaddedNode.prototype.setTopPadding = function setTopPadding(topPadding) {
    this.options.top = topPadding;
    _layout(this);
};

PaddedNode.prototype.getTopPadding = function getTopPadding(topPadding) {
    return this.options.top;
};

PaddedNode.prototype.setRightPadding = function setRightPadding(rightPadding) {
    this.options.right = rightPadding;
    _layout(this);
};

PaddedNode.prototype.getRightPadding = function getRightPadding(rightPadding) {
    return this.options.top;
};

PaddedNode.prototype.setBottomPadding = function setBottomPadding(bottomPadding) {
    this.options.bottom = bottomPadding;
    _layout(this);
};

PaddedNode.prototype.getBottomPadding = function getBottomPadding(bottomPadding) {
    return this.options.bottom;
};

PaddedNode.prototype.setLeftPadding = function setLeftPadding(leftPadding) {
    this.options.left = leftPadding;
    _layout(this);
};

PaddedNode.prototype.getLeftPadding = function getLeftPadding(leftPadding) {
    return this.options.left;
};

window.famousNode = new Node();
window.paddedNode = new PaddedNode();

FamousFramework.registerCustomFamousNodeConstructors({
    'PaddedNode' : PaddedNode
});