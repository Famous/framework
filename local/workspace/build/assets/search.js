'use strict';

(function() {
    var searchContainer = document.getElementById('famous-framework-components-search');
    var searchBtn = searchContainer.querySelector('.famous-framework-components-search-btn');
    var searchDropdown = searchContainer.querySelector('.famous-framework-components-search-dropdown');
    var searchInput = searchContainer.querySelector('input');
    var searchScenes = searchContainer.querySelector('ul');
    var searchScenesOptions = searchScenes.querySelectorAll('li');
    var stage = document.getElementById('famous-framework-stage');
    searchBtn.addEventListener('click', function() {
        if (searchContainer.className === '') {
            searchContainer.className = 'active';
            searchInput.focus();
            searchInput.select();
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
            window.location.search = '?ff=' + event.currentTarget.textContent;
        });
    });

    var query = QUERY.ff;

    searchInput.value = query || 'clickable-square';

    if (query) {
        query = query.split('/')[0];
        console.log('query: ', query);
        if (query.split(':').length < 2) query = 'famous-demos:' + query;
        FamousFramework.deploy(query, 'HEAD', '#famous-framework-stage');
    }
    else {
        FamousFramework.deploy('famous-demos:clickable-square', 'HEAD', '#famous-framework-stage');
    }

    // Hack to mask FOUC when using align
    setTimeout(function() {
        stage.removeAttribute('unresolved');
    }, 1000);
}());
