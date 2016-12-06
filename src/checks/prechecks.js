"use strict"
var math = require('../general/math.js')
var loggers = require('../general/loggers.js')
var errors = require('../general/errors.js')

function check_nums_of_teams(teams, style) {
    var team_num = style.team_num
    var num_teams = teams.filter(t => t.available).length
    if (num_teams % team_num !== 0) {
        loggers.controllers('warn', num_teams % team_num + 'more teams must be set unavailable')
        throw new errors.NeedMore('team', team_num - num_teams % team_num)
    }
}

function check_nums_of_adjudicators(teams, adjudicators, style) {
    var team_num = style.team_num
    var num_teams = teams.filter(t => t.available).length
    var num_adjudicators = adjudicators.filter(a => a.available).length
    if (num_adjudicators < num_teams / team_num) {
        loggers.controllers('warn', 'too few adjudicators')
        throw new errors.NeedMore('adjudicator', Math.ceil(num_teams/team_num - num_adjudicators))
    }
}

function check_nums_of_venues(teams, venues, style) {
    var team_num = style.team_num
    var num_teams = teams.filter(t => t.available).length
    var num_venues = venues.filter(v => v.available).length
    if (num_venues < num_teams / team_num) {
        loggers.controllers('warn', 'too few venues')
        throw new errors.NeedMore('venue', Math.ceil(num_teams/team_num - num_venues))
    }
}

function check_sublist(xs, ys, x, y) {
    for (let x of xs) {
        let sub_ys = x[y]
        if (!math.subset(sub_ys, ys.map(y => y.id))) {
            loggers.controllers('warn: some '+y+' are not defined: '+sub_ys)
            throw new errors.EntityNotDefined(x.id, y.slice(0, -1))
        }
    }
}

function check_teams2debaters(teams, debaters, r) {///TESTED///
    for (var team of teams) {//check whether y in xs_to_ys is set
        var set_teams2debaters_by_r = team.debaters_by_r.filter(t2dbr => t2dbr.r === r)
        if (set_teams2debaters_by_r.length === 0) {
            loggers.controllers('warn: debaters of team :'+team.id+' is not set')
            throw new errors.DebaterNotRegistered(team.id, r)
        }
    }
}

//check_sublist([{id: 1, institutions: [1, 2]}], [{id: 1}, {id: 2}], 'team', 'institutions')
//check_teams2debaters([{id: 1, debaters_by_r: [{r: 1, debaters: []}]}], [{id: 1}], 1)

function team_allocation_precheck(teams, institutions, style) {
    check_nums_of_teams(teams, style)
    check_sublist(teams, institutions, 'team', 'institutions')
}

function adjudicator_allocation_precheck(teams, adjudicators, institutions, style) {
    check_nums(teams, adjudicators, style)
    check_sublist(adjudicators, institutions, 'adjudicator', 'institutions')
    check_sublist(adjudicators, teams, 'adjudicator', 'conflicts')
}

function venue_allocation_precheck(teams, venues, style) {
    check_nums(teams, venues, style)
}

function results_precheck(teams, debaters, r) {
    if (r > 1) {
        check_teams2debaters(teams, debaters, r)
    }
}

/*console.log(check_nums(
    [{available: true, id: 1}, {available: true, id: 2}, {available: true, id: 3}, {available: true, id: 4}],
    [{available: true, id: 1}, {available: true, id: 2}],
    [{available: true, id: 1}, {available: true, id: 2}],
    {team_num: 2}
))*/
/*
console.log(check_xs2is(
    [{available: true, id: 1}, {available: true, id: 2}, {available: true, id: 3}, {available: true, id: 4}],
    [{id: 1, institutions: [0, 1]}, {id: 2, institutions: [0, 1]}, {id: 3, institutions: [0, 1]}, {id: 4, institutions: [0, 1]}],
    [{id: 0}, {id: 1}, {id: 2}, {id: 3}],
    'team',
    'institutions'
))

console.log(check_xs2is(
    [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
    [{id: 1, debaters: [0, 1], r: 1}, {id: 2, debaters: [0, 1], r: 1}, {id: 3, debaters: [0, 1], r: 1}, {id: 4, debaters: [0, 1], r: 1}],
    [{id: 0}, {id: 1}, {id: 2}, {id: 3}],
    'team',
    'debaters',
    (d, id) => d.id === id && d.r === 1
))
*/
exports.team_allocation_precheck = team_allocation_precheck
exports.adjudicator_allocation_precheck = adjudicator_allocation_precheck
exports.venue_allocation_precheck = venue_allocation_precheck
exports.results_precheck = results_precheck
