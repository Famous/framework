FamousFramework.scene('famous-demos:best:demo', {
    behaviors: {
        '$self': {
            'position-y': 100,
            'rotation-x': Math.PI/4
        },
        '$camera': {
            'depth': 4000
        },
        '#square': {
            '$repeat': [
                { content: 'BEHAVIOR', position: [ 200,   0] },
                { content: 'EVENT'   , position: [-200,   0] },
                { content: 'STATE'   , position: [ 0,  -200] },
                { content: 'TREE'    , position: [ 0,   200] }
            ]
        },
        '#arrow': {
            '$repeat': [
                { position: [ 115,  115], angle:  5 * Math.PI / 4 },
                { position: [ 115, -115], angle: -5 * Math.PI / 4 },
                { position: [-115,  115], angle:     -Math.PI / 4 },
                { position: [-115, -115], angle:      Math.PI / 4 }
            ]
        }
    },
    events: {},
    states: {},
    tree: `
        <arrow id="arrow"></arrow>
        <floating-square id='square'></floating-square>
    `
})
.config({
    imports: {
        'famous-demos:best': ['floating-square', 'arrow']
    }
});
