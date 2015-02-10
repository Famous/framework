
famous.module({
	name: "famous.layout.header-footer",
	behaviors: {
		//binders bind behaviors to the elements of this module's template
		binders: {
			"#header": {
				"famous.core.size": function(headerSize, direction){
					if(direction === 'VERTICAL'){
						return [undefined, headerSize];
					}else{
						return [headerSize, undefined];
					}
				},
				"famous.transform.translate": [0,0,0],
				"famous.control-flow.pass-through": function(){
					//this returns a selector (alternatively, returns a filter function of (DOM Elements -> DOM Elements))
					//that describes which nodes from the PARENT to pass through into this element in this module.
					return "#header"
				}
			},
			"#content": {
				"famous.core.size": function(headerSize, footerSize, direction, $size){
					var magnitude = direction === 'VERTICAL' ? $size[1] : $size[0];
					var contentSize = magnitude - (headerSize + footerSize);
					if(direction === 'VERTICAL'){
						return [undefined, contentSize];
					}else{
						return [contentSize, undefined];
					}
				},
				"famous.transform.translate": function(headerSize){
					if(direction === 'VERTICAL'){
						return [0, headerSize, 0];
					}else{
						return [headerSize, 0, 0];
					}
				},
				"famous.control-flow.pass-through": function(){
					return "#content"
				}
			},
			"#footer": {
				"famous.core.size": function(footerSize){
					if(direction === 'VERTICAL'){
						return [undefined, footerSize];
					}else{
						return [footerSize, undefined];
					}
				},
				"famous.transform.origin": function(direction){
					return direction === 'VERTICAL' ? [0, 1, 0] : [1, 0, 0]
				}
				"famous.control-flow.pass-through": function(){
					return "#footer"
				}
			}
		},
		//handlers are the public-facing behavior API.
		//they can be reasoned about as a special case of events.
		handlers: {
			"header-size": function(target, payloadFn, state){
				//target looks like:
				// {
				// 	renderNode: a reference to the actual render node
				// 	targetState: a bag of state that is associated with this element—specifically 
				// 	             for things like keeping a vector in memory instead of GC
				// }
				var size = payloadFn();
				state.set('headerSize', size);
			},
			"content-size": function(target, payloadFn, state){
				var size = payloadFn();
				state.set('contentSize', size);
			},
			"footer-size": function(target, payloadFn, state){
				var size = payloadFn();
				state.set('footerSize', size);
			},
			"direction": function(target, payloadFn, state){
				var direction = payloadFn();
				if(direction !== "VERTICAL" && direction !== "HORIZONTAL"){
					throw new Error("The only acceptable values for a HeaderFooterLayout's Direction are 'VERTICAL' and 'HORIZONTAL'");
				}
				state.set('direction', direction);
			}
		}
	},
	events: {

	},
	states: {
		//$size is maintained automatically
		headerSize: 0,
		footerSize: 0,
		direction: 'VERTICAL'
	},
	template: "famous.layout.header-footer.template.html"
});