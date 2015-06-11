const Tweets = [
    {
        imageURL: "assets/images/users/1.png",
        displayName: "Opbeat",
        userName: "@opbeat",
        tweetContent: "Slack + Opbeat = ❤️ - Native @SlackHQ integration is here! <span class='tweet-link'>https://opbeat.com/blog/posts/better-slacking-with-opbeat/ ... </span>",
        tweetImage: "assets/images/tweets/1.png",
        tweetAge: "19h",
        retweets: 14,
        favorites: 24
    },
    {
        imageURL: "assets/images/users/2.png",
        displayName: "The Next Web",
        userName: "@TheNextWeb",
        tweetContent: "Facebook threatens Europe with crappy features if regulators don't back off <span class='tweet-link'>http://tnw.co/1Kt1lVS</span>",
        tweetImage: "assets/images/tweets/2.png",
        tweetAge: "7m",
        retweets: 432,
        favorites: 1
    },
    {
        imageURL: "assets/images/users/4.png",
        displayName: "Huffington Post",
        userName: "@HuffingtonPost",
        tweetContent: "Queen Latifah sounds off on the gay community <span class='tweet-link'>http://huff.to/1DI2gNN</span>",
        tweetAge: "11m",
        retweets: 43,
        favorites: 109
    },
    {
        imageURL: "assets/images/users/5.png",
        displayName: "Design Learn Bot",
        userName: "@DesignLearnBot",
        tweetContent: "<span class='tweet-link'>http://hemuhemu2013.web.fc2.com/</span> #html #HTML #html5 #HTML5 #css #CSS #css3 #CSS3 #html #web #WEB #follow #Rt #rt",
        tweetAge: "32m",
        retweets: 87,
        favorites: 742
    },
    {
        imageURL: "assets/images/users/6.png",
        displayName: "The Verge",
        userName: "@verge",
        tweetContent: "James Cameron may have accidentally written a fifth Avatar movie already <span class='tweet-link'>http://theverge.com/e/8275680</span>",
        tweetImage: "assets/images/tweets/6.png",
        tweetAge: "1h",
        retweets: 872,
        favorites: 22
    },
    {
        imageURL: "assets/images/users/7.png",
        displayName: "The New York Times",
        userName: "@nytimes",
        tweetContent: "Meet a man condemned to be executed in Iran who won a rare pardon <span class='tweet-link'>http://nyti.ms/1bSduIJ</span>",
        tweetImage: "assets/images/tweets/7.png",
        tweetAge: "4d",
        retweets: 342,
        favorites: 42
    },
    {
        imageURL: "assets/images/users/8.png",
        displayName: "The Verge",
        userName: "@verge",
        tweetContent: "European cars will automatically call emergency services after a crash <span class='tweet-link'>http://theverge.com/e/8276886</span>",
        tweetImage: "assets/images/tweets/8.png",
        tweetAge: "28m",
        retweets: 22,
        favorites: 62
    },
    {
        imageURL: "assets/images/users/9.png",
        displayName: "OXITS",
        userName: "@OXITS",
        tweetContent: "DDoS-ers Top 330Gbps in Massive Attack <span class='tweet-link'>http://goo.gl/o9AruH</span>  #Cyber #Wearables",
        tweetImage: "assets/images/tweets/9.png",
        tweetAge: "31m",
        retweets: 22,
        favorites: 492
    },
    {
        imageURL: "assets/images/users/10.png",
        displayName: "Forbes News",
        userName: "@ForbesTech",
        tweetContent: "\"The evidence of Ulbricht's guilt was, in all respects, overwhelming.\" <span class='tweet-link'>http://onforb.es/1DxStsa</span>",
        tweetImage: "assets/images/tweets/10.png",
        tweetAge: "37m",
        retweets: 14,
        favorites: 24
    },
    {
        imageURL: "assets/images/users/11.png",
        displayName: "Mashable",
        userName: "@mashable",
        tweetContent: "Is it possible to predict where and when earthquakes will strike? <span class='tweet-link'>http://on.mash.to/1EnlYkj</span> @conversationuk",
        tweetAge: "40m",
        retweets: 432,
        favorites: 1
    },
    {
        imageURL: "assets/images/users/12.png",
        displayName: "Engadget",
        userName: "@engadget",
        tweetContent: "Movie streaming service Popcorn Time blocked by UK court <span class='tweet-link'>http://engt.co/1GGJmwT</span>",
        tweetImage: "assets/images/tweets/12.png",
        tweetAge: "41m",
        retweets: 43,
        favorites: 109
    },
    {
        imageURL: "assets/images/users/13.png",
        displayName: "The Next Web",
        userName: "@TheNextWeb",
        tweetContent: "UX designers: Side drawer navigation could cost you 50% of your user engagement <span class='tweet-link'>http://tnw.me/w0JrUHR</span>",
        tweetImage: "assets/images/tweets/13.png",
        tweetAge: "1h",
        retweets: 87,
        favorites: 742
    },
    {
        imageURL: "assets/images/users/14.png",
        displayName: "Meteor",
        userName: "@meteorjs",
        tweetContent: "\"Two weeks with @reactjs + #meteorjs,\" a talk by @MaxHarris9 <span class='tweet-link'>https://www.meteor.com/blog/2015/04/29/two-weeks-with-react-and-meteor ...</span>",
        tweetAge: "1h",
        retweets: 872,
        favorites: 22
    },
    {
        imageURL: "assets/images/users/15.png",
        displayName: "TechCrunch",
        userName: "@TechCrunch",
        tweetContent: "IBM Researchers Can Now Spot Errors In Quantum Calculations <span class='tweet-link'>http://tcrn.ch/1drCV4i</span> by @kylebrussell",
        tweetAge: "1h",
        retweets: 342,
        favorites: 42
    },
    {
        imageURL: "assets/images/users/16.png",
        displayName: "The New York Times",
        userName: "@nytimes",
        tweetContent: "Excerpts from the #SCOTUS same-sex marriage arguments <span class='tweet-link'>http://nyti.ms/1bSdsR7</span>",
        tweetImage: "assets/images/tweets/16.png",
        tweetAge: "1h",
        retweets: 22,
        favorites: 62
    },
    {
        imageURL: "assets/images/users/17.png",
        displayName: "WIRED",
        userName: "WIRED",
        tweetContent: "Holograms could bring videogame-like navigation to your car <span class='tweet-link'>http://wrd.cm/1AcY2MD</span>",
        tweetImage: "assets/images/tweets/17.png",
        tweetAge: "2h",
        retweets: 22,
        favorites: 492
    },
    {
        imageURL: "assets/images/users/18.png",
        displayName: "Tobias Mauel",
        userName: "@TobiasMauel",
        tweetContent: "Some have Disneyland, I have #TNWEurope. So excited to be here!",
        tweetImage: "assets/images/tweets/18.png",
        tweetAge: "2h",
        retweets: 14,
        favorites: 24
    }
];

FamousFramework.scene('creative:twitter', {
    behaviors: {
        '#app': {
            'align': [0.5, 0],
            'mount-point': [0.5, 0],
            'header-height' : (header) => {
                return header.height;
            },
            'footer-height' : (footer) => {
                return footer.height;
            },
            style: {
                'width': '100%',
                'height': '100%',
                'overflow': 'hidden'
            }
        },
        '$self': {
            'currentView': '[[identity|currentView]]'
        },
        //HEADER
        '.app-header': {

        },
        '.header-background': {
            'size-proportional-x': 1,
            'size-proportional-y': 1,
            'style': {
                'background-color': '#55ACEE'
            }
        },
        '.header-left': { //Follow
            'align': [0, 1],
            'mount-point': [0, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': (header) => {
                return header.contentHeight;
            },
            'content': (header) => {
                return '<a><img width="' + header.contentHeight + 'px" src=' + header.icons.follow + '></a>';
            },
            'style': (header) => {
                return {
                    'line-height': header.contentHeight + "px",
                    'text-align': 'left'
                }
            }
        },
        '.header-center': { //Title
            'align': [0.5, 1],
            'mount-point': [0.5, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': (header) => {
                return header.contentHeight;
            },
            'content': (header) => {
                return '<div class="title">' + header.title + '</div>';
            },
            style: (header) => {
                return {
                    'color': 'white',
                    'line-height': header.contentHeight + 'px',
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'text-align': 'center'
                };
            }
        },
        '.header-right': {
            'align': [1, 1],
            'mount-point': [1, 1],
            'size-absolute-x': window.innerWidth / 3,
            'size-absolute-y': (header) => {
                return header.contentHeight;
            },
            'content': (header) => {
                return '' +
                    '<a><img width="' + header.contentHeight + 'px" src=' + header.icons.search + '></a>' +
                    '<a><img width="' + header.contentHeight + 'px" src=' + header.icons.tweet + '></a>';
            },
            'style': (header) => {
                return {
                    'line-height': header.contentHeight + 'px',
                    'text-align': 'right'
                }
            }
        },
        //BODY
        '.app-body': {
            'overflow': 'scroll'
        },
        '.body-background': {
            'position-z': 2,
            style: {
                'border-bottom': '1px solid rgb(229, 235, 239)',
                'background-color': 'white',
                'z-index': 2
            }
        },
        'tweet': {
            '$repeat': (tweetsData) => {
                let tweets = [];

                for(let i = 0, j = tweetsData.length; i < j; i++) {
                    tweets.push({
                        model: tweetsData[i],
                        positionY: i * 250,
                        positionZ: 3,
                        sizeY: 250
                    });
                }

                return tweets;
            }
        },
        //FOOTER
        '.app-footer': {
            'size-absolute-y': 45,
            'size-proportional-x': 1,
            'position-z': 5,
            style: () => {
                return {
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'background-color': 'white',
                    'z-index': 5
                };
            }
        },
        '.footer-background': {
            style: {
                'background-color': 'white'
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
            'content': (footer) => {
                return '<a><img width=' + footer.iconSize + ' height=' + footer.iconSize + ' src=' + footer.icons.home + '><br>Home</a>';
            }
        },
        '.link-notifications': {
            'align': [.25, 0],
            'content': (footer) => {
                return '<a><img width=' + footer.iconSize + ' height=' + footer.iconSize + ' src=' + footer.icons.notifications + '><br>Notifications</a>';
            }
        },
        '.link-message': {
            'align': [.5, 0],
            'content': (footer) => {
                return '<a><img width=' + footer.iconSize + ' height=' + footer.iconSize + ' src=' + footer.icons.messages + '><br>Messages</a>';
            }
        },
        '.link-profile': {
            'align': [.75, 0],
            'content': (footer) => {
                return '<a><img width=' + footer.iconSize + ' height=' + footer.iconSize + ' src=' + footer.icons.profile + '><br>Me</a>';
            }
        }
    },
    events: {
        '$private': {
            'currentView': ($state, $payload) => {
                $state.set('homeIcon', 'assets/images/home.png');
                $state.set('notificationsIcon', 'assets/images/notifications.png');
                $state.set('messagesIcon', 'assets/images/messages.png');
                $state.set('profileIcon', 'assets/images/profile.png');
                $state.set('pageTitle', $payload);

                let offScreenPos = window.innerWidth;
                let transition = {
                    /*duration: 1000,
                     curve: 'inOutBack'*/
                };

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
    },
    states: {
        currentView: 'home',
        homeViewPositionX: 0,
        notificationViewPositionX: window.innerWidth,
        messagesViewPositionX: window.innderWidth,
        profileViewPositionX: window.innerWidth,
        //HEADER
        header: {
            title: 'Home',
            height: 58,
            contentHeight: 35,
            icons: {
                tweet: '{{@CDN_PATH}}assets/images/tweet.png',
                follow: '{{@CDN_PATH}}assets/images/follow.png',
                search: '{{@CDN_PATH}}assets/images/search.png'
            }
        },
        //BODY
        tweetsData: Tweets,
        //FOOTER
        footer: {
            height: 45,
            iconSize: '25px',
            icons: {
                home: '{{@CDN_PATH}}assets/images/home.png',
                homeActive: '{{@CDN_PATH}}assets/images/home-active.png',
                notifications: '{{@CDN_PATH}}assets/images/notifications.png',
                notificationsActive: '{{@CDN_PATH}}assets/images/notifications-active.png',
                messages: '{{@CDN_PATH}}assets/images/messages.png',
                messagesActive: '{{@CDN_PATH}}assets/images/messages-active.png',
                profile: '{{@CDN_PATH}}assets/images/profile.png',
                profileActive: '{{@CDN_PATH}}assets/images/profile-active.png'
            }
        }
    },
    tree: 'twitter.html'
}).config({
    includes: [
        'assets/styles/twitter.css'
    ],
    imports: {
        'creative:twitter': ['tweet', 'messages', 'notification', 'profile'],
        'famous:layouts': ['header-footer']
    }
});
