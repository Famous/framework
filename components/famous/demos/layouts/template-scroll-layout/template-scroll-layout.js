BEST.module('famous:demos:layouts:template-scroll-layout', {
    behaviors: {
        '$self' : {
            'set-template' : '[[identity|mockTemplatedContent]]'
        },
        '#item' : {
            'style': '[[setter]]',
            'content' : '[[setter]]'
        }
    },
    events: {
        $public: {
            /*
            Creates a basic template for content. This type of layout is limited
            because all of the items are inside of a single FamousNode, meaning that 
            intra-animation is not possible. If the content is meant to be static,
            this can be a useful approach. Otherwise, the developer should use the approach
            laid out in the <basic-scroll-view> example.
             */
            'set-template' : function($state, $payload) {
                var innerContent = '';
                var data;
                var template;
                for(var i = 0; i < $payload.length; i++) {
                    data = $payload[i];
                    template = ''+
                    '<div class="template-item">' +
                        '<img src= "' + data.image +'"/>' +

                        '<div class="template-item-header">'+
                            '<h3>' + data.title + '</h3>' +
                        '</div>' +

                        '<p>' + data.content +'</p>'+
                    '</div>';

                    innerContent += template;
                }

                var content = ''+
                '<div class="templated-content">' +
                    innerContent +
                '</div>';

                $state.set('content', content);
            },
            'style' : '[[setter]]'
        },
    },
    states: {
        style: {},
        mockTemplatedContent: [
            {
                title: 'Example Title',
                content: 'Sample Content',
                image: 'http://placehold.it/200x200'
            }
        ]
    },
    tree: 'template-scroll-layout.html',
})
.config({
    imports: {
        'famous:core': ['ui-element']
    },
    /*
    External CSS files can be included. This is useful for styling static content
    that is not likely to change.
     */
    includes: [
        'style.css'
    ]
});
