"use strict";
var core = require('./core.js')

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

async function example({
    create_teams: create_teams=true,
    total_round_num: total_round_num=10,
    id: id=1111111,
    create_adjudicators: create_adjudicators=true,
    create_venues: create_venues=true,
    proceed_rounds: proceed_rounds=true
    }, n=10) {
    var main = new core.Main(id)

    setTimeout(() => main.rounds.configure({total_round_num: total_round_num, current_round_num: 1, style: {score_weights: [1, 1, 0.5]}}).then(console.log).catch(console.error), 500)

    if (create_teams) {
        for (var i = 0; i < n; i++) {
            main.teams.create({id: i}).catch(console.error)
        }
    }
    console.log("teams")
    await main.teams.read().then(console.log).catch(console.error)

    if (create_adjudicators) {
        for (var i = 0; i < n/2+1; i++) {
            main.adjudicators.create({id: i}).catch(console.error)
        }
    }

    console.log("adjudicators")
    await main.adjudicators.read().then(console.log).catch(console.error)

    if (create_venues) {
        for (var i = 0; i < n/2+1; i++) {
            main.venues.create({id: i, priority: Math.floor(Math.random() * 3 + 1)}).catch(console.error)
        }
    }

    console.log("venues")
    await main.venues.read().then(console.log).catch(console.error)

    if (proceed_rounds) {
        for (var r = 1; r < total_round_num; r++) {
            main.allocations.get({
                    simple: false,
                    with_venues: true,
                    with_adjudicators: true,
                    filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    filters_adj: ['by_conflict', 'by_institution', 'by_bubble'],
                    filters_adj: ['by_bubble', 'by_strength', 'by_attendance']
                }).then(console.log).catch(console.log).then(()=>console.log("matchups"))
            //var allocation = main.allocations.get([filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent], [], [], true, false)

            /*
            var [results, results_of_adjudicators] = generate_results(allocation)

            main.teams.results.pool(results)
            main.adjudicators.results.pool(results_of_adjudicators)
            //console.log(t1.teams)
            console.log(main.teams.results.get())
            console.log(main.adjudicators.results.get())
            */
            await main.rounds.proceed().then(console.log).catch(console.error)
        }
    }
    setTimeout(main.db.close, 10000)
}

var new_tournament = {id: 32122222, total_round_num: 2, create_teams: true, create_adjudicators: true, create_venues: true, proceed_rounds: false}
var tournament = {id: 32122222, total_round_num: 2, create_teams: false, create_adjudicators: false, create_venues: false, proceed_rounds: true}

example(tournament, 8)
