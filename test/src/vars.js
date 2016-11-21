var raw_team_results = [
    {
        id: 1,
        r: 1,
        from_id: 1,
        win: 1,
        opponents: [2],
        side: 'gov'
    },
    {
        id: 2,
        r: 1,
        from_id: 1,
        win: 0,
        opponents: [1],
        side: 'opp'
    },
    {
        id: 1,
        r: 2,
        from_id: 1,
        win: 1,
        opponents: [2],
        side: 'gov'
    },
    {
        id: 2,
        r: 2,
        from_id: 1,
        win: 0,
        opponents: [1],
        side: 'opp'
    }
]

exports.compiled_simple_team_results = {
    1: {
        win: 2,
        past_sides: ['gov', 'gov'],
        past_opponents: [2, 2],
        sum: null,
        average: null,
        sd: null,
        margin: null
    },
    2: {
        win: 0,
        past_sides: ['opp', 'opp'],
        past_opponents: [1, 1],
        sum: null,
        average: null,
        sd: null,
        margin: null
    }
}

exports.teams = [
    {id: 1, available: true},
    {id: 2, available: true}
]

exports.teams_to_institutions = {
    1: [1, 2],
    2: [1]
}

exports.allocation0 = [
    {
        id: 0,
        teams: [2, 1]
    }
]
