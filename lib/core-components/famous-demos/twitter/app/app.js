const INITIAL_PAGE_ID = 'tweets';

FamousFramework.component('famous-demos:twitter:app', {
    behaviors: {
        '.layout': {
            'direction': 1,
            'ratios': [true, 1, true]
        },
        '.navbar': {
            'size-absolute-y': 50
        },
        '.page': {
            'page-id': '[[identity|pageId]]'
        },
        '.tabbar': {
            'size-absolute-y': 50
        }
    },
    events: {},
    states: {
        pageId: INITIAL_PAGE_ID
    },
    tree: `
        <famous:layouts:flexible class="layout">
            <navbar class="navbar"></navbar>
            <page class="page"></page>
            <tabbar class="tabbar"></tabbar>
        </famous:layouts:flexible>
    `
}).config({
    imports: {
        'famous-demos:twitter': ['navbar', 'page', 'tabbar']
    }
});
