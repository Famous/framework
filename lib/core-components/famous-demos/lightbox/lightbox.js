function googleImageSearchURL(query) {
    return 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAq3_ufOUu95Kso3xkTaZPM8sF5fLvJ-oo&cx=009629673816150211188:hjfc6bc7_cu&q=' + query + '&searchType=image&fileType=jpg&imgSize=large&alt=json';
}

var handleReQuery = FamousFramework.helpers.debounce(function($state, $payload) {
    $state.set('queried', true);
    $state.set('url', googleImageSearchURL($payload));
}, 1000);

FamousFramework.component('famous-demos:lightbox', {
    behaviors: {
        '$self': { 'query': '[[identity|query]]' },
        '#grid': { 'data': '[[identity|data]]' },
        '#http' : { 'request' : function(url) { return { url: url }; } }
    },

    events: {
        '$public': {
            'query': function($state, $payload) {
                handleReQuery($state, $payload);
            }
        },
        '#http': {
            'response': function($payload, $state) {
                var originalData = $payload.response.data || [];
                var formattedData;
                if ($state.get('queried')) {
                    formattedData = [];
                    for (var i = 0; i < originalData.items.length; i++) {
                        var originalProps = originalData.items[i];
                        formattedData.push({
                            imageURL: originalProps.link,
                            thumbnailURL: originalProps.link,
                            hoverDescription: `<span class="search-lightbox__title">${originalProps.title}</span>`,
                            detailTitle: `<span class="search-lightbox__title">${originalProps.title}</span>`,
                            detailDescription: ''
                        });
                    }
                }
                else {
                    formattedData = originalData;
                }
                $state.set('data', formattedData.slice(0, $state.get('max')));
            }
        }
    },

    tree: `
        <famous:ui:config-panel id="config"></famous:ui:config-panel>
        <famous:service:http id="http"></famous:service:http>
        <famous-demos:lightbox:grid id="grid"></famous-demos:lightbox:grid>
    `,

    states: {
        url: 'https://s3-us-west-2.amazonaws.com/famous-framework/lightbox/caprichos.json',
        max: 40,
        queried: false
    }
})
.config({
    expose: [
        { key: 'query', name: 'Image Search', 'default': '' }
    ]
});
