"use strict";

var sortings = require('./general/sortings.js')
var matchings = require('./allocations/matchings.js')
var sys = require('./allocations/sys.js')
var math = require('./general/math.js')
var filters = require('./allocations/filters.js')
var adjfilters = require('./allocations/adjfilters.js')
/*
function compare_by_x(a, b, f, tf=true) {
    var point_a = f(a)
    var point_b = f(b)
    if (point_a > point_b) {
        return tf ? -1 : 1
    } else if (point_a < point_b) {
        return tf ? 1 : -1
    } else {
        return 0
    }
}

function compare_by_score(a, b) {
    var v_compare_by_win = compare_by_x(a, b, x => x.win.sum())
    if (v_compare_by_win === 0) {
        var v_compare_by_score = compare_by_x(a, b, x => x.scores.adjusted_average())
        if (v_compare_by_score === 0) {
            var v_compare_by_margin = compare_by_x(a, b, x => x.margins.adjusted_average())
            return v_compare_by_margin >= 0 ? -1 : 1
        } else {
            return v_compare_by_score
        }
    } else {
        return v_compare_by_win
    }
};

function compare_by_score_adj(a, b) {
    a.evaluate() > b.evaluate() ? -1 : 1
}
*/
/*

allocation deepcopy

 */


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

        others.sort(sortings.sort_decorator(team, filter_functions, {compiled_team_results: compiled_team_results, teams_to_institutions, teams_to_institutions}))
        ranks[team.id] = others.map(o => o.id)
    };
    return ranks
}

function get_adjudicator_ranks (allocation, teams, adjudicators, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions, filter_functions2) {
    var allocation_cp = [].concat(allocation)
    var g_ranks = {}
    var a_ranks = {}
    for (var square of allocation_cp) {
        adjudicators.sort(sortings.sort_decorator(square, filter_functions, {compiled_adjudicator_results: compiled_adjudicator_results, teams_to_institutions: teams_to_institutions, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts: adjudicators_to_conflicts}))
        g_ranks[square.id] = adjudicators.map(a => a.id)
    }
    for (var adjudicator of adjudicators) {
        allocation_cp.sort(sortings.sort_decorator(adjudicator, filter_functions2, {compiled_adjudicator_results: compiled_adjudicator_results, teams_to_institutions: teams_to_institutions, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts: adjudicators_to_conflicts}))
        a_ranks[adjudicator.id] = allocation_cp.map(ta => ta.id)
    }

    return [g_ranks, a_ranks]
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

function get_adjudicator_allocation_from_matching(team_allocation, matching) {
    var new_allocation = sys.allocation_deepcopy(team_allocation)
    for (var i in matching) {
        var target_allocation = new_allocation.filter(g => g.id  === parseInt(i))[0]
        target_allocation.chairs = [matching[i]]
    }
    return new_allocation
}

function arrange(dicts, key) {
    var new_dict = {}
    for (var dict of dicts) {
        new_dict[dict.id] = dict[key]
    }
    return new_dict
}

/*

Main functions

 */

function get_team_allocation (teams, compiled_team_results, raw_teams_to_institutions, filter_functions) {
    var teams_to_institutions = arrange(raw_teams_to_institutions, 'institutions')
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)
    const ranks = get_team_ranks(sorted_teams, compiled_team_results, teams_to_institutions, filter_functions)
    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = get_team_allocation_from_matching(matching, sorted_teams, compiled_team_results)
    return math.shuffle(team_allocation)
}

function get_adjudicator_allocation (allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, raw_teams_to_institutions, raw_adjudicators_to_institutions, raw_adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2) {
    var teams_to_institutions = arrange(raw_teams_to_institutions, 'institutions')
    var adjudicators_to_institutions = arrange(raw_adjudicators_to_institutions, 'institutions')
    var adjudicators_to_conflicts = arrange(raw_adjudicators_to_conflicts, 'conflicts')

    var available_teams = teams.filter(t => t.available)
    var available_adjudicators = adjudicators.filter(a => a.available)

    const [g_ranks, a_ranks] = get_adjudicator_ranks(allocation, available_teams, available_adjudicators, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)

    var sorted_adjudicators = sortings.sort_adjudicators(available_adjudicators, compiled_adjudicator_results)
    var sorted_allocation = sortings.sort_allocation(allocation, available_teams, compiled_team_results)

    var matching = matchings.gale_shapley(sorted_allocation.map(a => a.id), available_adjudicators.map(a => a.id), g_ranks, a_ranks)

    var new_allocation = get_adjudicator_allocation_from_matching(allocation, matching)
    return math.shuffle(new_allocation)
}

function get_venue_allocation(allocation, venues) {
    var available_venues = venues.map(v => v.available)
    var sorted_venues = sortings.sort_venues(math.shuffle(available_venues))
    var new_allocation = sys.allocation_deepcopy(allocation)
    var i = 0
    for (var square of new_allocation) {
        square.venue = available_venues[i].id
        i += 1
    }
    return math.shuffle(new_allocation)
}

var filter_dict = {
    by_side: filters.filter_by_side,
    by_institution: filters.filter_by_institution,
    by_past_opponent: filters.filter_by_past_opponent,
    by_strength: filters.filter_by_strength
}
var adjfilter_dict1 = {
    by_bubble: adjfilters.filter_by_bubble,
    by_strength: adjfilters.filter_by_strength,
    by_attendance: adjfilters.filter_by_attendance
}
var adjfilter_dict2 = {
    by_past: adjfilters.filter_by_past,
    by_institution: adjfilters.filter_by_institution,
    by_conflict: adjfilters.filter_by_conflict
}
//console.log(alloc)

var teams = {
    get: get_team_allocation,
    functions: {
        read: () => filter_dict
    }
}
var adjudicators = {
    get: get_adjudicator_allocation,
    functions: {
        read: () => [adjfilter_dict1, adjfilter_dict2]
    }
}
var venues = {
    get: get_venue_allocation
}
var deepcopy = sys.allocation_deepcopy

exports.teams = teams
exports.adjudicators = adjudicators
exports.venues = venues
exports.deepcopy = deepcopy
