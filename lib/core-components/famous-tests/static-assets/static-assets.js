FamousFramework.scene('famous-tests:static-assets', {
    behaviors: {
        '#one-a': {
            'content': '<img src="{{BASE_URL}}assets/excite.png"><p style="color:white;">You should see several images on this page, showing that assets can be loaded/referenced in a variety of ways</p>'
        },
        // Content is defined inside of the tree
        '#one-b': {
            'position' : [400, 0]
        },
        '#two': {
            'content': function(imageTwoPath) {
                // Alternative syntax for inferring asset path name.
                // {{BASE_URL}} is a keyword that will be evaluated during compilation
                // to match the CDN location where this component is hosted.
                return '<img src="{{BASE_URL}}' + imageTwoPath + '">';
            },
            'position': [0, 300]
        },
        '#three': {
            'content': function(imageThreePath) {
                return ''; // TODO
            },
            'position': [0, 600]
        },
        '#four': {
            'position': [400, 300]
        },
        '#img-four' : {
            src: '[[identity|imageFourPath]]'
        }
    },
    states: {
        imageTwoPath: 'assets/excite2.png', 
        imageThreePath: 'assets/excite3.png',
        imageFourPath: '{{BASE_URL}}assets/excite2.png'
    },
    tree: `
        <node id="one-a"></node>
        <node id="one-b">
            <img src="{{BASE_URL}}assets/excite.png">
        </node>
        <node id="two"></node>
        <node id="three"></node>
        <node id="four">
            <img id='img-four'>
        </node>
    `,
});
