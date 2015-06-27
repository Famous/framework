
FamousFramework.scene('famous-demos:widget-dashboard:photos', {

    behaviors: {
        '.photo-container': {
            '$repeat': function(photos){
                return photos;
            },
            'content': function($index, photos){
                return "<img style='width: 400px; max-height: 400px;' src="+photos[$index]+" />"
            },
            'size': [400, 400],
            'position': function($index, positions){
                if(!positions || !positions[$index]) return [0,0,0];
                return positions[$index];
            },
            'rotation': function($index, rotations){
                if(!rotations || !rotations[$index]) return [0,0,0];
                return rotations[$index];
            },
            'style': {
                'overflow': 'hidden',
                'cursor': 'pointer'
            }
        },
        //configuration for the flickr-adapter
        '#flickr-adapter': {
            'gallery': 'NATURAL_WONDERS',
            'api-key': 'your-api-key-here'
        }
    },

    events: {
        '#flickr-adapter': {
            'photos-loaded': function($state, $payload){
                $state.set('photos', $payload);
                $state.set('toggled', false);
                $state.set('positions', $payload.map(function(photo){
                    return [0,0,0];
                }));
                $state.set('rotations', $payload.map(function(photo){
                    return [0,0,0];
                }));
            }
        },
        '.photo-container': {
            'click': function($state){
                var toggled = $state.get('toggled');
                var count = $state.get('positions').length;
                var amplitude = $state.get('maxAmplitude');
                if(!toggled){
                    //expand
                    for(var i = 0; i < count; i++){
                        //generate polar coordinates
                        var theta = i * (Math.PI * 2 / count);
                        var r = Math.random() * amplitude;

                        //convert polar coordinates to cartesian and then set position
                        var x = r * Math.cos(theta); 
                        var y = r * Math.sin(theta); 
                        $state.set(['positions', i], [x, y, i], {duration: 400, curve: 'easeOut'});

                        //add some randomized rotational jitter
                        $state.set(['rotations', i], [0, 0, Math.PI / 8 * (Math.random() - .5)], {duration: 400, curve: 'easeOut'});
                    };
                }else{
                    //contract
                    for(var i = 0; i < count; i++){
                        $state.set(['positions', i], [0, 0, i], {duration: 400, curve: 'easeOut'});
                        $state.set(['rotations', i], [0, 0, 0], {duration: 400, curve: 'easeOut'});
                    };
                }
                $state.set('toggled', !toggled);
            }
        }
    },

    states: {
        //default cat photos in case no data is loaded
        photos: [
            '{{BASE_URL}}stock/kitten-1.jpg',
            '{{BASE_URL}}stock/kitten-2.jpg',
            '{{BASE_URL}}stock/kitten-3.jpg',
            '{{BASE_URL}}stock/kitten-4.jpg',
            '{{BASE_URL}}stock/kitten-5.jpg'
        ],
        //hard-coded default position data
        positions: [
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],
        //hard-coded default rotation data
        rotations: [
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ],
        //describes whether the photos are expanded or contracted
        toggled: false,
        //maximum radial distance photos should extend when expanded
        maxAmplitude: 500
    },

    tree: `
        <!-- uncomment the line below and specify your flickr API key in the Behavior above to pull data from Flickr -->
        <!--<famous:adapter:flickr id="flickr-adapter"></famous:adapter:flickr>-->
        <node class="photo-container">  
        </node>
    `
});
