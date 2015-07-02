FamousFramework.component('famous-demos:lightbox', {
    behaviors: {
        '#config' : {
            'position-y' : 50
        }
    },
    tree: `
        <famous:ui:config-panel id='config'></famous:ui:config-panel>
        <famous-demos:lightbox:grid></famous-demos:lightbox:grid>
    `
});
