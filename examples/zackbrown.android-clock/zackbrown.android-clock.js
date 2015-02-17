
famous.module({
  name: "zackbrown.android-clock",
  behaviors: {
    "#header-footer": {
      "famous.layout.header-footer.header-size": "60px";
    },

    //declare and map out the header
    "#header-buttons": {
      "famous.control-flow.repeat": function(clockDefinitions){
        return clockDefinitions;
      }
    },
    ".header-button img": {
      "famous.html.img.src": function(buttonImgSrc){
        //the buttonImgSrc state comes from the values returned by `repeat`
        return buttonImgSrc;
      }
    },

    //declare and map out the panels
    "#panels": {
      "famous.control-flow.repeat": function(clockDefinitions){
        return clockDefinitions;
      }
    },
    ".panel": {
      "famous.control-flow.if": function(clockId, $element){
        //$element is a helper for properties of the element (e.g. classlist, tagname, id)
        return clockId === $element.id;
      }
    }

    //translate the group of panels
    "#content": {
      "famous.transform.translate": function(panelPositionX){
        return [panelPositionX, 0, 0];
      }
    }
  },
  events: {
    "header-button-clicked": function(args, state){
      state.set('selectedIndex', state.get('$index'));
    },
    "panel-touch-moved": function(args, state){
      state.set('panelPositionX', state.get('panelPositionX') + args.deltaX);
    },
    "panel-touch-ended": function(args, state){
      var moduleWidth = state.get('$size')[0];
      var panelPositionX = state.get('panelPositionX');
      var closestIndex = Math.round(panelPositionX / moduleWidth);
      //since there's a trigger set on state-change:selectedIndex, the
      //translation back to the correct baseline will fire automatically.
      state.set('selectedIndex', closestIndex);
    },
    //similar to how "behavior:"-prefixed event handlers are "special,"
    //"state-change:" is a convention for events that will be fired when
    //members of the module state bag are mutated.
    "state-change:selectedIndex": function(args, state){
      //args has oldValue, newValue
      var moduleWidth = state.get('$size')[0];
      var newIndex = args.newValue;
      state.set('panelPositionX', moduleWidth * newIndex, {duration: 300, curve: 'easeIn'});
    }
  },
  states: {
    clockDefinitions: [
      {
        clockId: "alarm-clock",
        buttonImgSrc: "alarm-clock-icon.png"
      },
      {
        clockId: "clock",
        buttonImgSrc: "clock-icon.png"
      },
      {
        clockId: "countdown"
        buttonImgSrc: "countdown-icon.png"
      },
      {
        clockId: "stopwatch"
        buttonImgSrc: "stopwatch-icon.png"
      }
    ]
  },
  selectedClock: "alarmClock",
  template: "zackbrown.android-clock.template.html"
});