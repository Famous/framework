function getPhotoUrl(photoInfo){
    var size = "c"; //800x800, https://www.flickr.com/services/api/misc.urls.html
    var url = "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_{size}.jpg"
    url = url.replace('{farm-id}', photoInfo.farm);
    url = url.replace('{server-id}', photoInfo.server);
    url = url.replace('{id}', photoInfo.id);
    url = url.replace('{secret}', photoInfo.secret);
    url = url.replace('{size}', size);
    return url;
}

function getPhotoGalleryUrl(apiKey, galleryId){
    var url = "https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key="+apiKey+"&method=flickr.galleries.getPhotos&per_page=15&gallery_id=" + galleryId;
    return url;
}

var GALLERIES = {
    BLOOM: "66911286-72157653649565419",
    NATURAL_WONDERS: "66911286-72157652879582045",
    ORIGAMI: "66911286-72157645827212930",
    CLOUDS: "66911286-72157645820044028",
    COWS: "66911286-72157645071513729",
    OCEAN: "66911286-72157644620926147"
}

FamousFramework.scene('famous:adapter:flickr', {

    behaviors: {

        '#list-photos': {

            'request': function(location, gallery, apiKey) {

                //don't kick off a request unless we have an apiKey
                if(!apiKey) { return false; }

                var parameters = {};
                var url = getPhotoGalleryUrl(apiKey, GALLERIES[gallery]);
                
                return {
                    'url': url,
                    'parameters': parameters
                };
            }
        }
    },

    events: {
        '#list-photos': {
            'response': function($payload, $event, $dispatcher, $state) {

                //stop the event from bubbling, cuz
                //we're going to tweak the response data
                $event.stopPropagation();
                var response = $payload.response;

                try {
                    var data = response.data;

                    if(data.stat !== 'ok'){
                        console.warn('flickr returned an error: ' + data.message);
                    }

                    var photos = data.photos.photo.map(function(photo){
                        return getPhotoUrl(photo);
                    });

                    $state.set('photos', photos);
                    //send the response event with our parsed data
                    $dispatcher.emit("photos-loaded", photos);
                }
                catch(ee) {
                    $dispatcher.emit("error", ee);
                }
            },

            'error': function($payload, $dispatcher) {
                console.warn("Error: ", $payload);
                $dispatcher.emit("error", $payload);
            }
        },

        '$public': {
            'gallery': function($dispatcher, $state, $payload) {

                //dont' do anything if a null query was made
                if(!$payload) {
                    return;
                }

                //otherwise set our gallery
                $state.set("gallery", $payload);
            },
            'api-key': '[[setter|apiKey]]'
        }
    },
    states: {
        apiKey: undefined,
        gallery: 'BLOOM',
        photos: []
    },
    tree: `
        <famous:service:http id="list-photos"></famous:service:http>
    `
});
