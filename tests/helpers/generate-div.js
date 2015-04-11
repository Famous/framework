'use strict';

var PREFIX = 'id_';
var COUNT = 0;

function create() {
    var div = document.createElement('div');
    div.id = PREFIX + COUNT++;
    document.body.appendChild(div);
    return div;
}

module.exports = {
    create: create
};
