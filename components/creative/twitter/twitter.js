BEST.scene('creative:twitter', 'HEAD', {
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
                return '<div class="title">' + pageTitle + '</div>';
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
                    'font-size': '11px'
                };
            }
        },
        '.link-home': {
            'align': [0, 0],
            'content': (homeIcon) => {
                return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + homeIcon + '"><br>Home</a>';
            },
            'style': {
                'background-image': '@{assets/images/home.png}'
            }
        },
        '.link-notifications': {
            'align': [.25, 0],
            'content': (notificationsIcon) => {
                return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + notificationsIcon + '"><br>Notifications</a>';
            }
        },
        '.link-message': {
            'align': [.5, 0],
            'content': (messagesIcon) => {
                return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + messagesIcon + '"><br>Messages</a>';
            }
        },
        '.link-profile': {
            'align': [.75, 0],
            'content': (profileIcon) => {
                return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + profileIcon + '"><br>Me</a>';
            }
        },
        '.tweet': {
            '$repeat': () => {
                const testData = [
                    {
                        imageURL: "assets/images/users/1.png",
                        displayName: "Opbeat",
                        userName: "@opbeat",
                        tweetContent: "Slack + Opbeat = ❤️ - Native @SlackHQ integration is here! <span class='tweet-link'>https://opbeat.com/blog/posts/better-slacking-with-opbeat/ ... </span>",
                        tweetImage: "",
                        tweetAge: "19h",
                        retweets: 14,
                        favorites: 24
                    },
                    {
                        imageURL: "assets/images/users/1.png",
                        displayName: "The Next Web",
                        userName: "@TheNextWeb",
                        tweetContent: "Facebook threatens Europe with crappy features if regulators don't back off <span class='tweet-link'>http://tnw.co/1Kt1lVS</span>",
                        tweetImage: "assets/images/tweets/best.png",
                        tweetAge: "7m",
                        retweets: 432,
                        favorites: 1
                    }
                ];

                let tweets = [];

                for(var i = 0, j = testData.length; i < j; i++) {
                    let model = testData[i];

                    tweets.push({
                        model: model,
                        index: i,
                        positionY: i * 150,
                        sizeY: 150
                    });
                }

                return tweets;
            }
        },
        '.home-view': {
            'position-x': '[[identity|homeViewPositionX]]'
            /*'position-x': (currentView) => {
                return (currentView === 'home') ? 0 : window.innerWidth;
            }*/
        },
        '.notifications-view': {
            'position-x': '[[identity|notificationsViewPositionX]]'
            /*'position-x': (currentView) => {
                return (currentView === 'notifications') ? 0 : window.innerWidth;
            }*/
        },
        '.messages-view': {
            'position-x': '[[identity|messagesViewPositionX]]'
            /*'position-x': (currentView) => {
                return (currentView === 'messages') ? 0 : window.innerWidth;
            }*/
        },
        '.profile-view': {
            'position-x': '[[identity|profileViewPositionX]]'
            /*'position-x': (currentView) => {
                return (currentView === 'profile') ? 0 : window.innerWidth;
            }*/
        },
        '$self': {
            'currentView': '[[identity|currentView]]'
        }
    },
    events: {
        '$public' : {
            'messageMe' : function($payload, $state) {
                $state.set('somechangedState', $payload)
            }
        },
        '$private': {
            'currentView': function($state, $payload) {
                $state.set('homeIcon', 'assets/images/home.png');
                $state.set('notificationsIcon', 'assets/images/notifications.png');
                $state.set('messagesIcon', 'assets/images/messages.png');
                $state.set('profileIcon', 'assets/images/profile.png');
                $state.set('pageTitle', $payload);

                let transition = {
                    duration: 1000,
                    curve: 'inOutBack'
                };

                let offScreenPos = window.innerWidth;

                if ($payload === 'home') {
                    $state.set('homeViewPositionX', 0, transition);
                    $state.set('notificationsViewPositionX', offScreenPos, transition);
                    $state.set('messagesViewPositionX', offScreenPos, transition);
                    $state.set('profileViewPositionX', offScreenPos, transition);
                } else if($payload === 'notifications') {
                    $state.set('homeViewPositionX', offScreenPos, transition);
                    $state.set('notificationsViewPositionX', 0, transition);
                    $state.set('messagesViewPositionX', offScreenPos, transition);
                    $state.set('profileViewPositionX', offScreenPos, transition);
                } else if($payload === 'messages') {
                    $state.set('homeViewPositionX', offScreenPos, transition);
                    $state.set('notificationsViewPositionX', offScreenPos, transition);
                    $state.set('messagesViewPositionX', 0, transition);
                    $state.set('profileViewPositionX', offScreenPos, transition);
                } else if($payload === 'profile') {
                    $state.set('homeViewPositionX', offScreenPos, transition);
                    $state.set('notificationsViewPositionX', offScreenPos, transition);
                    $state.set('messagesViewPositionX', offScreenPos, transition);
                    $state.set('profileViewPositionX', 0, transition);
                }

                $state.set($payload + 'Icon', 'assets/images/' + $payload + '-active.png');
            }
        },
        '.link-home': {
            'click': ($state) => {
                $state.set('currentView', 'home');
            }
        },
        '.link-notifications': {
            'click': ($state) => {
                $state.set('currentView', 'notifications');
            }
        },
        '.link-message': {
            'click': ($state) => {
                $state.set('currentView', 'messages');
            }
        },
        '.link-profile': {
            'click': ($state) => {
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
        currentView: 'home',
        homeViewPositionX: 0,
        notificationViewPositionX: window.innerWidth,
        messagesViewPositionX: window.innderWidth,
        profileViewPositionX: window.innerWidth
    },
    tree: 'twitter.html'
}).config({
    includes: [
        'assets/styles/twitter.css'
    ],
    imports: {
        'creative:twitter': ['tweet'],
        'super.demo.day:layouts': ['header-footer']
    }
});
