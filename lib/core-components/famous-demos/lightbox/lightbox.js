FamousFramework.component('famous-demos:lightbox', {
  behaviors: {
    '#container': {
      
    },
    '.cell': {
      '$repeat': function(){
        return [1,2,3,4,5,6,7,8,9];
      }, 
      'position': function($index, options, width, height){
        var rows = options.rows;
        var columns = options.columns;
        var gutter = options.gutter;

        var thisColumn = $index % columns;
        var thisRow = Math.floor($index / columns);
        var cellWidth = width / columns;
        var cellHeight = height / rows;
        
        return [cellWidth * thisColumn, cellHeight * thisRow];
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
    '$self': {
      'size-change': function($state, $famousNode){
        var size = $famousNode.getSize();
        $state.set('width', size[0]);
        $state.set('height', size[1]);
      }
    }
  },
  states: {
    options: {
      rows: 4,
      columns: 5,
      gutter: 15
    },
    width: 0,
    height: 0
  },
  tree: `
    <node id="container">
      <node class="cell"></node>
    </node>
  `
});