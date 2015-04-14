var SELF_CLOSING_TAG_RE = /<[a-zA-Z]+(>|.*?[^?]\s*\/\s*>)/ig;
var UPPERCASE_RE = /[A-Z]/;

function validateEvents(eventGroups) {
    for (var selector in eventGroups) {
        var events = eventGroups[selector];
        for (var eventName in events) {
            if (UPPERCASE_RE.test(eventName)) {
                console.warn('Avoid uppercase chars in event names (found `' + eventName + '`)');
            }
        }
    }
}

function validateBehaviors(behaviorGroups) {
    for (var selector in behaviorGroups) {
        var behaviors = behaviorGroups[selector];
        for (var behaviorName in behaviors) {
            if (UPPERCASE_RE.test(behaviorName)) {
                console.warn('Avoid uppercase chars in behavior names (found `' + behaviorName + '`); use hyphenated lower-case');
            }
        }
    }
}

function validateTree(tree) {
    var matches = tree.match(SELF_CLOSING_TAG_RE);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].indexOf(':') !== -1) {
                console.warn('Avoid self-closing component tags (found `' + matches[i] + '`); use hyphenated lower-case');
            }
        }
    }
}

function validateDefinition(definition) {
    if (definition.tree) {
        validateTree(definition.tree);
    }
    if (definition.behaviors) {
        validateBehaviors(definition.behaviors);
    }
    if (definition.events) {
        validateEvents(definition.events);
    }
}

var RANDOM_RE = /Math\.random/;
var ANON_FN_RE = /function\s*\(\)\s*\{/;
var FN_DEC_RE = /function\s+[a-zA-Z]+\s*\(\)\s*\{/;

function validateSource(source) {
    if (source.match(RANDOM_RE)) {
        console.warn('`Math.random` detected; consider using `$random` instead');
    }
    if (source.match(ANON_FN_RE) || source.match(FN_DEC_RE)) {
        console.warn('Function detected; create a `BEST` helper instead');
    }
    return;
}

module.exports = {
    validateDefinition: validateDefinition,
    validateSource: validateSource
};
