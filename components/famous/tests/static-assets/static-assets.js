BEST.scene('famous:tests:static-assets', 'HEAD', {
    behaviors: {
        '#one-a': {
            'content': '<img src="@{assets/excite.png}">'
        },
        // Content is defined inside of the tree
        '#one-b': {
            'position' : [400, 0]
        },
        '#two': {
            'content': function(imageTwoPath) {
                // Alternative syntax for inferring asset path name.
                // @{CDN_PATH} is a keyword that will be evaluated during compilation
                // to match the CDN location where this component is hosted.
                return '<img src="@{CDN_PATH}' + imageTwoPath + '">';
            },
            'position': [0, 300]
        },
        '#three': {
            'content': function(imageThreePath) {
                // @{CDN_PATH|username:component} is a keyword that will be evaluated during compilation
                // to match the CDN location where `username:component` is hosted.
                return '<img src="@{CDN_PATH|famous:tests:static-assets:more-assets}' + imageThreePath + '">';
            },
            'position': [0, 600]
        }
    },
    states: {
        imageTwoPath: 'assets/excite2.png', 
        imageThreePath: 'assets/excite3.png'
    },
    tree: `
        <ui-element id="one-a"></ui-element>

        <ui-element id="one-b">
            <img src="@{assets/excite.png}">
        </ui-element>

        <ui-element id="two"></ui-element>

        <ui-element id="three"></ui-element>
    `,
});
