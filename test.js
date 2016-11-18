"use strict";
var core = require('./core.js')
var sortings = require('./src/operations/sortings.js')
var _ = require('underscore/underscore.js')

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

function generate_raw_team_results(allocation, teams, style, r) {//FOR NA //TESTED//
	if (style.team_num === 4) {
        var sides = ["og", "oo", "cg", "co"]
    } else {
	    var sides = ["gov", "opp"]
    }

	//team_result = {}
    var raw_team_result_list = []

    var c = 0
    for (var grid of allocation) {
        var sides_cp = sortings.shuffle([].concat(sides))
        var win = Math.floor(Math.random()*2)
        //try {
        //    console.log(teams.map(t=>t.id))
        //} catch(e) {
        //    console.eror(e)
        //}
        //console.log("f")
        var teams_in_grid = grid.teams.map(id => teams.filter(t => t.id === id)[0])
        raw_team_result_list.push({
            id: teams_in_grid[0].id,
            from_id: c,
            r: r,
            win: win,
            side: sides_cp[0],
            opponents: grid.teams[1]
        })

        raw_team_result_list.push({
            id: teams_in_grid[1].id,
            from_id: c,
            r: r,
            win: 1-win,
            side: sides_cp[1],
            opponents: grid.teams[0]
        })
        c += 1
    }

    return raw_team_result_list
}

//console.log(generate_raw_team_results([{teams: [1, 2]}], [{id: 1}, {id: 2}], {team_num: 2}, 1))

function generate_raw_debater_results(allocation, debaters, teams_to_debaters, style, r) {//TESTED//
	var raw_debater_results = []

    var c = 0
    for (var grid of allocation) {
        for (var id of grid.teams) {
            var same_team_debaters = teams_to_debaters[id][r]
            var list_to_share = style.score_weights.map(w => Math.floor((Math.random()* 9 + 71)*w))

            var score_lists = []

            for (var j = 0; j < list_to_share.length; j++) {//for each role
                var n = Math.floor(Math.random()*same_team_debaters.length)
                for (var i = 0; i < same_team_debaters.length; i++) {//for each debater
                    if (j === 0) {
                        score_lists[i] = []
                    }

                    if (i === n) {
                        score_lists[i].push(list_to_share[j])
                    } else {
                        score_lists[i].push(0)
                    }
                }
            }

            for (var i = 0; i < same_team_debaters.length; i++) {
                raw_debater_results.push({
                    id: same_team_debaters[i],
                    from_id: c,
                    r: r,
                    scores: score_lists[i]
                })
            }
        }
        c += 1
    }
    return raw_debater_results
}

//console.log(generate_raw_debater_results([{teams: [1, 2]}], [{id: 1}, {id: 2}], {1: [1, 2], 2: [3, 4]}, {team_num: 2, score_weights: [1, 1, 0.5]}, 1))

function generate_raw_adjudicator_results(allocation, r) {//TESTED//
    var raw_adjudicator_results = []
    for (var grid of allocation) {
        for (var id of grid.chairs) {
            var watched_teams = grid.teams
            watched_teams.map(t_id =>
                raw_adjudicator_results.push({
                    r: r,
                    id: id,
                    from_id: t_id,
                    score: Math.floor(1 + 9 * Math.random()),
                    watched_teams: watched_teams
                })
            )
        }
    }
    return raw_adjudicator_results
}

//console.log(generate_raw_adjudicator_results([{teams: [1, 2], chairs: [2]}], 1))

function generate_teams_to_debaters(teams, debaters, rs, debater_num_per_team=2) {
    var teams_to_debaters = {}

    for (var team of teams) {
        teams_to_debaters[team.id] = {}
    }

    for (var r of rs) {
        var total = 0
        for (var team of teams) {
            for (var i = 0; i < debater_num_per_team; i++) {
                if (i === 0) {
                    teams_to_debaters[team.id][r] = [debaters[total].id]
                } else {
                    teams_to_debaters[team.id][r].push(debaters[total].id)
                }
                total += 1
            }
        }
    }
    return teams_to_debaters
}

//console.log(generate_teams_to_debaters([{id: 1}, {id: 2}], [{id: 1}, {id: 2}, {id: 3}, {id: 4}], [3, 2]))

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

        var teams_to_debaters = generate_teams_to_debaters(teams, debaters, _.range(1, total_round_num+1))

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

            var raw_debater_results = generate_raw_debater_results(allocation, debaters, teams_to_debaters, style, r)
            var raw_team_results = generate_raw_team_results(allocation, teams, style, r)
            var raw_adjudicator_results = generate_raw_adjudicator_results(allocation, r)

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
    setTimeout(main.db.close, 50000)
}

var new_tournament = {id: 3612, total_round_num: 3, create_teams: true, create_adjudicators: true, create_debaters: true, create_venues: true, proceed_rounds: false}
var tournament = {id: 3612, total_round_num: 3, create_teams: false, create_adjudicators: false, create_debaters: false, create_venues: false, proceed_rounds: true}

example(tournament, 8)
