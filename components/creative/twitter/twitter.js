BEST.scene('creative:twitter', {
    behaviors: {
        '#container': {
            'align': [0.5, 0],
            'mount-point': [0.5, 0]
        },
        '#hf': {
            'header-height' : '[[identity|headerHeight]]',
            'footer-height' : '[[identity|footerHeight]]',

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
        '.body': {
            style: () => {
                return {
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif',
                    'border-bottom': '1px solid rgb(229, 235, 239)',
                }
            }
        },
        '.footer': {
            'size-absolute-y': 45,
            'size-proportional-x': 1,
            style: () => {
                return {
                    'font-family': 'Helvetica, Arial, \'Lucida Grande\', sans-serif'
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
                console.log('homeIcon',homeIcon);
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
        }
    },
    events: {
        '.link-home': {
            'click': () => {
                console.log('home clicked');
            },
            'mouseover': ($state) => {
                $state.set('homeIcon', 'assets/images/home-active.png')
            },
            'mouseout': ($state) => {
                $state.set('homeIcon', 'assets/images/home.png')
            }
        },
        '.link-notifications': {
            'click': () => {
                console.log('notifications clicked');
            },
            'mouseover': ($state) => {
                $state.set('notificationsIcon', 'assets/images/notifications-active.png')
            },
            'mouseout': ($state) => {
                $state.set('notificationsIcon', 'assets/images/notifications.png')
            }
        },
        '.link-message': {
            'click': () => {
                console.log('message clicked');
            },
            'mouseover': ($state) => {
                $state.set('messagesIcon', 'assets/images/messages-active.png')
            },
            'mouseout': ($state) => {
                $state.set('messagesIcon', 'assets/images/messages.png')
            }
        },
        '.link-profile': {
            'click': () => {
                console.log('profile clicked');
            },
            'mouseover': ($state) => {
                $state.set('profileIcon', 'assets/images/profile-active.png')
            },
            'mouseout': ($state) => {
                $state.set('profileIcon', 'assets/images/profile.png')
            }
        }
    },
    states: {
        headerHeight: 58,
        headerContentHeight: 35,
        footerHeight: 45,
        pageTitle: 'Home',
        homeIcon: 'assets/images/home.png',
        notificationsIcon: 'assets/images/notifications.png',
        messagesIcon: 'assets/images/messages.png',
        profileIcon: 'assets/images/profile.png'
    },
    tree: 'twitter.html'
}).config({
    imports: {
        //'creative:twitter': ['tweets'],
        'super.demo.day:layouts': ['header-footer']
    }
});
