const Users = [
    {
        displayName: "Farhad Ghayour",
        userName: "@FGhayour",
        profileImg: "assets/images/profile-1.jpg"
    },
    {
        displayName: "Joseph Sample",
        userName: "@SampleTrack",
        profileImg: "assets/images/profile-2.png"
    },
    {
        displayName: "Felix Tripier",
        userName: "@ZSpaceFelix",
        profileImg: "assets/images/profile-3.jpeg"
    },
    {
        displayName: "Adnan Wahab",
        userName: "@RustyEDM",
        profileImg: "assets/images/profile-4.png"
    },
    {
        displayName: "Alex Gugel",
        userName: "@MergePR",
        profileImg: "assets/images/profile-1.jpg"
    },
    {
        displayName: "Dan Miller",
        userName: "@SausalitoDan",
        profileImg: "assets/images/profile-2.png"
    }
];

FamousFramework.scene('creative:twitter:messages', {
    behaviors: {
        '.user': {
            '$repeat': (users) => {
                let usersArray = [];
                const headerOffset = 139;

                for(let i = 0, j = users.length; i < j; i++) {
                    usersArray.push({
                        model: users[i],
                        positionY: i * 64 + headerOffset,
                        sizeY: 64,
                        index: i
                    });
                }

                return usersArray;
            }
        }
    },
    events: {},
    states: {
        users: Users
    },
    tree: 'messages.html'
}).config({
    includes: [
        'assets/styles/messages.css'
    ],
    imports: {
        'creative:twitter:messages': ['user']
    }
});
