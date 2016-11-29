"use strict";

var sortings = require('../general/sortings.js')
var matchings = require('./teams/matchings.js')
var wudc_matchings = require('./teams/wudc_matchings.js')
var sys = require('./sys.js')
var math = require('../general/math.js')
var filters = require('./teams/filters.js')

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
    var decided_teams

    if (teams.length === 2) {
        if (sys.one_sided(past_sides_list[0]) > sys.one_sided(past_sides_list[1])) {//if team 0 does gov more than team b
            decided_teams = [teams[1], teams[0]]//team 1 does gov in the next round
        } else if (sys.one_sided(past_sides_list[1]) > sys.one_sided(past_sides_list[0])) {
            decided_teams = [teams[0], teams[1]]
        } else {
            decided_teams = teams//math.shuffle([teams[0], teams[1]])
        }
    } else if (teams.length === 4) {//FOR BP
        var teams_list = math.permutator(teams)
        //math.shuffle(teams_list)
        var vlist = teams_list.map(ids => sys.square_one_sided_bp(ids.map(id => sys.find_one(compiled_team_results, id).past_sides)))

        decided_teams = teams_list[vlist.indexOf(Math.min(...vlist))]
    }
    return decided_teams
}

function get_team_allocation_from_matching(matching, compiled_team_results) {
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

function get_team_allocation (teams, compiled_team_results, teams_to_institutions, filters, round_info) {//GS ALGORITHM BASED//
    var filter_functions = filters.map(f => filter_dict[f])
    var available_teams = math.shuffle(teams.filter(t => t.available))
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)
    const ranks = get_team_ranks(sorted_teams, compiled_team_results, teams_to_institutions, filter_functions)
    var matching = matchings.m_gale_shapley(ts, ranks, round_info.style.team_num-1)
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

function get_team_allocation_wudc(teams, compiled_team_results, round_info) {
    var available_teams = math.shuffle(teams.filter(t => t.available), round_info.id)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var matching = wudc_matchings.wudc_matching(teams, compiled_team_results, round_info.style.team_num)
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
