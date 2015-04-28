{
    '#container' : {
        'size': [300, 250],
        'position': [100, 100],
        'overflow': 'hidden'
    },
    '#banner' : {
        'size': [300, 50],
        'position': function(t1, bannerTimeline) {
            return BEST.helpers.timeline(bannerTimeline)(t1)
        }
    },
    '#fitbit-view': {
        'align': [0, 1],
        'size' : [300, 138],
        'mount-point': [0, 1],
        'position' : function(t2, offscreenPos, fitbitViewTimeline) {
            return t2 === 0 ? offscreenPos : BEST.helpers.timeline(fitbitViewTimeline)(t2);
        }
    },
    '.fitbit' : {
        '$repeat': function(fitbitInfo, rotationCurve) {
            var messages = [];
            var offset = 0;
            for (var i = 0; i < fitbitInfo.length; i++) {
                messages.push({
                    'position': [offset, 0],
                    'image-url': fitbitInfo[i].url,
                    'label' : fitbitInfo[i].label,
                    'animate-in-curve' : rotationCurve,
                    'animate-out-curve': rotationCurve
                });
                offset += fitbitInfo[i].size[0];
                // Move last two items closer together
                if (i === 2) {
                    offset -= 15;
                }
            }
            return messages;
        },
        'label-style' : {
            'font-size': '20px',
            'font-weight': '500',
            'z-index' : '5'
        },
        'animation-position' : function(t2, $index, identityArray, delay, itemAnimationDuration, fitbitItemTimeline) {
            var originalDelay = delay;
            delay = delay * (3 - $index); // Last indexed item slides in first
            fitbitItemTimeline[1][0] = delay;
            fitbitItemTimeline[2][0] = delay + itemAnimationDuration;
            return BEST.helpers.timeline(fitbitItemTimeline)(t2);
        },
        'label-position' : function(t3, labelTimeline, identityArray, animationComplete) {
            return t3 === 0 || animationComplete ? identityArray : BEST.helpers.timeline(labelTimeline)(t3);
        },
        'rotation-x' : function(animationComplete) {
            return animationComplete ? Math.PI / 2 : 0;
        }
    },
    '#find-fit' : {
        'position' : function(t3, offscreenPos, findFitTimeline) {
            return t3 === 0 ? offscreenPos : BEST.helpers.timeline(findFitTimeline)(t3);
        },
        'rotation-x' : function(findFitRotation) {
            return findFitRotation;
        },
        'align': [0.5, 0],
        'mount-point': [0.5, 0],
        'size': [150, 50]
    },
    '#bottom-bar-container': {
        'size': function(bottomBarSize) {
            return bottomBarSize;
        },
        'align': [0, 1],
        'mount-point': [0, 1]
    },
    '#bottom-bar-background': {
        'style': {
            'background-color': 'rgb(17, 36, 41)',
            'z-index': '-5'
        }
    },
    '#fitbit-logo' : {
        'position' : [10, 10]
    },
    '#color-button' : {
        'style': function(buttonColor, defaultButtonColor) {
            return {'background-color': buttonColor || defaultButtonColor}
        },
        'size': [140, 28],
        'mount-point' : [1, 0.5],
        'align': [1, 0.5],
        'position' : [-10, 0]
    },
    '$self' : {
        '$self:assign-start-ad': true
    }
}