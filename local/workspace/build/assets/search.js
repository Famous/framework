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

    var query = QUERY.best;

    searchInput.value = query || 'clickable-square';

    if (query) {
        query = query.split('/')[0];
        console.log('query: ', query);
        if (query.split(':').length < 2) query = 'famous-demos:' + query;
        BEST.deploy(query, 'HEAD', '#best-stage');
    }
    else {
        BEST.deploy('famous-demos:clickable-square', 'HEAD', '#best-stage');
    }

    // Hack to mask FOUC when using align
    setTimeout(function() {
        stage.removeAttribute('unresolved');
    }, 1000);
}());
