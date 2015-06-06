'use strict';

(function() {
    var searchContainer = document.getElementById('best-components-search');
    var searchBtn = searchContainer.querySelector('.best-components-search-btn');
    var searchDropdown = searchContainer.querySelector('.best-components-search-dropdown');
    var searchInput = searchContainer.querySelector('input');
    var searchScenes = searchContainer.querySelector('ul');
    var searchScenesOptions = searchScenes.querySelectorAll('li');
    var stage = document.getElementById('best-stage');
    searchBtn.addEventListener('click', function() {
        if (searchContainer.className === '') {
            searchContainer.className = 'active';
        }
        else {
            searchContainer.className = '';
        }
    });
    searchDropdown.addEventListener('click', function() {
        if (searchContainer.className === 'active') searchContainer.className = 'active expanded';
        else searchContainer.className = 'active';
    });
    [].forEach.call(searchScenesOptions, function(li) {
        li.addEventListener('click', function(event) {
            searchInput.value = event.currentTarget.textContent;
            window.location.search = '?best=' + event.currentTarget.textContent;
        });
    });
    searchInput.value = QUERY.best || 'clickable-square';

    if (QUERY.best) {
        if (QUERY.best.split(':').length < 2) QUERY.best = 'famous:demos:' + QUERY.best;
        BEST.deploy(QUERY.best, 'HEAD', '#best-stage');
    }
    else {
        BEST.deploy('famous:demos:clickable-square', 'HEAD', '#best-stage');
    }

    // Hack to mask FOUC when using align
    setTimeout(function() {
        stage.removeAttribute('unresolved');
    }, 1000);
}());
