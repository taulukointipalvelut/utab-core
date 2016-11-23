"use strict";

var sortings = require('../general/sortings.js')
var matchings = require('./teams/matchings.js')
var wudc_matchings = require('./teams/wudc_matchings.js')
var sys = require('./sys.js')
var math = require('../general/math.js')
var filters = require('./teams/filters.js')

function get_team_ranks (teams, compiled_team_results, teams_to_institutions, filter_functions) {
    /* priority
    1. side
    2. strength
    3. institution
    4. past_opponent
    */
    var ranks = {};

    for (var team of teams) {
        var others = teams.filter(other => team.id !== other.id)

        others.sort(sortings.sort_decorator(team, filter_functions, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}))
        ranks[team.id] = others.map(o => o.id)
    };
    return ranks
}

function get_team_allocation_from_matching(matching, sorted_teams, compiled_team_results) {
    var remaining = [].concat(sorted_teams)
    var team_allocation = []
    var id = 0
    for (var key in matching) {
        let square = {
            id: id,
            chairs: [],
            panels: [],
            trainees: [],
            warnings: [],
            venue: null
        }
        var team_a = sorted_teams.filter(t => t.id === parseInt(key))[0]
        var team_b = sorted_teams.filter(t => t.id === matching[key])[0]
        if (remaining.filter(x => x.id === team_a.id).length === 0) {
            continue
        }
        var team_a_past_sides = sys.find_one(compiled_team_results, team_a.id).past_sides
        var team_b_past_sides = sys.find_one(compiled_team_results, team_b.id).past_sides
        if (sys.one_sided(team_a_past_sides) > sys.one_sided(team_b_past_sides)) {//if team a does gov more than team b
            square.teams = [team_b.id, team_a.id]//team b does gov in the next round
        } else if (sys.one_sided(team_b_past_sides) > sys.one_sided(team_a_past_sides)) {
            square.teams = [team_a.id, team_b.id]
        } else {
            square.teams = math.shuffle([team_a.id, team_b.id])
        }

        team_allocation.push(square)
        /*
        if (sys.one_sided(team_a_past_sides) > 0) {// if a does gov much
            if (sys.one_sided(team_b_past_sides) < sys.one_sided(team_a_past_sides)) {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            } else {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            }
        } else if (sys.one_sided(team_a_past_sides) < 0) {
            if (sys.one_sided(team_b_past_sides) > sys.one_sided(team_a_past_sides)) {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            } else {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            }
        } else {
            if (sys.one_sided(team_b_past_sides) > 0) {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            } else if (sys.one_sided(team_b_past_sides) < 0) {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            } else {
                var i = Math.floor(Math.random()*2)
                var ids = [team_a.id, team_b.id]
                team_allocation.push({teams: [ids[i], ids[1 - i]], id: id})
            }
        }
        */
        remaining = remaining.filter(x => x.id !== team_a.id & x.id !== team_b.id)
        id += 1
    }
    return team_allocation
}

function get_team_allocation_from_wudc_matching(matching) {
    undefined()//positioning is necessary
    var team_allocation = []
    var id = 0
    for (var e of matching) {
        let square = {
            id: id,
            teams: e,
            chairs: [],
            panels: [],
            trainees: [],
            warnings: [],
            venue: null
        }
        team_allocation.push(square)
    }
    return team_allocation
}

/*

Main functions

 */

function get_team_allocation (teams, compiled_team_results, {teams_to_institutions: teams_to_institutions, filters: filters}) {//GS ALGORITHM BASED//
    var filter_functions = filters.map(f => filter_dict[f])
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)
    const ranks = get_team_ranks(sorted_teams, compiled_team_results, teams_to_institutions, filter_functions)
    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = get_team_allocation_from_matching(matching, sorted_teams, compiled_team_results)
    return math.shuffle(team_allocation)
}

function get_team_allocation_wudc(teams, compiled_team_results) {
    var matching = wudc_matchings.wudc_matching(teams, compiled_team_results)
    var team_allocation = get_team_allocation_from_wudc_matching(matching)
    return math.shuffle(team_allocation)
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
