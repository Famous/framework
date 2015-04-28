{
    '@stylesheets': [
        '@{famous:examples:ads:fitbit|assets/styles.css}'
    ],
    fitbitInfo : [
        {'url': '@{famous:examples:ads:fitbit|assets/green.png}',  label: 'zip',    size: [70, 138],  'color': 'rgb(184, 222, 61)'},
        {'url': '@{famous:examples:ads:fitbit|assets/black.png}',  label: 'one',    size: [50, 138],  'color': 'rgb(6, 6, 6)'},
        {'url': '@{famous:examples:ads:fitbit|assets/orange.png}', label: 'flex',   size: [87, 138],  'color': 'rgb(232, 87, 60)'},
        {'url': '@{famous:examples:ads:fitbit|assets/blue.png}',   label: 'charge', size: [118, 138], 'color': 'rgb(94, 122, 136)'}
    ],
    bottomBarSize : [300, 45],
    defaultButtonColor: 'rgb(239, 61, 111)',
    identityArray: [0, 0, 0],
    offscreenPos: [500, 500],
    animationComplete: false,
    findFitRotation: 0,
    rotationCurve: {duration: 300, curve: 'easeOut'},

    // T1: 'Meet the Family' banner slide out
    t1: 0,
    bannerTimeline: [
        [0, [0, 50]],
        [750, [0, 50], 'outExpo'],
        [1000, [300, 50]]
    ],

    // T2: Fitbit items stagger in
    t2: 0,
    fitbitViewTimeline: [
        [0, [-300, -45], 'outExpo'],
        [600, [0, -45]]
    ],
    fitbitItemTimeline: [
        // dynamically replace null w/ delay adjusted time
        // in behavior
        [0, [-300, 0]],
        [null, [-300, 0], 'outExpo'],
        [null, [0, 0]]
    ],
    delay: 300,
    itemAnimationDuration: 500,

    // T3: Fitbit labels slide out, 'findyourfit' label slides in
    t3: 0,
    labelTimeline: [
        // dynamically add in delay in behavior
        [0, [0, 0], 'outExpo'],
        [500, [300, 0]]
    ],
    findFitTimeline: [
        [0, [-300, 0], 'outExpo'],
        [500, [0, 0]]
    ]
}