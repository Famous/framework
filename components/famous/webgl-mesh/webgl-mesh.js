BEST.component('famous:webgl-mesh', {
    behaviors: {
        '$self': {
            '$self:size': function(size) {
                return size;
            },
            '$self:color': function(color) {
                return color;
            },
            '$self:origin': function(origin) {
                return origin;
            },
            '$self:normals': function(normals) {
                return normals;
            },
            '$self:position': function(position) {
                return position;
            },
            '$self:geometry': function(geometry) {
                return geometry;
            },
            '$self:glossiness': function(glossiness) {
                return glossiness;
            },
            '$self:metallness': function(metallness) {
                return metallness;
            },
            '$self:flatShading': function(flatShading) {
                return flatShading;
            }
        }
    }
});
