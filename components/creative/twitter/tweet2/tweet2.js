BEST.scene('creative:twitter:tweet2', 'HEAD', {
    behaviors: {
        '.tweet': {
             'template': (model) => {
                 console.log('template');
                 return {
                     userImage: model.imageURL,
                     displayName: model.displayName,
                     userName: model.userName,
                     tweetContent: model.tweetContent,
                     tweetImage: model.tweetImage,
                     tweetAge: model.tweetAge,
                     retweets: model.retweets,
                     favorites: model.favorites
                 }
             }
        }
    },
    events: {
        '$public': {
            'position': '[[setter]]',
            'model': '[[setter]]'
        }
    },
    states: {},
    tree: 'tweet2.html'
});
