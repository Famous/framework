BEST.scene('creative:twitter:tweetM', 'HEAD', {
    behaviors: {
        '#background': {
            style: {
                'background': 'white'
            }
        },
        '#tweet': {
            'size-absolute-y': (imgHeight) => {
                return imgHeight + 110;
            }
        },
        '#img': {
            position: [10, 11],
            size: [51, 51],
            content: (image) => {
                return '<img src=' + image + ' style="max-width:100%; max-height: 100%">';
            }
        },
        '#user': {
            position: [75, 8],
            'size-absolute-y': 30,
            content: (userName, userId) => {
                return '<b>' + userName + '</b> <span style="color: #808080">' + userId + '</span>';
            }
        },
        '#time': {
            position: [-30, 8],
            align: [1.0, 0],
            'size-absolute-y': 30,
            content: (time) => {
                return '<span style="color: #808080">' + time + '</span>';
            }
        },
        '#message': {
            position: [75, 30],
            'size-differential-x': -89,
            'size-absolute-y': 30,
            content: (message) => {
                return '<span>' + message + '</span>';
            }
        },
        '#tweet-image': {
            position: [75, 66],
            'size-differential-x': -89,
            'size-absolute-y': (imgHeight) => {
                return (imgHeight);
            },
            style: (tweetImage) => {
                return {
                    'background-image': 'url(' + tweetImage + ')',
                    'background-size': '100%',
                    'background-repeat': 'no-repeat'
                };
            }
        },
        '#respond': {
            position: (imgHeight) => {
                return [75, imgHeight + 75];
            },
            size: [25, 25],
            content: () => {
                return '<img src=@{/assets/images/respond.png} style="max-width:100%; max-height: 100%">';
            }
        },
        '#retweet': {
            position: (imgHeight) => {
                return [135, imgHeight + 75];
            },
            size: [500, 25],
            content: (retweets) => {
                return '<img src=@{/assets/images/retweet.png} style="max-width:100%; max-height: 100%">' +
                '<span style="position: relative; top: -7px; left: 10px; color: #808080">' + retweets + '</span>';
            }
        },
        '#favorite': {
            position: (imgHeight) => {
                return [210, imgHeight + 75];
            },
            size: [500, 25],
            content: (favorites) => {
                return '<img src=@{/assets/images/favorite.png} style="max-width:100%; max-height: 100%">' +
                '<span style="position: relative; top: -7px; left: 5px; color: #808080">' + favorites + '</span>';
            }
        },
        '#follow': {
            position: (imgHeight) => {
                return [-37, imgHeight + 75];
            },
            align: [1.0, 0],
            size: [25, 25],
            content: () => {
                return '<img src=@{/assets/images/follow.png} style="max-width:100%; max-height: 100%">';
            }
        }
    },
    events: {
        '$public': {
            'position': 'setter',
            'model': 'setter'
        },
        '#tweet-image': {
            'size-change': function($state, $payload) {
                var img = new Image();
                img.src = $state.get('tweetImage');
                img.onload = () => {
                    // console.log(img.height);
                    var height = img.height;
                    var width = img.width;
                    var imgHeight = $payload[0] * (height / width);
                    $state.set('imgHeight', imgHeight);
                };
            }
        }
    },
    states: {
        image: '@{/assets/images/users/1.png}',
        userName: 'Famo.us',
        userId: '@befamous',
        time: '2h',
        message: 'Bla bla bla tweet yadda yadda',
        tweetImage: '@{/assets/images/tweet-image/best.png}',
        imgHeight: 100,
        retweets: 891,
        favorites: 983,
        position: [],
        model: {}
    },
    tree: 'tweetM.html'
});
