"use strict";
var core = require('./core.js')
var sortings = require('./src/operations/sortings.js')
var random = require('./test/src/random.js')
var _ = require('underscore/underscore.js')

function wrap(pr, msg) {
    if (msg) console.log(msg);
    return pr.then(console.log).catch(console.error)
}

async function test({
        create_teams: create_teams=true,
        total_round_num: total_round_num=10,
        id: id=1111111,
        create_adjudicators: create_adjudicators=true,
        create_venues: create_venues=true,
        create_debaters: create_debaters=true,
        proceed_rounds: proceed_rounds=true
    }, n=10) {

    core.connect(id)

    //setTimeout(() => core.rounds.configure({total_round_num: total_round_num, current_round_num: 1, style: {score_weights: [1, 1, 0.5]}}).then(console.log).catch(console.error), 500)

    if (create_teams) {
        for (var i = 0; i < n; i++) {
            await core.teams.create({id: i}).catch(console.error)
        }
    }
    //console.log("teams")
    //await core.teams.read().then(console.log).catch(console.error)

    if (create_debaters) {
        for (var i = 0; i < 2*n; i++) {
            await core.debaters.create({id: i}).catch(console.error)
        }
    }
    //console.log("debaters")
    //await core.debaters.read().then(console.log).catch(console.error)

    if (create_adjudicators) {
        for (var i = 0; i < n/2+1; i++) {
            await core.adjudicators.create({id: i}).catch(console.error)
        }
    }

    //console.log("adjudicators")
    //await core.adjudicators.read().then(console.log).catch(console.error)

    if (create_venues) {
        for (var i = 0; i < n/2+1; i++) {
            await core.venues.create({id: i, priority: Math.floor(Math.random() * 3 + 1)}).catch(console.error)
        }
    }

    //console.log("venues")
    //await core.venues.read().then(console.log).catch(console.error)

    if (proceed_rounds) {

        var debaters = await core.debaters.read()
        var teams = await core.teams.find({available: true})


        var teams_to_debaters = random.generate_teams_to_debaters(teams, debaters, _.range(1, total_round_num+1))

        for (var id in teams_to_debaters) {
            for (var r in teams_to_debaters[id]) {
                core.teams.debaters.createIfNotExists({id: id, r: r, debaters: teams_to_debaters[id][r]})
            }
        }

        var style = (await core.rounds.read())['style']


        for (var r = 1; r < total_round_num+1; r++) {
            var allocation = await core.allocations.get({
                    simple: false,
                    with_venues: true,
                    with_adjudicators: true,
                    filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    filters_adj: ['by_conflict', 'by_institution', 'by_bubble'],
                    filters_adj: ['by_bubble', 'by_strength', 'by_attendance']
                })

            var teams = await core.teams.find({available: true})
            var adjudicators = await core.adjudicators.find({available: true})
            var debaters = await core.debaters.read()


            var raw_debater_results = random.generate_raw_debater_results(allocation, debaters, teams_to_debaters, style, r)
            var raw_team_results = random.generate_raw_team_results(allocation, teams, style, r)
            var raw_adjudicator_results = random.generate_raw_adjudicator_results(allocation, r)

            for (var dr of raw_debater_results) {
                core.debaters.results.create(dr).catch(console.error)
            }
            for (var tr of raw_team_results) {
                await core.teams.results.create(tr).catch(console.error)
            }
            for (var ar of raw_adjudicator_results) {
                await core.adjudicators.results.create(ar).catch(console.error)
            }

            if (r !== total_round_num) {
                await core.rounds.proceed().then(console.log).catch(console.error)
            }

        }
    }
    setTimeout(core.close, 30000)
}

var tournament = {
    id: 36324312,
    total_round_num: 3,
    create_teams: false,
    create_adjudicators: false,
    create_debaters: false,
    create_venues: false,
    proceed_rounds: true
}

var new_tournament = {
    id: 36324312,
    total_round_num: 3,
    create_teams: true,
    create_adjudicators: true,
    create_debaters: true,
    create_venues: true,
    proceed_rounds: false
}


test(new_tournament)
//wrap(core.tournaments.read())
//wrap(core.tournaments.create({id: 3, name: "hello"}))

//core.connect(5409813124987)
//setTimeout(()=>wrap(core.teams.read(), 'teams'), 2000)
//wrap(core.teams.create({id: 1111}), 'created team')
//wrap(core.teams.delete({id: 4}))
//wrap(core.teams.update({id: 3, url: "hi"}))
//wrap(core.teams.find({url: ''}), 'hi')
//wrap(core.teams.read())
//setTimeout(core.close, 50000)
