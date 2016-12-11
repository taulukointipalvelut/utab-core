"use strict"
var math = require('../general/math.js')
var tools = require('../general/tools.js')
var loggers = require('../general/loggers.js')
var errors = require('../general/errors.js')

function check_nums_of_teams(teams, style, r) {
    loggers.silly_logger(check_nums_of_teams, arguments, 'checks', __filename)
    var team_num = style.team_num
    var num_teams = tools.filter_available(teams, r).length
    if (num_teams % team_num !== 0) {
        loggers.controllers('warn', team_num - num_teams % team_num + 'more teams must be registered')
        throw new errors.NeedMore('team', team_num - num_teams % team_num)
    }
}

function check_nums_of_adjudicators(teams, adjudicators, style, r, {chairs: chairs=0, panels: panels=0, trainees: trainees= 0}) {
    loggers.silly_logger(check_nums_of_adjudicators, arguments, 'checks', __filename)
    var team_num = style.team_num
    var num_teams = tools.filter_available(teams, r).length
    var num_adjudicators = tools.filter_available(adjudicators, r).length
    let adjudicators_per_square = chairs + panels + trainees
    if (num_adjudicators < num_teams / team_num * adjudicators_per_square) {
        loggers.controllers('warn', 'too few adjudicators')
        throw new errors.NeedMore('adjudicator', Math.ceil(num_teams/team_num*adjudicators_per_square - num_adjudicators))
    }
}

function check_nums_of_venues(teams, venues, style, r) {
    loggers.silly_logger(check_nums_of_venues, arguments, 'checks', __filename)
    var team_num = style.team_num
    var num_teams = tools.filter_available(teams, r).length
    var num_venues = tools.filter_available(venues, r).length
    if (num_venues < num_teams / team_num) {
        loggers.controllers('warn', 'too few venues')
        throw new errors.NeedMore('venue', Math.ceil(num_teams/team_num - num_venues))
    }
}

function check_detail(xs, r) {
    loggers.silly_logger(check_detail, arguments, 'checks', __filename)
    for (let x of xs) {
        if (x.details.filter(detail => detail.r === r).length === 0) {
            throw new errors.DetailNotDefined(x.id, r)
        }
    }
}

//check_sublist([{id: 1, institutions: [1, 2]}], [{id: 1}, {id: 2}], 'team', 'institutions')
//check_teams2debaters([{id: 1, debaters_by_r: [{r: 1, debaters: []}]}], [{id: 1}], 1)

function team_allocation_precheck(teams, institutions, style, r) {
    loggers.silly_logger(team_allocation_precheck, arguments, 'checks', __filename)
    check_detail(teams, r)
    check_nums_of_teams(teams, style, r)
    //check_sublist(teams, institutions, 'team', 'institutions', r)
}

function adjudicator_allocation_precheck(teams, adjudicators, institutions, style, r, numbers) {
    loggers.silly_logger(adjudicator_allocation_precheck, arguments, 'checks', __filename)
    check_detail(adjudicators, r)
    check_detail(teams, r)
    check_nums_of_adjudicators(teams, adjudicators, style, r, numbers)
    //check_sublist(adjudicators, institutions, 'adjudicator', 'institutions', r)
    //check_sublist(adjudicators, teams, 'adjudicator', 'conflicts', r)
}

function venue_allocation_precheck(teams, venues, style, r) {
    loggers.silly_logger(venue_allocation_precheck, arguments, 'checks', __filename)
    check_detail(venues, r)
    check_detail(teams, r)
    check_nums_of_venues(teams, venues, style, r)
}

function results_precheck(teams, debaters, r) {
    loggers.silly_logger(results_precheck, arguments, 'checks', __filename)
    //check_sublist(teams, debaters, 'team', 'debaters', r)
    check_detail(teams, r)
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
