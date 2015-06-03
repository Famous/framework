BEST.scene('creative:twitter', {
    behaviors: {
        '#container': {
            'align': [0.5, 0],
            'mount-point': [0.5, 0]
        },
        '#hf': {
            'header-height' : '[[identity|headerHeight]]',
            'footer-height' : '[[identity|footerHeight]]'

        },
        '.header-background': {
            'size-proportional-x': 1,
            'size-proportional-y': 1,
            'style': {
                'background-color': '#55ACEE'
            }
        },
        '.content-left': {
            'align': [0, 1],
            'mount-point': [0, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': 35,
            'content': (headerContentHeight) => {
                return '<a><img width="' + headerContentHeight + 'px" src="@{assets/images/follow.png}"></a>';
            },
            'style': (headerContentHeight) => {
                return {
                    'line-height': headerContentHeight + 'px',
                    'text-align': 'left'
                }
            }
        },
        '.content-center': {
            'align': [0.5, 1],
            'mount-point': [0.5, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': 35,
            'content': (pageTitle) => {
                return '<div>' + pageTitle + '</div>';
            },
            style: () => {
                return {
                    'color': 'white',
                    'line-height': '35px',
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'text-align': 'center'
                };
            }
        },
        '.content-right': {
            'align': [1, 1],
            'mount-point': [1, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': '[[identity|headerContentHeight]]',
            'content': (headerContentHeight) => {
                return '' +
                    '<a><img width="' + headerContentHeight + 'px" src="@{assets/images/search.png}"></a>' +
                    '<a><img width="' + headerContentHeight + 'px" src="@{assets/images/tweet.png}"></a>';
            },
            'style': (headerContentHeight) => {
                return {
                    'line-height': headerContentHeight + 'px',
                    'text-align': 'right'
                }
            }
        },
        '.body-background': {
            style: {
                'border-bottom': '1px solid rgb(229, 235, 239)',
                'background-color': 'white'
            }
        },
        '.footer-background': {
            style: {
                'background-color': 'white'
            }
        },
        '.footer': {
            'size-absolute-y': 45,
            'size-proportional-x': 1,
            style: () => {
                return {
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'background-color': 'white'
                };
            }
        },
        '.footer-link': {
            'mount-point': [0, 0],
            'size-absolute-x': window.innerWidth / 4,
            'size-proportional-y': 1,
            'style': () => {
                return {
                    'text-align': 'center',
                    'padding-top': '5px',
                    'color': 'rgb(85, 172, 238)',
                    'text-decoration': 'none',
                    'font-size': '11px',
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif'
                };
            }
        },
        '.link-home': {
            'align': [0, 0],
            'content': (homeIcon) => {
                return '<a><img width="25px" src="@{CDN_PATH}' + homeIcon + '"><br>Home</a>';
            },
            'style': {
                'background-image': '@{assets/images/home.png}'
            }
        },
        '.link-notifications': {
            'align': [.25, 0],
            'content': (notificationsIcon) => {
                return '<a><img width="25px" src="@{CDN_PATH}' + notificationsIcon + '"><br>Notifications</a>';
            }
        },
        '.link-message': {
            'align': [.5, 0],
            'content': (messagesIcon) => {
                return '<a><img width="25px" src="@{CDN_PATH}' + messagesIcon + '"><br>Messages</a>';
            }
        },
        '.link-profile': {
            'align': [.75, 0],
            'content': (profileIcon) => {
                return '<a><img width="25px" src="@{CDN_PATH}' + profileIcon + '"><br>Me</a>';
            }
        },
        '.home-view': {
            '$if': (currentView) => {
                return (currentView === 'home');
            },
            '$repeat': () => {
                console.log('repeat');
                const testData = [
                    {
                        imageURL: "./images/users/1.png",
                        displayName: "Opbeat",
                        userName: "@opbeat",
                        tweetContent: "Slack + Opbeat = ❤️ - Native @SlackHQ integration is here! <span class='tweet-link'>https://opbeat.com/blog/posts/better-slacking-with-opbeat/ ... </span>",
                        tweetImage: "./images/tweets/1.png",
                        tweetAge: "19h",
                        retweets: 14,
                        favorites: 24
                    },
                    {
                        imageURL: "./images//users/2.png",
                        displayName: "The Next Web",
                        userName: "@TheNextWeb",
                        tweetContent: "Facebook threatens Europe with crappy features if regulators don't back off <span class='tweet-link'>http://tnw.co/1Kt1lVS</span>",
                        tweetImage: "./images/tweets/2.png",
                        tweetAge: "7m",
                        retweets: 432,
                        favorites: 1
                    }
                ];

                let tweets = [];

                for(var i = 0, j = testData.length; i < j; i++) {
                    tweets.push({
                       index: i,
                       position: [],
                       model: testData[i]
                    });
                }
                console.log(tweets);
                return tweets;
            }
        },
        '.notifications-view': {
            '$if': (currentView) => {
                return (currentView === 'notifications');
            }
        },
        '.messages-view': {
            '$if': (currentView) => {
                return (currentView === 'messages');
            }
        },
        '.profile-view': {
            '$if': (currentView) => {
                return (currentView === 'profile');
            }
        },
        '$self': {
            'currentView': '[[identity|currentView]]'
        }
    },
    events: {
        '$public' : {
            'messageMe' : function($payload, $state) {
                //console.log($payload);
                $state.set('somechangedState', $payload)
            }
        },
        '$private': {
            'currentView': function($state, $payload) {
                console.log('HERE: ',$payload);

                //Reset icon states
                $state.set('homeIcon', 'assets/images/home.png');
                $state.set('notificationsIcon', 'assets/images/notifications.png');
                $state.set('messagesIcon', 'assets/images/messages.png');
                $state.set('profileIcon', 'assets/images/profile.png');

                // Set new active icon state
                $state.set($payload + 'Icon', 'assets/images/' + $payload + '-active.png');
            }
        },
        '.link-home': {
            'click': ($state) => {
                console.log('home');
                $state.set('currentView', 'home');
            }
        },
        '.link-notifications': {
            'click': ($state) => {
                console.log('link');
                $state.set('currentView', 'notifications');
            }
        },
        '.link-message': {
            'click': ($state) => {
                console.log('msg');
                $state.set('currentView', 'messages');
            }
        },
        '.link-profile': {
            'click': ($state) => {
                console.log('prof');
                $state.set('currentView', 'profile');
            }
        }
        //    <!--<my:api:adapter id="adapter"></my:api:adapter>-->

        //"#adapter":{
        //  "on-tweets-loaded": function($state, $payload){
        //      //$payload contains tweets
        //      $state.set('tweets', $payload.tweets)
        //  }
        //},
    },
    states: {
        headerHeight: 58,
        headerContentHeight: 35,
        footerHeight: 45,
        pageTitle: 'Home',
        homeIcon: 'assets/images/home.png',
        notificationsIcon: 'assets/images/notifications.png',
        messagesIcon: 'assets/images/messages.png',
        profileIcon: 'assets/images/profile.png',
        currentView: 'home'
        //tweets: Tweets
    },
    tree: 'twitter.html'
}).config({
    includes: [
        //'data/twitter-data.js'
    ],
    imports: {
        'creative:twitter': ['tweet2'],
        'super.demo.day:layouts': ['header-footer']
    }
});
