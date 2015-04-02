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
        '#meet-family-banner' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [20, 50]],
                    [750,   [20, 50]],
                    [1000,  [1000, 50], 'outExpo']
                ])(time);
            },
            'style': {
                'color': 'rgb(71, 187, 179)',
                'font-weight': '800',
                'font-size': '35px',
                'text-align': 'center'
            },
            size: [300, 100]
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
        '#fitbit-logo': {
            'position': function(fitbitLogoPosition) {
                return fitbitLogoPosition;
            }
        },

        '#shop-now-button' : {
            'size': function(shopNowSize) {
                return shopNowSize;
            },
            'position': function(shopNowPosition) {
                return shopNowPosition;
            },
            'style': function(shopNowBackgroundColor, shopNowTextColor, shopNowBorderColor) {
                return {
                    'background-color': shopNowBackgroundColor,
                    'color': shopNowTextColor,
                    'border': '1px solid ' + shopNowBorderColor,
                    'border-radius': '10px',
                    'text-align': 'center',
                    'font-size': '18px',
                    'transition': 'all 0.25s ease',
                    'cursor' : 'pointer'
                }
            }
        },

        '#charge-item' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 60]],
                    [750,   [-500, 60]],
                    [1000,  [180,  60], 'easeOut']
                ])(time);
            }
        },
        '#charge-label' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [750,   [-500, 25]],
                    [1000,  [210,  25], 'easeOut'],
                    [3000,  [210,  25]],
                    [3500,  [1210, 25], 'easeOut'],
                    [3501,  [210,  25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, chargeRotationX) {
                return time > 3501 ? chargeRotationX : 
                    _timeline([
                        [0,     0],
                        [3500,  0],
                        [3501,  Math.PI/2]
                    ])(time);
            }
        },

        '#flex-item' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 65]],
                    [900,   [-500, 65]],
                    [1400,  [110,  65], 'easeOut'],
                ])(time);
            }
        },
        '#flex-label' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [900,   [-500, 25]],
                    [1400,  [140,  25], 'easeOut'],
                    [3000,  [140,  25]],
                    [3500,  [1140, 25], 'easeOut'],
                    [3501,  [140,  25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, flexRotationX) {
                return time > 3501 ? flexRotationX :
                    _timeline([
                        [0,     0],
                        [5500,  0],
                        [5501,  Math.PI/2]
                    ])(time);
            }
        },

        '#one-item' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 82]],
                    [1300,  [-500, 82]],
                    [1800,  [60,   82], 'easeOut']
                ])(time);
            }
        },
        '#one-label' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [1300,  [-500, 25]],
                    [1800,  [70,   25], 'easeOut'],
                    [3000,  [70,   25]],
                    [3500,  [1070, 25], 'easeOut'],
                    [3501,  [70,   25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, oneRotationX) {
                return time > 3501 ? oneRotationX :
                    _timeline([
                        [0,     0],
                        [3500,  0],
                        [3501,  Math.PI/2]
                    ])(time);
            }
        },

        '#zip-item' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 105]],
                    [1700,  [-500, 105]],
                    [2100,  [0,    105], 'easeOut'],
                ])(time);
            }
        },
        '#zip-label' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-500, 25]],
                    [1700,  [-500, 25]],
                    [2100,  [20,   25], 'easeOut'],
                    [3000,  [20,   25]],
                    [3500,  [1020, 25], 'easeOut'],
                    [3501,  [20,   25]]
                ])(time);
            },
            'rotation-x': function(time, _timeline, zipRotationX) {
                return time > 3501 ? zipRotationX :
                    _timeline([
                        [0,     0],
                        [3500,  0],
                        [3501,  Math.PI/2]
                    ])(time);
            }
        },

        '#find-fit' : {
            'position': function(time, _timeline) {
                return _timeline([
                    [0,     [-1000, 0]],
                    [3000,  [-1000, 0]],
                    [3250,  [75,    10], 'easeOut']
                ])(time);
            },
            'rotation-x': function(findFitRotationX) {
                return findFitRotationX;
            },
            'origin': [0.5, 0.5],
            size: [150, 50],
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
        },

        '.label' : {
            'origin': [0.5, 1],
            'size' : [70, 30],
            'style': {
                'font-size': '20px',
                'font-weight': '500'
            }
        },

        '.fitbit-img' : {
            'true-size': true,
            style: {
                cursor: 'pointer'
            }
        }
    },
    events: {
        public: {
            'handle-charge-hover': function(state) {
                state
                    .set('chargeRotationX', 0, {duration: 300, curve: 'easeOut'})
                    .set('flexRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(94, 122, 136)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)')
                    .set('shopNowBorderColor', 'rgb(0, 0, 0)');
            },
            'handle-flex-hover': function(state) {
                state
                    .set('flexRotationX', 0, {duration: 300, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(232, 87, 60)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)')
                    .set('shopNowBorderColor', 'rgb(0, 0, 0)');
            },
            'handle-one-hover': function(state) {
                state
                    .set('oneRotationX', 0, {duration: 300, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('flexRotationX', Math.PI/2)
                    .set('zipRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(6, 6, 6)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)')
                    .set('shopNowBorderColor', 'rgb(255, 255, 255)');
            },
            'handle-zip-hover': function(state) {
                state
                    .set('zipRotationX', 0, {duration: 300, curve: 'easeOut'})
                    .set('chargeRotationX', Math.PI/2)
                    .set('oneRotationX', Math.PI/2)
                    .set('flexRotationX', Math.PI/2)
                    .set('findFitRotationX', Math.PI/2)
                    .set('shopNowBackgroundColor', 'rgb(184, 222, 61)')
                    .set('shopNowTextColor', 'rgb(255, 255, 255)')
                    .set('shopNowBorderColor', 'rgb(0, 0, 0)');
            },
            'handle-exit-hover': function(state) {
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