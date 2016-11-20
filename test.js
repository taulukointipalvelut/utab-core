"use strict";
var core = require('./core.js')
var sortings = require('./src/operations/sortings.js')
var random = require('./test/random.js')
var _ = require('underscore/underscore.js')

/*
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
}*/

async function example({
    create_teams: create_teams=true,
    total_round_num: total_round_num=10,
    id: id=1111111,
    create_adjudicators: create_adjudicators=true,
    create_venues: create_venues=true,
    create_debaters: create_debaters=true,
    proceed_rounds: proceed_rounds=true
    }, n=10) {
    var main = new core.Main(id)

    setTimeout(() => main.rounds.configure({total_round_num: total_round_num, current_round_num: 1, style: {score_weights: [1, 1, 0.5]}}).then(console.log).catch(console.error), 500)

    if (create_teams) {
        for (var i = 0; i < n; i++) {
            await main.teams.create({id: i}).catch(console.error)
        }
    }
    //console.log("teams")
    //await main.teams.read().then(console.log).catch(console.error)

    if (create_debaters) {
        for (var i = 0; i < 2*n; i++) {
            await main.debaters.create({id: i}).catch(console.error)
        }
    }
    //console.log("debaters")
    //await main.debaters.read().then(console.log).catch(console.error)

    if (create_adjudicators) {
        for (var i = 0; i < n/2+1; i++) {
            await main.adjudicators.create({id: i}).catch(console.error)
        }
    }

    //console.log("adjudicators")
    //await main.adjudicators.read().then(console.log).catch(console.error)

    if (create_venues) {
        for (var i = 0; i < n/2+1; i++) {
            await main.venues.create({id: i, priority: Math.floor(Math.random() * 3 + 1)}).catch(console.error)
        }
    }

    //console.log("venues")
    //await main.venues.read().then(console.log).catch(console.error)

    if (proceed_rounds) {

        var debaters = await main.debaters.read()
        var teams = await main.teams.find({available: true})

        var teams_to_debaters = random.generate_teams_to_debaters(teams, debaters, _.range(1, total_round_num+1))

        for (var id in teams_to_debaters) {
            for (var r in teams_to_debaters[id]) {
                main.teams.debaters.createIfNotExists({id: id, r: r, debaters: teams_to_debaters[id][r]})
            }
        }
        var style = await main.rounds.styles.read()


        for (var r = 1; r < total_round_num+1; r++) {
            var allocation = await main.allocations.get({
                    simple: false,
                    with_venues: true,
                    with_adjudicators: true,
                    filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    filters_adj: ['by_conflict', 'by_institution', 'by_bubble'],
                    filters_adj: ['by_bubble', 'by_strength', 'by_attendance']
                })

            var teams = await main.teams.find({available: true})
            var adjudicators = await main.adjudicators.find({available: true})
            var debaters = await main.debaters.read()

            var raw_debater_results = random.generate_raw_debater_results(allocation, debaters, teams_to_debaters, style, r)
            var raw_team_results = random.generate_raw_team_results(allocation, teams, style, r)
            var raw_adjudicator_results = random.generate_raw_adjudicator_results(allocation, r)

            for (var dr of raw_debater_results) {
                main.debaters.results.create(dr).catch(console.error)
            }
            for (var tr of raw_team_results) {
                await main.teams.results.create(tr).catch(console.error)
            }
            for (var ar of raw_adjudicator_results) {
                await main.adjudicators.results.create(ar).catch(console.error)
            }

            if (r !== total_round_num) {
                await main.rounds.proceed().then(console.log).catch(console.error)
            }
        }
    }
    setTimeout(main.db.close, 30000)
}

var new_tournament = {id: 3612, total_round_num: 3, create_teams: true, create_adjudicators: true, create_debaters: true, create_venues: true, proceed_rounds: false}
var tournament = {id: 3612, total_round_num: 3, create_teams: false, create_adjudicators: false, create_debaters: false, create_venues: false, proceed_rounds: true}

//example(tournament, 8)
