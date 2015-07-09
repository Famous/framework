FamousFramework.component('famous-demos:twitter:page', {
    behaviors: {
        '$self': {
            'style': {
                'background-color': '#fff',
                'overflow': 'scroll'
            }
        },
        'page-tweets': {
            '$if': (pageId) => {
                return pageId === 'tweets';
            }
        }
    },
    events: {
        '$public': {
            'page-id': '[[setter|pageId]]'
        }
    },
    states: {
        pageId: null
    },
    tree: `
        <page-tweets></page-tweets>
    `
}).config({
    imports: {
        'famous-demos:twitter': ['page-tweets']
    }
});
