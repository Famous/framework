'use strict';

(function() {
    var modSpan = document.getElementById('current-module-name-span');
    var searchContainer = document.getElementById('famous-framework-components-search');
    var searchBtn = searchContainer.querySelector('.famous-framework-components-search-btn');
    var searchDropdown = searchContainer.querySelector('.famous-framework-components-search-dropdown');
    var searchForm = searchContainer.querySelector('form');
    var searchScenes = searchContainer.querySelector('ul');
    var searchInput = searchContainer.querySelector('input');
    var searchScenesOptions = searchScenes.querySelectorAll('li');
    var prevButtonEl = document.getElementById('prev-button');
    var nextButtonEl = document.getElementById('next-button');
    var iframe = document.getElementById('iframe');
    var stage = document.getElementById('famous-framework-stage');

    var SAFE_NAMESPACE_DELIMITER = '~';
    var COMPONENT_DELIMITER = ':';

    var DEFAULT_MODULE = 'famous-demos:clickable-square';
    var currentModule = DEFAULT_MODULE;

    function updateCurrentModule(name, pushState) {
        currentModule = name;
        modSpan.innerText = name;
        searchInput.value = name;

        var showNavigation = 'navigation' in QUERY ? QUERY.navigation : true;
        var showSearch = 'search' in QUERY ? QUERY.search : true;
        document.body.classList[showNavigation ? 'add' : 'remove']('show-navigation');
        document.body.classList[showSearch ? 'add' : 'remove']('show-search');

        var searchStr = '?ff=' + name;
        if ('navigation' in QUERY) {
            searchStr += '&navigation=' + QUERY.navigation.toString();
        }
        if ('search' in QUERY) {
            searchStr += '&search=' + QUERY.search.toString();
        }

        if (pushState) {
            window.history.pushState(name, 'Famous Framework (workspace)', searchStr);
        }

        var delimitedSafe = name.split(COMPONENT_DELIMITER).join(SAFE_NAMESPACE_DELIMITER);
        iframe.setAttribute('src', 'build/' + delimitedSafe + '/index.html');
    }

    searchBtn.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
            searchInput.select();
        }
    });

    searchDropdown.addEventListener('click', function() {
        searchContainer.classList.toggle('expanded');
    });

    searchForm.onsubmit = function() {
        updateCurrentModule(searchInput.value, true);
        searchContainer.classList.remove('active');
        return false;
    };

    [].forEach.call(searchScenesOptions, function(li) {
        li.addEventListener('click', function(event) {
            updateCurrentModule(event.currentTarget.textContent, true);
            searchContainer.classList.remove('active');
            searchContainer.classList.remove('expanded');
        });
    });

    var query = QUERY.ff;
    if (query) {
        query = query.split('/')[0];
        if (query.split(':').length < 2) {
            query = 'famous-demos:' + query;
        }
        updateCurrentModule(query, false);
    }
    else {
        updateCurrentModule(DEFAULT_MODULE, false);
    }

    // Hack to mask FOUC when using align
    setTimeout(function() {
        stage.removeAttribute('unresolved');
    }, 1000);

    var browsableModules = [
        'famous-demos:animation-timeline',
        'famous-demos:animation-timeline-queue',
        'famous-demos:attach-webgl',
        'famous-demos:best:demo',
        'famous-demos:clickable-square',
        'famous-demos:clickable-square-with-logo',
        'famous-demos:dynamic-list',
        'famous-demos:lifecycle',
        'famous-demos:repeat-color-wheel',
        'famous-demos:scroll-view-example',
        'famous-demos:simplified-todos', // ugly
        'famous-demos:styling-inner-content',
        'famous-demos:widget-dashboard:dashboard',
        'famous-tests:array-tweening',
        'famous-tests:assets-large',
        'famous-tests:bad-dependencies',
        'famous-tests:camera',
        'famous-tests:component-composition',
        'famous-tests:component-targeting:parent',
        'famous-tests:control-flow:basic-if',
        'famous-tests:control-flow:repeat',
        'famous-tests:control-flow:static-repeat',
        'famous-tests:custom-famous-node',
        'famous-tests:custom-toolchain',
        'famous-tests:dispatcher:broadcasting',
        'famous-tests:dispatcher:trigger',
        'famous-tests:dispatcher:emit',
        'famous-tests:does-behavior-void:parent',
        'famous-tests:engine-integration',
        'famous-tests:fouc',
        'famous-tests:html-element-events',
        'famous-tests:include-css',
        'famous-tests:input-field-data',
        'famous-tests:misspelled-facets',
        'famous-tests:mount-point',
        'famous-tests:observe-nested-state',
        'famous-tests:opacity',
        'famous-tests:pass-through',
        'famous-tests:router-test',
        'famous-tests:scope',
        'famous-tests:setter-vs-identity:parent',
        'famous-tests:size-change-event',
        'famous-tests:state-interruption',
        'famous-tests:state-manager-test',
        'famous-tests:static-assets',
        'famous-tests:timeline:top-level-function',
        'famous-tests:timeline-example',
        'famous-tests:weird-files'
    ];

    nextButtonEl.addEventListener('click', function(clickEvent) {
        var indexOfCurrent = browsableModules.indexOf(currentModule);
        var indexOfNext = (indexOfCurrent + 1) % browsableModules.length;
        currentModule = browsableModules[indexOfNext];
        updateCurrentModule(currentModule, true);
    });

    prevButtonEl.addEventListener('click', function(clickEvent) {
        var indexOfCurrent = browsableModules.indexOf(currentModule);
        var indexOfPrev = (indexOfCurrent - 1) % browsableModules.length;
        if (indexOfPrev < 0) {
            indexOfPrev = browsableModules.length - 1;
        }
        currentModule = browsableModules[indexOfPrev];
        updateCurrentModule(currentModule, true);
    });
}());
