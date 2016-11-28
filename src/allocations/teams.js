"use strict";

var sortings = require('../general/sortings.js')
var matchings = require('./teams/matchings.js')
var wudc_matchings = require('./teams/wudc_matchings.js')
var sys = require('./sys.js')
var math = require('../general/math.js')
var filters = require('./teams/filters.js')

function get_side_measure_bp(past_sides, side) {
    if (past_sides.length === 0) {
        return [0, 0]
    } else {
        var sides = side ? past_sides.concat([side]) : past_sides
        var opening = (math.count(sides, 'og') + math.count(sides, 'oo') - math.count(sides, 'cg') - math.count(sides, 'co'))/past_sides.length
        var gov = (math.count(sides, 'og') + math.count(sides, 'cg') - math.count(sides, 'oo') - math.count(sides, 'co'))/past_sides.length
        return [opening, gov]
    }
}

function measure_sided(past_sides_list) {
    var positions = ['og', 'oo', 'cg', 'co']
    var ind1 = 0
    var ind2 = 0
    for (var i = 0; i < positions.length; i++) {
        let [opening, gov] = get_side_measure_bp(past_sides_list[i], positions[i])
        ind1 += Math.abs(opening)
        ind2 += Math.abs(gov)
    }
    return ind1 + ind2
}

//console.log(measure_sided([['oo'], ['cg'], ['co'], ['og']]))

function get_team_ranks (teams, compiled_team_results, teams_to_institutions, filter_functions) {
    var ranks = {};

    for (var team of teams) {
        var others = teams.filter(other => team.id !== other.id)

        others.sort(sortings.sort_decorator(team, filter_functions, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}))
        ranks[team.id] = others.map(o => o.id)
    };
    return ranks
}

function decide_positions(teams, compiled_team_results) {
    var past_sides_list = teams.map(id => sys.find_one(compiled_team_results, id).past_sides)
    var teams

    if (teams.length === 2) {
        if (sys.one_sided(past_sides_list[0]) > sys.one_sided(past_sides_list[1])) {//if team 0 does gov more than team b
            teams = [teams[1], teams[0]]//team 1 does gov in the next round
        } else if (sys.one_sided(past_sides_list[1]) > sys.one_sided(past_sides_list[0])) {
            teams = [teams[0], teams[1]]
        } else {
            teams = math.shuffle([teams[0], teams[1]])
        }
    } else {
        var teams_list = math.permutator(teams)
        math.shuffle(teams_list)
        var vlist = teams_list.map(ids => measure_sided(ids.map(id => sys.find_one(compiled_team_results, id).past_sides)))

        teams = teams_list[vlist.indexOf(Math.min(...vlist))]
    }
    return teams
}

function get_team_allocation_from_matching(matching, compiled_team_results) {
    var remaining = []
    for (var key in matching) {
        remaining.push(parseInt(key))
        remaining.concat(matching[key])
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

        square.teams = decide_positions(teams, compiled_team_results)

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

function get_team_allocation (teams, compiled_team_results, {teams_to_institutions: teams_to_institutions, filters: filters}, team_num) {//GS ALGORITHM BASED//
    var filter_functions = filters.map(f => filter_dict[f])
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)
    const ranks = get_team_ranks(sorted_teams, compiled_team_results, teams_to_institutions, filter_functions)
    var matching = matchings.m_gale_shapley(ts, ranks, team_num-1)
    var team_allocation = get_team_allocation_from_matching(matching, compiled_team_results)
    return team_allocation
}

function get_team_allocation_from_wudc_matching(matching, compiled_team_results) {
    var id = 0
    var allocation = []
    for (var div of matching) {
        let square = {
            id: id,
            teams: decide_positions(div, compiled_team_results),
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

function get_team_allocation_wudc(teams, compiled_team_results, team_num) {
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var matching = wudc_matchings.wudc_matching(teams, compiled_team_results, team_num)
    var team_allocation = get_team_allocation_from_wudc_matching(matching, compiled_team_results)
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
