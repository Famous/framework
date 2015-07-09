function getData() {
    let data = [];
    for (let i = 0; i < 20; ++i) {
        data.push({
            author: '@famous',
            content: 'Hello, Famous Framework!',
            imageURL: 'https://pbs.twimg.com/profile_images/378800000758419327/fdb265917b06e621611577a9cec23c58_400x400.png'
        });
    }
    return data;
}

const DATA = getData();

FamousFramework.component('famous-demos:twitter:page-tweets', {
    behaviors: {
        '$self': {
            'style': {
                'background-color': '#fff',
                'overflow': 'scroll'
            }
        },
        '.layout': {
            'direction': 1
        },
        '.tweet': {
            'image-url': ($index) => {
                return DATA[$index].imageURL;
            },
            'image-width': '[[identity|tweetImageWidth]]',
            'tweet-author': ($index) => {
                return DATA[$index].author;
            },
            'tweet-content': ($index) => {
                return DATA[$index].content;
            },
            'size-absolute-y': '[[identity|tweetHeight]]',
            'style': {
                'border-bottom': '1px solid #888'
            }
        }
    },
    events: {
        '$public': {
            'page': '[[setter]]'
        }
    },
    states: {
        page: null,
        tweetHeight: 80,
        tweetImageWidth: 80
    },
    tree: `
        <famous:layouts:sequential class='layout'>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
            <tweet class='tweet'></tweet>
        </famous:layouts:sequential>
    `
}).config({
    imports: {
        'famous-demos:twitter': ['datastream', 'tweet']
    }
});
