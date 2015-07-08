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
                this._updateLayout();
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

    _createSizeArrayWithTrueSizesPopulated(childNodes, directionIndex) {
        return this._proportions.map((proportion, idx) => {
            if (idx < childNodes.length && proportion === true) {
                let childNodeContent = childNodes[idx].getChildren()[0];
                return childNodeContent.getAbsoluteSize()[directionIndex];
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

    _createArrayWithValueAtDirectionIndex(value, array) {
        let directionIndex = this._getDirectionIndex();
        array[directionIndex] = value;
        return array;
    }

    _updateLayout() {
        if (!this._sizeSet || !this.getParent()) {return;}

        let childNodes = this.getChildren()[0].getChildren();
        let directionIndex = this._getDirectionIndex();
        let parentSize = this.getParent().getSize();
        let sizes = this._createSizeArrayWithTrueSizesPopulated(childNodes, directionIndex);
        let sumTrueSizes = this._calculateSumOfTrueSizes(sizes);

        this._fillUnknownSizes(sizes, parentSize[directionIndex], sumTrueSizes);

        let position = 0;
        childNodes.forEach((childNode, idx) => {
            if (!childNode._layoutPosition) {
                childNode._layoutPosition = new Position(childNode);
            }
            if (!childNode._layoutSize) {
                childNode._layoutSize = new Size(childNode);
            }

            let size = sizes[idx];
            let transition = this._transition;

            childNode._layoutSize.halt();
            childNode._layoutSize.setMode.apply(childNode._layoutSize, [1, 1, 1]);
            childNode._layoutSize.setAbsolute.apply(
                childNode._layoutSize,
                this._createArrayWithValueAtDirectionIndex(size, [
                    parentSize[0],
                    parentSize[1],
                    parentSize[2],
                    transition
                ])
            );

            childNode._layoutPosition.halt();
            childNode._layoutPosition.set.apply(
                childNode._layoutPosition,
                this._createArrayWithValueAtDirectionIndex(position, [0, 0, 0, transition])
            );

            position += size;
        });
    }

    setDirection(direction) {
        for (let key in FlexibleLayout.Direction) {
            if (FlexibleLayout.Direction[key] === direction) {
                this._direction = direction;
                this._updateLayout();
                return;
            }
        }
        throw new Error(`Invalid direction - ${direction}`);
    }

    setRatios(ratios) {
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

        this._updateLayout();
    }

    setTransition(transition) {
        this._transition = transition;
    }
}

FlexibleLayout.Direction = {
    X: Symbol('FlexibleLayout.Direction.X'),
    Y: Symbol('FlexibleLayout.Direction.Y'),
    Z: Symbol('FlexibleLayout.Direction.Z')
};

FamousFramework.registerCustomFamousNodeConstructors({
    FlexibleLayout: FlexibleLayout
});
