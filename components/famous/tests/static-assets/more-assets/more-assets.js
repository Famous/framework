BEST.scene('famous:tests:static-assets:more-assets', 'HEAD', {
    behaviors: {
        'ui-element' : {
            'content': '<img src="@{assets/excite3.png}">'
        }
    },
    events: {
    },
    tree: `
        <ui-element></ui-element>
    `,
});
