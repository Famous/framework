BEST.scene('creative:twitter', {
    behaviors: {
        '#app': {
            'align': [0.5, 0],
            'mount-point': [0.5, 0],
            'header-height' : '[[identity|headerHeight]]',
            'footer-height' : '[[identity|footerHeight]]'
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
        '.header-left': {
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
        '.header-center': {
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
        '.header-right': {
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
        //BODY
        '.app-body': {
            'overflow': 'hidden'
        },
        '.body-background': {
            style: {
                'border-bottom': '1px solid rgb(229, 235, 239)',
                'background-color': 'white'
            }
        },
        //FOOTER
        '.app-footer': {
            'size-absolute-y': 45,
            'size-proportional-x': 1,
            style: () => {
                return {
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'background-color': 'white'
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
            'content': 'Foobar',
            /*(homeIcon) => {
                return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + homeIcon + '"><br>Home</a>';
                //return '<a><img width="25px" height="25px" src="@{CDN_PATH}' + homeIcon + '"><br>Home</a>';
            }*/
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
        }
    },
    events: {},
    states: {
        headerHeight: 58,
        footerHeight: 45
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
