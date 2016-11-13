"use strict";
var tournament = require('./tournament.js')
var sys = require('./src/sys.js')
var filters = require('./src/filters.js')
var adjfilters = require('./src/adjfilters.js')

function generate_results(allocation) {
    var results = []
    var results_of_adjudicators = []

    for (var pair of allocation) {
        var team1_score = Math.floor(210 + Math.floor(Math.random()*24))
        var team2_score = Math.floor(210 + Math.floor(Math.random()*24))
        var team1_win = team1_score > team2_score ? 1 : 0
        results.push({
            team1: {
                id: pair.teams[0],
                win: team1_win,
                score: team1_score,
                side: "gov"
            },
            team2: {
                id: pair.teams[1],
                win: 1 - team1_win,
                score: team2_score,
                side: "opp"
            }
        })
        results_of_adjudicators.push({id: pair.chairs[0], watched_teams: pair.teams, score: Math.floor(Math.random() * 10)})
    }
    return [results, results_of_adjudicators]
}

function example(n=10, rounds=4) {
    var t1 = new tournament.Tournament("test", rounds)
    for (var i = 0; i < n; i++) {
        t1.set_team({id: i, institution_ids: [i%4]})
    }
    for (var i = 0; i < n; i += 2) {
        t1.set_adjudicator({id: i, institution_ids: [i%4]})
    }
    for (var r = 0; r < rounds; r++) {
        var round = t1.get_current_round()
        var allocation = round.get_allocation([filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent])
        console.log(allocation)

        var [results, results_of_adjudicators] = generate_results(allocation)

        round.process_results(results)
        round.process_result_of_adjudicators(results_of_adjudicators)
        //console.log(t1.teams)
    }
}

example()
