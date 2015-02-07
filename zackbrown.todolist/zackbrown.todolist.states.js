

famous.declareStates(
  function(eventStream){

    //should events and states share a closure?  it's convenient
    //because the standard use-case for events is to mutate state.
    //that said, the mutation could happen through a setter interface,
    //which makes our lives even easier for handling recomputations
    //of behavior binders:  instead of having to use Object.observe, we
    //can simply keep track of our own sets.
    //How would we handle transitionables, though?
    var events = {
      customClickEvent: function(args, listItemState){
        //note that this is defined in the template, on the zackbrown.totolist.listitem tag.
        listItemState.get('');

      },
      otherEventName: function(args){
        //handler
        //should we switch over target?  and break out
        //behavior accordingly?  and/or should we be able
        //to specify events more granularly, perhaps
        //in the template?

        //yes, specify in the template.  The state bag
        //exposed by the module to which the event is bound
        //will be passed as an argument as well as the standard
        //event args.  This supports, e.g. getting the
        //index of the clicked item in a repeated list
        //(since it can be exposed by its state bag.)
      };

      var states = {
        x: _x,
        y: _y,
        z: _z
      }

      return states;

    }



  }