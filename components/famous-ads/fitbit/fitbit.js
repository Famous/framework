BEST.component('famous-ads:fitbit', {
    tree: 'fitbit.html',
    behaviors: {
        '#ad-container': {
            'size': function(adSize) {
                return adSize;
            }
        },
        '#meet-family-container': {
            'position': function(meetFamilyPosition) {
                return meetFamilyPosition;
            },
        },
        '#meet-family': {
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
                'background-color': 'black',
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
            'style': {
                'background-color': 'rgb(239, 61, 111)',
                'border-radius': '10px',
                'text-align': 'center',
                'font-size': '18px',
                'color': 'white'
            }
        },
        '#charge-img-container': {
            'position': function(chargeImagePosition) {
                return chargeImagePosition;
            }
        },
        '#charge-label-container': {
            'position': function(chargeLabelPosition) {
                return chargeLabelPosition;
            }
        },
        '#charge-label': {
            'style': {
                'font-size': '20px',
                'font-weight': '50px',
            }
        },
        '#flex-img-container': {
            'position': function(flexImagePosition) {
                return flexImagePosition;
            }
        },
        '#flex-label-container': {
            'position': function(flexLabelPosition) {
                return flexLabelPosition;
            }
        },
        '#flex-label': {
            'style': {
                'font-size': '20px',
                'font-weight': '50px',
            }
        },
        '#one-img-container': {
            'position': function(oneImagePosition) {
                return oneImagePosition;
            }
        },
        '#one-label-container': {
            'position': function(oneLabelPosition) {
                return oneLabelPosition;
            }
        },
        '#one-label': {
            'style': {
                'font-size': '20px',
                'font-weight': '50px'
            }
        },
        '#zip-img-container': {
            'position': function(zipImagePosition) {
                return zipImagePosition;
            }
        },
        '#zip-label-container': {
            'position': function(zipLabelPosition) {
                return zipLabelPosition;
            }
        },
        '#zip-label': {
            'style': {
                'font-size': '20px',
                'font-weight': '50px'
            }
        },
        '#find-fit-container': {
            'position': function(findFitPosition) {
                return findFitPosition;
            }
        },
        '#find-fit': {
            'style': {
                'color': 'rgb(71, 187, 179)',
                'font-weight': '800',
                'font-size': '30px',
                'text-align': 'center'
            }
        }
    },
    events: {},
    states: {
        adSize: [300, 250],
        meetFamilyPosition: [0, 50],
        bottomBarSize: [300, 45],
        bottomBarPosition: [0, 205],
        fitbitLogoPosition: [15, 10],
        shopNowSize: [140, 28],
        shopNowPosition: [150, 10],
        chargeImagePosition: [180, 60],
        chargeLabelPosition: [220, 30],
        flexImagePosition: [110, 65],
        flexLabelPosition: [145, 30],
        oneImagePosition: [60, 82],
        oneLabelPosition: [75, 30],
        zipImagePosition: [0, 105],
        zipLabelPosition: [30, 30],
        findFitPosition: [0, 10],
    }
});
