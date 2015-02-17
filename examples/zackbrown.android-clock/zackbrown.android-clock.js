
famous.module({
  name: "zackbrown.android-clock",
  behaviors: {
    "#header-footer": {
      "famous.layout.header-footer.header-size": "60px";
    },
    "#panels": {
      "famous.control-flow.repeat": function(clockDefinitions){
        return clockDefinitions;
      }
    }
  },
  events: {
    
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
  template: "zackbrown.android-clock.template.html"
});