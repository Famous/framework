BEST.component('famous-ads:fitbit', {
    tree: 'fitbit.html',
    behaviors: {
        '#ad-container': {
            'size': function(adSize) {
                return adSize;
            }
        },
        '#container-background': {
            'style': {
                'background-color': 'white',
                'z-index': '-10'
            }
        },
        '#meet-family-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [20, 50]],
                    [750,   [20, 50]],
                    [1000,  [1000, 50], 'outExpo']
                ])(time);
            },
        },
        '#meet-family': {
            'true-size': true,
            'style': {
                'color': 'rgb(71, 187, 179)',
                'font-weight': '800',
                'font-size': '35px',
                'text-align': 'center'
            }
        },
        '#bottom-bar-container': {
            'size': function(bottomBarSize) {
                return bottomBarSize;
            },
            'position': function(bottomBarPosition) {
                return bottomBarPosition;
            }
        },
        '#bottom-bar-background': {
            'style': {
                'background-color': 'rgb(17, 36, 41)',
                'z-index': '-5'
            }
        },
        '#fitbit-logo-container': {
            'position': function(fitbitLogoPosition) {
                return fitbitLogoPosition;
            }
        },
        '#shop-now-container': {
            'size': function(shopNowSize) {
                return shopNowSize;
            },
            'position': function(shopNowPosition) {
                return shopNowPosition;
            }
        },
        '#shop-now': {
            'style': function(shopNowBackgroundColor, shopNowTextColor) {
                console.log('test2.5')
                return {
                    'background-color': shopNowBackgroundColor,
                    'color': shopNowTextColor,
                    'border-radius': '10px',
                    'text-align': 'center',
                    'font-size': '18px',
                    'transition': 'all 0.25s ease'
                }
            }
        },
        '#charge-img-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 60]],
                    [750,   [-500, 60]],
                    [1000,  [180,  60], 'easeOut']
                ])(time);
            }
        },
        '#charge-img': {
            'true-size': true
        },
        '#charge-label-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [750,   [-500, 25]],
                    [1000,  [210,  25], 'easeOut'],
                    [5000,  [210,  25]],
                    [5500,  [1210, 25], 'easeOut'],
                    [5501,  [210,  25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, chargeRotationX) {
                return time > 5501 ? chargeRotationX : 
                    _timeline([
                        [0,     0],
                        [5500,  0],
                        [5501,  Math.PI/2]
                    ])(time);
            },
            'origin': [1, 1]
        },
        '#charge-label': {
            'true-size': true,
            'style': {
                'font-size': '20px',
                'font-weight': '50px',
            }
        },
        '#flex-img-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 65]],
                    [1500,  [-500, 65]],
                    [2000,  [110,  65], 'easeOut'],
                ])(time);
            },

        },
        '#flex-img': {
            'true-size': true
        },
        '#flex-label-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [1500,  [-500, 25]],
                    [2000,  [140,  25], 'easeOut'],
                    [5000,  [140,  25]],
                    [5500,  [1140, 25], 'easeOut'],
                    [5501,  [140,  25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, flexRotationX) {
                return time > 5501 ? flexRotationX :
                    _timeline([
                        [0,     0],
                        [5500,  0],
                        [5501,  Math.PI/2]
                    ])(time);
            },
            'origin': [1, 1]
        },
        '#flex-label': {
            'true-size': true,
            'style': {
                'font-size': '20px',
                'font-weight': '50px',
            }
        },
        '#one-img-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 82]],
                    [2500,  [-500, 82]],
                    [3000,  [60,   82], 'easeOut']
                ])(time);
            }
        },
        '#one-img': {
            'true-size': true
        },
        '#one-label-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [2500,  [-500, 25]],
                    [3000,  [70,   25], 'easeOut'],
                    [5000,  [70,   25]],
                    [5500,  [1070, 25], 'easeOut'],
                    [5501,  [70,   25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, oneRotationX) {
                return time > 5501 ? oneRotationX :
                    _timeline([
                        [0,     0],
                        [5500,  0],
                        [5501,  Math.PI/2]
                    ])(time);
            },
            'origin': [1, 1]
        },
        '#one-label': {
            'true-size': true,
            'style': {
                'font-size': '20px',
                'font-weight': '50px'
            }
        },
        '#zip-img-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 105]],
                    [3500,  [-500, 105]],
                    [4000,  [0,    105], 'easeOut'],
                ])(time);
            }
        },
        '#zip-img': {
            'true-size': true
        },
        '#zip-label-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [3500,  [-500, 25]],
                    [4000,  [20,   25], 'easeOut'],
                    [5000,  [20,   25]],
                    [5500,  [1020, 25], 'easeOut'],
                    [5501,  [20,   25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, zipRotationX) {
                return time > 5501 ? zipRotationX :
                    _timeline([
                        [0,     0],
                        [5500,  0],
                        [5501,  Math.PI/2]
                    ])(time);
            },
            'origin': [1, 1]
        },
        '#zip-label': {
            'true-size': true,
            'style': {
                'font-size': '20px',
                'font-weight': '50px'
            }
        },
        '#find-fit-container': {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-1000, 0]],
                    [5000,  [-1000, 0]],
                    [5250,  [75,    0], 'easeOut']
                ])(time);
            },
            'rotation-x': function(findFitRotationX) {
                return findFitRotationX;
            },
            'origin': [0.5, 0.5]
        },
        '#find-fit': {
            'true-size': true,
            'style': {
                'color': 'rgb(71, 187, 179)',
                'font-weight': '800',
                'font-size': '30px',
                'text-align': 'center'
            }
        },
        '$self': {
            '$self:startAd' : function(startAd) {
                return true;
            }
        }
    },
    events: {
        public: {
            'handle-charge-hover': function(state) {
                state
                    .set('chargeRotationX', 0, {duration: 200, curve: 'easeOut'})
                    .set('flexRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(94, 122, 136)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)');
            },
            'handle-flex-hover': function(state) {
                state
                    .set('flexRotationX', 0, {duration: 200, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(232, 87, 60)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)');
            },
            'handle-one-hover': function(state) {
                state
                    .set('oneRotationX', 0, {duration: 200, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('flexRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(6, 6, 6)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)');
            },
            'handle-zip-hover': function(state) {
                state
                    .set('zipRotationX', 0, {duration: 200, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('flexRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(184, 222, 61)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)');
            },
            'handle-exit-hover': function(state) {
                console.log('background hover')
                state
                    .set('chargeRotationX', Math.PI/2)
                    .set('flexRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', 0, {duration: 200, curve: 'easeOut'})
                    .set('shopNowBackgroundColor', 'rgb(239, 61, 111)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)');
            },
            'handle-button-hover': function(state) {
                state
                    .set('shopNowBackgroundColor', 'rgb(255, 255, 255)')
                    .set('shopNowTextColor', 'rgb(239, 61, 111)');
            }
        },
        handlers: {
            'startAd' : function($state, $payload) {
                $state.set('time', 10000, {duration: 10000});
            }
        }
    },
    states: {
        adSize: [300, 250],
        meetFamilyPosition: [20, 50],
        bottomBarSize: [300, 45],
        bottomBarPosition: [0, 205],
        fitbitLogoPosition: [15, 10],
        shopNowSize: [140, 28],
        shopNowPosition: [150, 10],
        shopNowBackgroundColor: 'rgb(239, 61, 111)',
        shopNowTextColor: 'rgb(255, 255, 255)',
        chargeImagePosition: [180, 60],
        chargeLabelPosition: [220, 30],
        flexImagePosition: [110, 65],
        flexLabelPosition: [145, 30],
        oneImagePosition: [60, 82],
        oneLabelPosition: [75, 30],
        zipImagePosition: [0, 105],
        zipLabelPosition: [30, 30],
        findFitPosition: [75, 10],
        findFitRotationX: 0,
        chargeRotationX: Math.PI/2,
        flexRotationX: Math.PI/2,
        oneRotationX: Math.PI/2,
        zipRotationX: Math.PI/2,
        time: 0,
        startAd: false,
    }
});