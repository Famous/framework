const COLORS = ['#990000', '#009900', '#000099', '#999900', '#990099'];
const SIZES = [100, 70, 250, 100, 200];

FamousFramework.component('famous-demos:layouts:sequential:simple', {
    behaviors: {
        'famous:layouts:sequential': {
            'direction': 0
        },
        '.item': {
            'style': {
                'color': '#fff'
            }
        },
        '.item.one': {
            'content': `${SIZES[0]}px`,
            'size-absolute-x': SIZES[0],
            'style': {
                'background-color': COLORS[0]
            }
        },
        '.item.two': {
            'content': `${SIZES[1]}px`,
            'size-absolute-x': SIZES[1],
            'style': {
                'background-color': COLORS[1]
            }
        },
        '.item.three': {
            'content': `${SIZES[2]}px`,
            'size-absolute-x': SIZES[2],
            'style': {
                'background-color': COLORS[2]
            }
        },
        '.item.four': {
            'content': `${SIZES[3]}px`,
            'size-absolute-x': SIZES[3],
            'style': {
                'background-color': COLORS[3]
            }
        },
        '.item.five': {
            'content': `${SIZES[4]}px`,
            'size-absolute-x': SIZES[4],
            'style': {
                'background-color': COLORS[4]
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <famous:layouts:sequential>
            <node class="item one"></node>
            <node class="item two"></node>
            <node class="item three"></node>
            <node class="item four"></node>
            <node class="item five"></node>
        </famous:layouts:sequential>
    `
});
