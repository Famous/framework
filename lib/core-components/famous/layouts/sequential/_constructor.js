const Node = FamousFramework.FamousEngine.core.Node;
const Position = FamousFramework.FamousEngine.components.Position;
const Size = FamousFramework.FamousEngine.components.Size;

class SequentialLayout extends Node {
    constructor() {
        super();

        this._sizeSet = false;
        this._direction = SequentialLayout.Direction.X;
        this._transition = null;

        this.addComponent({
            onSizeChange: () => {
                this._sizeSet = true;
                this.updateLayout();
            }
        });
    }

    _getDirectionIndex() {
        if (this._direction === SequentialLayout.Direction.X) {
            return 0;
        } else if (this._direction === SequentialLayout.Direction.Y) {
            return 1;
        } else if (this._direction === SequentialLayout.Direction.Z) {
            return 2;
        }
        throw new Error(`Unknown direction - ${this._direction}`);
    }

    _createArrayWithValueAtDirectionIndex(array, value) {
        let result = Array.prototype.slice.call(array, 0);
        let directionIndex = this._getDirectionIndex();
        result[directionIndex] = value;
        return result;
    }

    _getNodeSizes(nodes) {
        let directionIndex = this._getDirectionIndex();
        return nodes.map((node, idx) => {
            let contentNode = nodes[idx].getChildren()[0];
            return contentNode.getAbsoluteSize()[directionIndex];
        });
    }

    _getNodePosition(node) {
        if (!node._layoutPosition) {
            node._nodePosition = new Position(node);
        }
        return node._nodePosition;
    }

    _getNodeSize(node) {
        if (!node._layoutSize) {
            node._nodeSize = new Size(node);
        }
        return node._nodeSize;
    }

    updateLayout() {
        if (!this._sizeSet) {return;}

        let createArray = this._createArrayWithValueAtDirectionIndex.bind(this);
        let childNodes = this.getChildren()[0].getChildren();
        let sizes = this._getNodeSizes(childNodes);
        let position = 0;

        childNodes.forEach((childNode, idx) => {
            let size = sizes[idx];
            let transition = this._transition;

            let nodePosition = this._getNodePosition(childNode);
            nodePosition.halt();
            nodePosition.set.apply(nodePosition, createArray([0, 0, 0], position).concat(transition));

            position += size;
        });
    }

    set direction(direction) {
        for (let key in SequentialLayout.Direction) {
            if (SequentialLayout.Direction[key] === direction) {
                this._direction = direction;
                this.updateLayout();
                return;
            }
        }
        throw new Error(`Invalid direction - ${direction}`);
    }

    set transition(transition) {
        this._transition = transition;
    }
}

SequentialLayout.Direction = {
    X: Symbol('SequentialLayout.Direction.X'),
    Y: Symbol('SequentialLayout.Direction.Y'),
    Z: Symbol('SequentialLayout.Direction.Z')
};

FamousFramework.registerCustomFamousNodeConstructors({SequentialLayout});
