FamousFramework.scene('famous-demos:simplified-todos', {
    behaviors: {
        '#list': {
            'inner-html': function(todos) {
                return todos.map(function(todo) {
                    return `<li>${todo}</li>`;
                }).join('');
            }
        }
    },
    events: {
        '#input': {
            'famous:events:change': function($state, $event) {
                $state.set('todos', $state.get('todos').concat($event.value));
            }
        }
    },
    states: {
        todos: []
    },
    tree: `
        <div id="todos">
            <h1>todos</h1>
            <input id="input" name="todo" placeholder="What needs to be done?">
            <ol id="list"></ol>
        </div>
    `
})
.config({
    includes: ['todos.css']
});
