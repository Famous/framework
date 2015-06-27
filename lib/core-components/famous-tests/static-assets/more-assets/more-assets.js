FamousFramework.scene('famous-tests:static-assets:more-assets', {
    behaviors: {
        'ui-element' : {
            'content': '<img src="{{CDN_PATH}}assets/excite3.png">'
        }
    },
    events: {
    },
    tree: `
        <ui-element></ui-element>
    `,
});
