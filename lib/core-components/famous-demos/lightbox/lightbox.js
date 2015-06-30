FamousFramework.component('famous-demos:lightbox', {
  behaviors: {
    '#container': {
      
    },
    '.cell': {
      '$repeat': function(numberOfElements){
        var ret = [];
        for(var i = 0; i < numberOfElements; i++){
          ret[i] = i;
        }
        return ret;
      }, 
      'position': function($index, positions){
        if(positions && positions[$index])
          return positions[$index];
        else return [0,0];
      },
      'size': function(options, width, height){
        return [width / options.columns, height / options.rows];
      },
      'style': {
        'background-color': 'red',
        'border': '5px solid black;'
      }
    }
  },
  events: {
    '$lifecycle': {
      'post-load': function($state){
        var numberOfElements = $state.get('numberOfElements');
        var positions = [];
        for(var i = 0; i < numberOfElements; i++){
          positions[i] = [0,0];
        }
        $state.set('positions', positions);
      }
    },
    '$self': {
      'size-change': function($state, $famousNode){
        var size = $famousNode.getSize();
        var width = size[0];
        var height = size[1];
        $state.set('width', width);
        $state.set('height', height);

        var maxColumns = 1;
        if(width <= 320){
          maxColumns = 1;
        }else if(width <= 680){
          maxColumns = 2;
        }else if(width <= 980){
          maxColumns = 3;
        }else {
          maxColumns = 5;
        }

        var options = $state.get('options');
        var numberOfElements = $state.get('numberOfElements');
        var transition = $state.get('transition');
        var transitionStagger = $state.get('transitionStagger');
        var originalPositions = $state.get('positions');

        for(var i = 0; i < numberOfElements; i++){
          console.log('i', i);
          console.log('orig', originalPositions[i]);
          var rows = options.rows;
          var columns = Math.min(maxColumns, options.columns);
          var gutter = options.gutter;

          var thisColumn = i % columns;
          var thisRow = Math.floor(i / columns);
          var cellWidth = (width - ((columns - 1) * gutter)) / columns;
          var cellHeight = (height - ((rows - 1) * gutter)) / rows;

          var gutterOffsetX = thisColumn * gutter;
          var gutterOffsetY = thisRow * gutter;
          
          //TODO: need to be able to support staggering
          //this is a hack
          $state.set(['positions', i], originalPositions[i], {duration: 1 + transitionStagger * i, curve: 'linear'})
            .thenSet(['positions',i],[gutterOffsetX + cellWidth * thisColumn, gutterOffsetY + cellHeight * thisRow], transition);
        }
      }
    }
  },
  states: {
    options: {
      rows: 4,
      columns: 4,
      gutter: 25
    },
    transition: {curve: 'inOutElastic', duration: 400},
    transitionStagger: 80,
    width: 0,
    height: 0,
    numberOfElements: 12,
    //TODO:  would be really nice if the array syntax for $state.set
    //       would support setting a previously non-existing property
    //       (alternative is programmatically filling it out in post-load evt)
    positions: []
  },
  tree: `
    <node id="container">
      <node class="cell"></node>
    </node>
  `
});