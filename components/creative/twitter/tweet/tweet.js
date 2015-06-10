BEST.scene('creative:twitter:tweet', {
    behaviors: {
        '.tweet': {
            'size-absolute-y': '[[identity|sizeY]]',
            'position-z': '[[identity|positionZ]]',
            'position-y': '[[identity|positionY]]',
            style: (positionZ) => {
                console.log('positionZ',positionZ);
                return {
                    'padding': '10px 12px 5px 70px',
                    'border-bottom': '1px solid rgb(229, 235, 239)',
                    'z-index': positionZ
                }
            },
            'template': (model) => {
                 //console.log('model',model);
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
                return model;
            }
        }
    },
    events: {
        '$public': {
            'sizeY':     '[[setter]]',
            'positionY': '[[setter]]',
            'positionZ': '[[setter]]',
            'model':     '[[setter]]'
        }
    },
    states: {},
    tree: 'tweet.html'
}).config({
    includes: [
        'assets/styles/tweet.css'
    ]
});
