BEST.module('arkady.pevzner:layouts:template-scroll-layout', {
    behaviors: {
        '$self' : {
            'set-template' : function(mockTemplatedContent) {
                return mockTemplatedContent;
            }
        },
        '#item' : {
            style: {
                'overflow' : 'scroll',
                'background-color' : 'white'
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
                    '<div class="template-item" style="border: 1px solid black; padding: 20px;">' +
                        '<div class="template-item-header">'+
                            '<img src= "' + data.image +'" style="float: left; margin: 20px;"/>' +
                            '<h2>' + data.title + '</h2>' +
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
        },
    },
    states: {
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
    }
});
