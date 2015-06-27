'use strict';

(function() {
    var modSpan = document.getElementById('current-module-name-span');
    var searchContainer = document.getElementById('famous-framework-components-search');
    var searchBtn = searchContainer.querySelector('.famous-framework-components-search-btn');
    var searchDropdown = searchContainer.querySelector('.famous-framework-components-search-dropdown');
    var searchScenes = searchContainer.querySelector('ul');
    var searchInput = searchContainer.querySelector('input');
    var searchScenesOptions = searchScenes.querySelectorAll('li');
    var prevButtonEl = document.getElementById('prev-button');
    var nextButtonEl = document.getElementById('next-button');
    var stage = document.getElementById('famous-framework-stage');

    var DEFAULT_MODULE = 'famous-demos:clickable-square';
    var currentModule = DEFAULT_MODULE;

    function moduleScriptURL(name) {
        var hyphenated = name.split(':').join('-');
        return 'build/' + hyphenated + '/' + hyphenated + '.bundle.js';
    }

    function updateCurrentModule(name) {
        currentModule = name;
        modSpan.innerText = name;
        searchInput.value = name;
        window.history.pushState(currentModule, 'Famous Framework (workspace)', '?ff=' + name);

        var script = document.createElement('script');
        script.onload = function() { FamousFramework.deploy(name, 'HEAD', '#famous-framework-stage'); };
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', moduleScriptURL(name));
        document.head.appendChild(script);
    }

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
            updateCurrentModule(event.currentTarget.textContent);
        });
    });

    var query = QUERY.ff;
    if (query) {
        query = query.split('/')[0];
        if (query.split(':').length < 2) {
            query = 'famous-demos:' + query;
        }
        updateCurrentModule(query);
    }
    else {
        updateCurrentModule(DEFAULT_MODULE);
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
        updateCurrentModule(currentModule);
    });

    prevButtonEl.addEventListener('click', function(clickEvent) {
        var indexOfCurrent = browsableModules.indexOf(currentModule);
        var indexOfPrev = (indexOfCurrent - 1) % browsableModules.length;
        if (indexOfPrev < 0) {
            indexOfPrev = browsableModules.length - 1;
        }
        currentModule = browsableModules[indexOfPrev];
        updateCurrentModule(currentModule);
    });
}());
