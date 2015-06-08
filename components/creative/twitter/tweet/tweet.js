BEST.scene('creative:twitter:tweet', {
    behaviors: {
        '.tweet': {
            'size-absolute-y': (sizeY) => {
                //'[[identity|sizeY]]',
                return sizeY;
            },

            'position-y': '[[identity|positionY]]',
            styles: {
                'padding': '10px 12px 5px 70px',
                'border-bottom': '1px solid rgb(229, 235, 239)'
            },
             'template': (model) => {
                 return {
                     userImage: '@{CDN_PATH}' + model.imageURL,
                     displayName: model.displayName,
                     userName: model.userName,
                     tweetContent: model.tweetContent,
                     tweetImage: '@{CDN_PATH}' + model.tweetImage,
                     tweetAge: model.tweetAge,
                     retweets: model.retweets,
                     favorites: model.favorites
                 };
             }
        }
    },
    events: {
        '$public': {
            'sizeY': '[[setter]]',
            'positionY': '[[setter]]',
            'model': '[[setter]]'
        },
        '$pass-through' : {
            '.tweet-view' : {
                'position-my-tweet' : 'position'
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
