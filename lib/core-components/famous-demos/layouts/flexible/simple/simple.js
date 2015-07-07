FamousFramework.component('famous-demos:layouts:flexible:simple', {
    behaviors: {
        'famous:layouts:flexible': {
            'direction': 0,
            'ratios': [1, true, 2, true, 5, true, 10, true, 5, true, 2, true, 1]
        },
        '.item': {
            'style': {
                'background-color': '#000',
                'color': '#fff'
            }
        },
        '.splitter': {
            'size-absolute-x': 1,
            'style': {
                'background-color': '#fff'
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:flexible>
            <node class="item"><div>1</div></node>
            <node class="splitter"></node>
            <node class="item"><div>2</div></node>
            <node class="splitter"></node>
            <node class="item"><div>5</div></node>
            <node class="splitter"></node>
            <node class="item"><div>10</div></node>
            <node class="splitter"></node>
            <node class="item"><div>5</div></node>
            <node class="splitter"></node>
            <node class="item"><div>2</div></node>
            <node class="splitter"></node>
            <node class="item"><div>1</div></node>
        </famous:layouts:flexible>
    `
});
