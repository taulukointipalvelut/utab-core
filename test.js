"use strict";
var tournament = require('./tournament.js')
var sys = require('./lib/sys.js')
var filters = require('./lib/filters.js')

function generate_results(team_allocation) {
    var results = []

    for (pair of team_allocation) {
        var team1_score = Math.floor(210 + Math.floor(Math.random()*24))
        var team2_score = Math.floor(210 + Math.floor(Math.random()*24))
        var team1_win = team1_score > team2_score ? 1 : 0
        results.push({
            team1: {
                team_id: pair.team1,
                win: team1_win,
                score: team1_score,
                side: "gov"
            },
            team2: {
                team_id: pair.team2,
                win: 1 - team1_win,
                score: team2_score,
                side: "opp"
            }
        })
    }
    return results
}

function example(n, rounds=4) {
    var t1 = new tournament.Tournament("test", rounds)
    for (var i = 0; i < n; i++) {
        t1.set_team({team_id: i, institution_ids: [i%4]})
    }
    for (var r = 0; r < rounds; r++) {
        var round = t1.get_current_round()
        var team_allocation = round.get_allocation([filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent])
        console.log(team_allocation)

        var results = generate_results(team_allocation)

        round.process_result(results)
        //console.log(t1.teams)
    }
}

example(4)
