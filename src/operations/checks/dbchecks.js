"use strict"
var math = require('../math.js')

function check_nums(teams, adjudicators, venues, style) {
    var num_teams = teams.filter(t => t.available).length
    var num_adjudicators = adjudicators.filter(a => a.available).length
    var num_venues = venues.filter(v => v.available).length
    if (num_teams % style.team_num !== 0) {
        throw new Error(num_teams % style.team_num + 'more teams must be set unavailable')
    }
    if (num_adjudicators < num_teams / style.team_num) {
        throw new Error('too few adjudicators')
    }
    if (num_venues < num_teams / style.team_num) {
        throw new Error('too few venues')
    }
}

function check_xs2is(xs, xs_to_ys, ys, x, y, specifier = (d, id) => d.id === id) {
    var x_ids = xs.map(t => t.id)
    var y_ids = ys.map(i => i.id)
    for (var id of x_ids) {
        var cs = xs_to_ys.filter(d => specifier(d, id))
        if (cs.length === 0) {
            throw new Error(y+' of '+x+' '+id+' is not set')
        } else {
            let ys = cs[0][y]
            if (!math.subset(ys, y_ids)) {
                throw new Error(y+' are not defined: '+ys)
            }
        }
    }
    var x_ids2 = xs_to_ys.map(e => e.id)
    for (var id of x_ids2) {
        if (!math.isin(parseInt(id), x_ids)) {
            throw new Error(x+' '+id+' is not defined: ')
        }
    }
}

function allocation_precheck(teams, adjudicators, venues, institutions, raw_teams_to_institutions, raw_adjudicators_to_institutions, raw_adjudicators_to_conflicts, style, r) {
    check_nums(teams, adjudicators, venues, style)

    check_xs2is(teams, raw_teams_to_institutions, institutions, 'team', 'institutions')
    check_xs2is(adjudicators, raw_adjudicators_to_institutions, institutions, 'adjudicator', 'institutions')
    check_xs2is(adjudicators, raw_adjudicators_to_conflicts, teams, 'adjudicator', 'conflicts')
}

function results_precheck(teams, raw_teams_to_debaters, debaters, r) {
    if (r > 1) {
        check_xs2is(teams, raw_teams_to_debaters, debaters, 'team', 'debaters', (d, id) => d.id === id && d.r === r)
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
exports.allocations_precheck = allocation_precheck
exports.results_precheck = results_precheck
