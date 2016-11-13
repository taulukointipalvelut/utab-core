"use strict";
var model = require('./model/model.js')
var sys = require('./model/src/sys.js')
var filters = require('./model/src/filters.js')
var adjfilters = require('./model/src/adjfilters.js')

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
    var t1 = new model.Tournament("test", total_round_num)
    for (var i = 0; i < n; i++) {
        t1.set_team({id: i, institution_ids: [i%4]})
    }
    for (var i = 0; i < n; i += 2) {
        t1.set_adjudicator({id: i/2, institution_ids: [i%4]})
    }
    for (var i = 0; i < n; i++) {
        t1.set_venue({id: i, priority: Math.floor(Math.random() * 3)})
    }
    //console.log(t1.venues)
    for (var r = 0; r < total_round_num; r++) {
        var round = t1.get_current_round()
        var allocation = round.get_allocation([filters.filter_by_strength/*, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent*/], [], [], true, false)
        console.log(allocation)

        var [results, results_of_adjudicators] = generate_results(allocation)

        round.process_results(results)
        round.process_result_of_adjudicators(results_of_adjudicators)
        //console.log(t1.teams)
        console.log(t1.get_team_results())
    }
}

example(8)
