BEST.module('super.demo.day:layouts:template-scroll-layout', 'HEAD', {
    behaviors: {
        '$self' : {
            'set-template' : function(mockTemplatedContent) {
                return mockTemplatedContent;
            }
        },
        '#item' : {
            'style': function(style) {
                return style;
            },
            'content' : function(content) {
                return content;
            }
        }
    },
    events: {
        $public: {
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
            'style' : 'setter'
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
    includes: [
        'style.css'
    ]
});
