function Arbiter(node) {
    this.node = node;
    this.domNode = this.node.domNode;
}

Arbiter.prototype.emit = function(key, message) {
    var event = new CustomEvent(key, { detail: message });
    this.domNode.dispatchEvent(event);
};

Arbiter.prototype.on = function(key, cb) {
    this.domNode.addEventListener(key, cb);
};

module.exports = Arbiter;
