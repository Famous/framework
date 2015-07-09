const Node = FamousFramework.FamousEngine.core.Node;
const Position = FamousFramework.FamousEngine.components.Position;
const Size = FamousFramework.FamousEngine.components.Size;

class FlexibleLayout extends Node {
    constructor() {
        super();

        this._sizeSet = false;
        this._direction = FlexibleLayout.Direction.X;
        this._proportions = [];
        this._ratios = [];
        this._transition = null;

        this.addComponent({
            onSizeChange: () => {
                this._sizeSet = true;
                this.updateLayout();
            }
        });
    }

    _getDirectionIndex() {
        if (this._direction === FlexibleLayout.Direction.X) {
            return 0;
        } else if (this._direction === FlexibleLayout.Direction.Y) {
            return 1;
        } else if (this._direction === FlexibleLayout.Direction.Z) {
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

    _createSizeArrayWithTrueSizesPopulated(nodes, directionIndex) {
        return this._proportions.map((proportion, idx) => {
            if (idx < nodes.length && proportion === true) {
                let contentNode = nodes[idx].getChildren()[0];
                return contentNode.getAbsoluteSize()[directionIndex];
            }
            return null;
        });
    }

    _calculateSumOfTrueSizes(sizes) {
        return sizes
            .filter((size) => typeof size === 'number')
            .reduce((sum, size) => sum + size, 0);
    }

    _fillUnknownSizes(sizes, parentSize, sumTrueSizes) {
        sizes.forEach((size, idx) => {
            if (typeof size === 'number') {return;}
            let proportion = this._proportions[idx];
            if (typeof proportion === 'number') {
                sizes[idx] = proportion * (parentSize - sumTrueSizes);
            } else {
                sizes[idx] = 0;
            }
        });
    }

    _getNodeSizes(nodes, parentSize) {
        let directionIndex = this._getDirectionIndex();
        let sizes = this._createSizeArrayWithTrueSizesPopulated(nodes, directionIndex);
        let sumTrueSizes = this._calculateSumOfTrueSizes(sizes);
        this._fillUnknownSizes(sizes, parentSize[directionIndex], sumTrueSizes);
        return sizes;
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
        let parentSize = this.getSize();
        let sizes = this._getNodeSizes(childNodes, parentSize);
        let position = 0;

        childNodes.forEach((childNode, idx) => {
            let size = sizes[idx];
            let transition = this._transition;

            let nodePosition = this._getNodePosition(childNode);
            nodePosition.halt();
            nodePosition.set.apply(nodePosition, createArray([0, 0, 0], position).concat(transition));

            let nodeSize = this._getNodeSize(childNode);
            nodeSize.halt();
            nodeSize.setMode.apply(nodeSize, [1, 1, 1]);
            nodeSize.setAbsolute.apply(nodeSize, createArray(parentSize, size).concat(transition));

            position += size;
        });
    }

    set direction(direction) {
        for (let key in FlexibleLayout.Direction) {
            if (FlexibleLayout.Direction[key] === direction) {
                this._direction = direction;
                this.updateLayout();
                return;
            }
        }
        throw new Error(`Invalid direction - ${direction}`);
    }

    set ratios(ratios) {
        if (ratios === null) {return;}

        if (!(ratios instanceof Array)) {
            throw new Error(`ratios must be an array - ${ratios}`);
        }

        let sumRatios = ratios.reduce((sum, ratio) => {
            return sum + (typeof ratio === 'number' ? ratio : 0);
        }, 0);

        this._ratios = ratios;
        this._proportions = ratios.map((ratio) => {
            return (typeof ratio === 'number') ? (ratio / sumRatios) : ratio;
        });

        this.updateLayout();
    }

    set transition(transition) {
        this._transition = transition;
    }
}

FlexibleLayout.Direction = {
    X: Symbol('FlexibleLayout.Direction.X'),
    Y: Symbol('FlexibleLayout.Direction.Y'),
    Z: Symbol('FlexibleLayout.Direction.Z')
};

FamousFramework.registerCustomFamousNodeConstructors({FlexibleLayout});
