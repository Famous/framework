
//declare the module and its various pieces.
//note that any of the BEST components could be declared inline
//here instead of pointing to an external file.

famous.module({
	name: "zackbrown.todolist",
	behaviors: "zackbrown.todolist.behaviors.js",
	events: "zackbrown.todolist.events.js",
	states: "zackbrown.todolist.states.js",
	template: "zackbrown.todolist.template.js"
})

//note that dependencies are determined by traversing the template tree