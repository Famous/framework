FamousFramework.scene('creative:twitter:tweet', {
    behaviors: {
        '.tweet': {
            'size-absolute-y': '[[identity|sizeY]]',
            'position-z': '[[identity|positionZ]]',
            'position-y': '[[identity|positionY]]',
            style: (positionZ) => {
                return {
                    'padding': '10px 12px 5px 70px',
                    'border-bottom': '1px solid rgb(229, 235, 239)',
                    'z-index': positionZ
                }
            },
            'template': (model) => {
                /*{
                     imageURL:
                     displayName:
                     userName:
                     tweetContent:
                     tweetImage:
                     tweetAge:
                     retweets:
                     favorites:
                 }*/

                console.log('template pre',model.imageURL);

                if(model.hasOwnProperty('imageURL')) {
                    model.tempImageURL = '{{@CDN_PATH}}' + model.imageURL;
                }//TODO: bug

                if(model.hasOwnProperty('tweetImage')) {
                    model.tempTweetImage = '{{@CDN_PATH}}' + model.tweetImage;
                }//TODO: bug

                return model;
            }
        }
    },
    events: {
        '$public': {
            'sizeY':     '[[setter]]',
            'positionY': '[[setter]]',
            'positionZ': '[[setter]]',
            'model': function($state, $payload) {
                console.log('EVENT IN PUBLIC CB');
                $state.set('model', $payload);
            }
        }
    },
    states: {},
    tree: 'tweet.html'
}).config({
    includes: [
        'assets/styles/tweet.css'
    ]
});
