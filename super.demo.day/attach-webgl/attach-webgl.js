BEST.scene('super.demo.day:attach-webgl', 'HEAD', {
    behaviors: {
        '#webgl' : {
            opacity: '[[setter]]'
        }
    },
    events: {
        '$public' : {
            opacity: 'setter'
        }
    },
    states: {
        opacity: 1
    },
    tree: 'attach-webgl.html'
})
.config({ includes: ['webgl-example.js'] });
