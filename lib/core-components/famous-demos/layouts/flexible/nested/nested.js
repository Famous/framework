FamousFramework.component('famous-demos:layouts:flexible:nested', {
    behaviors: {
        '.wrapper': {
            'direction': 0,
            'ratios': [3, true, 1, true, 2]
        },
        '.first': {
            'direction': 1,
            'ratios': [1, true, 5]
        },
        '.second': {
            'direction': 0,
            'ratios': [1]
        },
        '.third': {
            'direction': 1,
            'ratios': [5, true, 1]
        },
        '.item': {
            'style': {
                'background-color': '#000',
                'color': '#fff'
            }
        },
        '.splitter': {
            'style': {
                'background-color': '#fff'
            }
        },
        '.horizontal.splitter': {
            'size-absolute-y': 1,
        },
        '.vertical.splitter': {
            'size-absolute-x': 1,
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:flexible class="wrapper">
            <famous:layouts:flexible class="first">
                <node class="item"><div>1</div></node>
                <node class="horizontal splitter"></node>
                <node class="item"><div>2</div></node>
            </famous:layouts:flexible>
            <node class="vertical splitter"></node>
            <famous:layouts:flexible class="second">
                <node class="item"><div>3</div></node>
            </famous:layouts:flexible>
            <node class="vertical splitter"></node>
            <famous:layouts:flexible class="third">
                <node class="item"><div>4</div></node>
                <node class="horizontal splitter"></node>
                <node class="item"><div>5</div></node>
            </famous:layouts:flexible>
        </famous:layouts:flexible>
    `
});
