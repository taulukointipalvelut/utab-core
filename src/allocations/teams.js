"use strict";

var sortings = require('../general/sortings.js')
var matchings = require('./teams/matchings.js')
var wudc_matchings = require('./teams/wudc_matchings.js')
var sys = require('./sys.js')
var math = require('../general/math.js')
var filters = require('./teams/filters.js')
var tools = require('./teams/tools.js')
var loggers = require('../general/loggers.js')

function get_team_ranks(teams, compiled_team_results, filter_functions) {
    var ranks = {}

    for (let team of teams) {
        let others = teams.filter(other => team.id !== other.id)
        others.sort(sortings.sort_decorator(team, filter_functions, {compiled_team_results: compiled_team_results}))

        ranks[team.id] = others.map(o => o.id)
    }
    return ranks
}

function get_team_allocation_from_matching(matching, compiled_team_results, round_info) {
    var remaining = []
    for (var key in matching) {
        remaining.push(parseInt(key))
        remaining = remaining.concat(matching[key])
    }
    var team_allocation = []
    var id = 0
    for (var key in matching) {
        if (remaining.length === 0) {
            break
        }
        let square = {
            id: id,
            chairs: [],
            panels: [],
            trainees: [],
            warnings: [],
            venue: null
        }

        /*
        select the least one sided positions
         */

        let teams = matching[key]
        teams.push(parseInt(key))

        square.teams = tools.decide_positions(teams, compiled_team_results, round_info)

        team_allocation.push(square)

        for (var team of teams) {
            remaining = remaining.filter(id => id !== team)
        }
        id += 1
    }
    return team_allocation
}

//console.log(get_team_allocation_from_matching({1: [2, 3, 4]}, [{id: 1}, {id: 2}, {id: 3}, {id: 4}], [{id: 1, past_sides: ['og', 'oo', 'cg']}, {id: 2, past_sides: ['og', 'oo']}, {id: 3, past_sides: []}, {id: 4, past_sides: []}]))
//console.log(get_team_allocation_from_matching({1: [2], 3: [4]}, [{id: 1, past_sides: ['og', 'oo', 'cg']}, {id: 2, past_sides: ['og', 'oo']}, {id: 3, past_sides: []}, {id: 4, past_sides: []}]))

/*

Main functions

*/

function get_team_allocation (teams, compiled_team_results, filters, round_info) {//GS ALGORITHM BASED//
    loggers.allocations('get_team_allocation is called')
    loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
    var filter_functions = filters.map(f => filter_dict[f])
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)
    const ranks = get_team_ranks(sorted_teams, compiled_team_results, filter_functions)
    var team_num = round_info.style.team_num
    var matching = matchings.m_gale_shapley(ts, ranks, team_num-1)
    var team_allocation = get_team_allocation_from_matching(matching, compiled_team_results, round_info)
    return team_allocation
}

function get_team_allocation_from_wudc_matching(matching) {
    var id = 0
    var allocation = []
    for (var div of matching) {
        let square = {
            id: id,
            teams: div,
            chairs: [],
            panels: [],
            trainees: [],
            warnings: [],
            venue: null
        }
        allocation.push(square)
        ++id
    }
    return allocation
}

function get_team_allocation_wudc(teams, compiled_team_results, round_info, options) {
    loggers.allocations('get_team_allocation_wudc is called')
    loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var matching = wudc_matchings.wudc_matching(teams, compiled_team_results, round_info, options)
    var team_allocation = get_team_allocation_from_wudc_matching(matching)
    return team_allocation
}

var filter_dict = {
    by_side: filters.filter_by_side,
    by_institution: filters.filter_by_institution,
    by_past_opponent: filters.filter_by_past_opponent,
    by_strength: filters.filter_by_strength
}
//console.log(alloc)

var standard = {
    get: get_team_allocation
}

var wudc = {
    get: get_team_allocation_wudc
}

exports.standard = standard
exports.wudc = wudc
