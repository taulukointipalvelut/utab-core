"use strict"
var math = require('../general/math.js')
var loggers = require('../general/loggers.js')
var errors = require('../general/errors.js')
var styles = require('../general/styles.js')

function check_nums_of_teams(teams, style) {
    var team_num = styles[style].team_num
    var num_teams = teams.filter(t => t.available).length
    if (num_teams % team_num !== 0) {
        loggers.controllers('warn', num_teams % team_num + 'more teams must be set unavailable')
        throw new errors.NeedMore('team', team_num - num_teams % team_num)
    }
}

function check_nums_of_adjudicators(teams, adjudicators, style) {
    var team_num = styles[style].team_num
    var num_teams = teams.filter(t => t.available).length
    var num_adjudicators = adjudicators.filter(a => a.available).length
    if (num_adjudicators < num_teams / team_num) {
        loggers.controllers('warn', 'too few adjudicators')
        throw new errors.NeedMore('adjudicator', Math.ceil(num_teams/team_num - num_adjudicators))
    }
}

function check_nums_of_venues(teams, venues, style) {
    var team_num = styles[style].team_num
    var num_teams = teams.filter(t => t.available).length
    var num_venues = venues.filter(v => v.available).length
    if (num_venues < num_teams / team_num) {
        loggers.controllers('warn', 'too few venues')
        throw new errors.NeedMore('venue', Math.ceil(num_teams/team_num - num_venues))
    }
}

function check_xs2is(xs, xs_to_ys, ys, x, y, specifier = (d, id) => d.id === id) {
    var x_ids = xs.map(t => t.id)
    var y_ids = ys.map(i => i.id)
    for (var id of x_ids) {//check whether y in xs_to_ys is set
        var cs = xs_to_ys.filter(d => specifier(d, id))
        if (cs.length === 0) {
            loggers.controllers('warn', y+' of '+x+' '+id+' is not set')
            throw new errors.RelationNotDefined(id, x, y.slice(0, -1))
        } else {
            let ys = cs[0][y]
            if (!math.subset(ys, y_ids)) {
                loggers.controllers('warn', y+' are not defined: '+ys)
                throw new errors.EntityNotDefined(id, y.slice(0, -1))
            }
        }
    }
    var x_ids2 = xs_to_ys.map(e => e.id)
    for (var id of x_ids2) {//check whether x in xs_to_ys is set
        if (!math.isin(parseInt(id), x_ids)) {
            loggers.controllers('warn', x+' '+id+' is not defined: ')
            throw new errors.EntityNotDefined(id, x)
        }
    }
}

function team_allocation_precheck(teams, institutions, teams_to_institutions, style) {
    check_nums_of_teams(teams, style)
    check_xs2is(teams, teams_to_institutions, institutions, 'team', 'institutions')
}

function adjudicator_allocation_precheck(teams, adjudicators, institutions, adjudicators_to_institutions, adjudicators_to_conflicts, style) {
    check_nums(teams, adjudicators, style)
    check_xs2is(adjudicators, adjudicators_to_institutions, institutions, 'adjudicator', 'institutions')
    check_xs2is(adjudicators, adjudicators_to_conflicts, teams, 'adjudicator', 'conflicts')
}

function venue_allocation_precheck(teams, venues, style) {
    check_nums(teams, venues, style)
}

function results_precheck(teams, teams_to_debaters, debaters, r) {
    if (r > 1) {
        check_xs2is(teams, teams_to_debaters, debaters, 'team', 'debaters', (d, id) => d.id === id && d.r === r)
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
