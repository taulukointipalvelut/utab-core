"use strict";
var main = require('./main.js')
var filters = require('./src/core/filters.js')
var adjfilters = require('./src/core/adjfilters.js')

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

function example(n=10, total_round_num=4) {
    var t = new main.tournament_handler("test", total_round_num)
    for (var i = 0; i < n; i++) {
        t.teams.add({id: i, institution_ids: [i%4]})
    }
    for (var i = 0; i < n; i += 2) {
        t.adjudicators.add({id: i/2, institution_ids: [i%4]})
    }
    for (var i = 0; i < n; i++) {
        t.venues.add({id: i, priority: Math.floor(Math.random() * 3)})
    }
    //console.log(t1.venues)
    for (var r = 0; r < total_round_num; r++) {
        var allocation = t.allocations.get([filters.filter_by_strength/*, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent*/], [], [], true, false)
        console.log(allocation)

        var [results, results_of_adjudicators] = generate_results(allocation)

        t.results.teams.set(results)
        t.results.adjudicators.set(results_of_adjudicators)
        //console.log(t1.teams)
        console.log(t.results.teams.get())
        console.log(t.results.adjudicators.get())
    }
}

example(8)
