//does a module ('zackbrown.todolist') need to be declared here?
//or can module association be handled
//implicitly based on the context under which
//this is loaded?

famous.declareBehaviors(
  function(state, helpers){

    //`state` is a DI'd reference to the state bag
    //for this module, exposing properties strictly
    //by state.get('stringId');  We can statically
    //analyze this code to determine the dependencies
    //for any given behavior.  We do not need to worry
    //about minification, because we don't need to 
    //support persisting minified code—all code should
    //be handed to us unminified, and we perform 
    //minification before passing to the client.

    //as an alternative to static analysis and 'global' DI here
    //the DI can happen at a per-function level,
    //which would allow us to make better guarantees about
    //dependencies and avoid the static analysis step.
    //Especially if aurelia's DI module fits the bill,
    //this may be an easier way to start.

    return {
      "#repeat-me": {
        "famous.controlflow.repeat": function(){
          var data = state.get('listItems');
          //image data is [1,2,3,4,5];

          var returnData = data.map(function(d, i){
            return {
              id: d,
              text: d //this will be evented to
                      //the child via setState({'text': d});
            }
          })

          return [1, 2, 3, 4, 5];
          // ^ array of state injections which will be
          //evented to the child module.  Any time
          //this function is re-evaluated, these
          //states will be re-evented to children.

          //the number of elements here determines how
          //many instances of "zackbrown.todolist.listitem" are
          //instantiated.  The logic for handling this spinning
          //up and down exists in the famous.controlflow.repeat
          //declaration.

          //destruction/creation is also handled by
          //famous.controlflow.repeat—by convention, a
          //unique id ('id' field) tells it how to keep
          //track of a distinct entity, i.e. to move
          //an item instead of creating/destroying one
          //(similar to trackby in angularjs)

          //the child can subscribe to these events
          //however it would like, e.g. by allowing
          //the events to overwrite state every time
          //that the event is triggered, or
          //only setting at constructor time.
        },

      },
      "#main-layout": {
        "famous.transform.size": [undefined, undefined],
        "headerSize": function(){
          //note that this is actually
          //famous.layout.headerfooter.headerSize,
          //but since famous.layout.headerfooter is imported below,
          //this shorthand can be used.  A static analysis
          //step can be used to determine if there are conflicting
          //"headerSize" definitions, similar to C#
          return [undefined, state.get('headerHeight')];
        },
        "footerSize": function(){
          return [undefined, state.get('footerHeight')];
        }
      }
    }
  },
  //these are namespace imports, similar to `using`
  //statements in C#.  These make the code terser above,
  //e.g. for setting headerSize instead of famous.layout.headerfooter.headerSize
  [
    //"famous.transform", //would allow "famous.transform.size" to be expressed as "size"
    "famous.layout.headerfooter"
  ]
);