FamousFramework.scene('famous-tests:router-test', {
    behaviors: {
        '#home': {
            '$if': function($route) { return $route === '/home'  }
        },
        '#blog': {
            '$if': function($route) { return $route === '/blog'  }
        },
        '#about': {
            '$if': function($route) { return $route === '/about' }
        },
        '#fourOhFour': {
            '$if': function($route) { return $route != '/home' && $route != '/blog' && $route != '/about' }
        },
        '.page': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {
        'node': {
            'click': function() {
                // go home when a page is clicked

                var location = window.location;
                var href = location.href;

                var baseURL = href.substr(0, href.lastIndexOf('/'));
                location.replace(baseURL + '/home');
            }
        }
    },
    states: {},
    tree: 'router-test.html'
});
