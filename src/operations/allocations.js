var sortings = require('./sortings.js')
var matchings = require('./matchings.js')
var sys = require('./sys.js')
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
    var v_compare_by_win = compare_by_x(a, b, x => x.wins.sum())
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

function get_adjudicator_ranks (allocation, teams, adjudicators, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions, filter_functions2) {
    var allocation_cp = [].concat(allocation)
    var g_ranks = {}
    var a_ranks = {}
    for (var square of allocation_cp) {
        adjudicators.sort(sortings.sort_decorator(square, filter_functions, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts: adjudicators_to_conflicts}))
        g_ranks[square.id] = adjudicators.map(a => a.id)
    }
    for (var adjudicator of adjudicators) {
        allocation_cp.sort(sortings.sort_decorator(adjudicator, filter_functions2, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts: adjudicators_to_conflicts}))
        a_ranks[adjudicator.id] = allocation_cp.map(ta => ta.id)
    }

    return [g_ranks, a_ranks]
}


function get_team_allocation_from_matching(matching, sorted_teams, compiled_team_results) {
    var remaining = [].concat(sorted_teams)
    var team_allocation = []
    var id = 0
    for (var key in matching) {
        var team_a = sorted_teams.filter(t => t.id === parseInt(key))[0]
        var team_b = sorted_teams.filter(t => t.id === matching[key])[0]
        if (remaining.filter(x => x.id === team_a.id).length === 0) {
            continue
        }
        var team_a_past_sides = compiled_team_results[team_a.id].past_sides
        var team_b_past_sides = compiled_team_results[team_b.id].past_sides
        if (sys.one_sided(team_a_past_sides) > sys.one_sided(team_b_past_sides)) {//if team a does gov more than team b
            team_allocation.push({teams: [team_b.id, team_a.id], id: id})//team b does gov in the next round
        } else if (sys.one_sided(team_b_past_sides) > sys.one_sided(team_a_past_sides)) {
            team_allocation.push({teams: [team_a.id, team_b.id], id: id})
        } else {
            var ids = [team_a.id, team_b.id]
            team_allocation.push({teams: sortings.shuffle(ids), id: id})
        }
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

/*

Main functions

 */

function get_team_allocation (teams, compiled_team_results, teams_to_institutions, filter_functions) {
    var available_teams = teams.filter(t => t.available)
    var sorted_teams = sortings.sort_teams(available_teams, compiled_team_results)
    var ts = sorted_teams.map(t => t.id)

    const ranks = get_team_ranks(sorted_teams, compiled_team_results, teams_to_institutions, filter_functions)

    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = get_team_allocation_from_matching(matching, sorted_teams, compiled_team_results)
    return sortings.shuffle(team_allocation)
}

function get_adjudicator_allocation (allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2) {
    var available_teams = teams.filter(t => t.available)
    var available_adjudicators = adjudicators.filter(a => a.available)

    const [g_ranks, a_ranks] = get_adjudicator_ranks(allocation, available_teams, available_adjudicators, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)

    var sorted_adjudicators = sortings.sort_adjudicators(available_adjudicators, compiled_adjudicator_results)
    var sorted_allocation = sortings.sort_allocation(allocation, available_teams, compiled_team_results)

    var matching = matchings.gale_shapley(sorted_allocation.map(a => a.id), available_adjudicators.map(a => a.id), g_ranks, a_ranks)

    var new_allocation = get_adjudicator_allocation_from_matching(allocation, matching)
    return sortings.shuffle(new_allocation)
}

function get_venue_allocation(allocation, venues) {
    var available_venues = venues.map(v => v.available)
    var sorted_venues = sortings.sort_venues(sortings.shuffle(available_venues))
    var new_allocation = sys.allocation_deepcopy(allocation)
    var i = 0
    for (var square of new_allocation) {
        square.venue = available_venues[i].id
        i += 1
    }
    return sortings.shuffle(new_allocation)
}

class Allocation {
    constructor () {
        var alloc = this
        this.teams = {
            get: get_team_allocation,
            check: undefined
        }
        this.adjudicators = {
            get: get_adjudicator_allocation,
            check: undefined
        }
        this.venues = {
            get: get_venue_allocation,
            check: undefined
        }
    }

    /*
    get_allocation (
            filter_functions = [filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent],
            filter_functions_adj = [adjfilters.filter_by_bubble, adjfilters.filter_by_strength, adjfilters.filter_by_attendance],
            filter_functions_adj2 = [adjfilters.filter_by_conflict, adjfilters.filter_by_institution, adjfilters.filter_by_past],
            allocate_judge = true,
            allocate_venue = true
        ) {
        //console.log(this.teams.get())
        var allocation = get_team_allocation(this.tournament.db, filter_functions).shuffle()

        if (allocate_judge) {
            allocation = get_adjudicator_allocation(allocation, this.tournament.db, filter_functions_adj, filter_functions_adj2).shuffle()
            //console.log(adjudicator_allocation)
        }
        if (allocate_venue) {
            allocation = get_venue_allocation(allocation, this.tournament.db).shuffle()
        }

        return allocation
    }

    set_allocation (allocation) {
        allocation.map(dict => tools.check_keys(dict, ['warnings','teams','chairs','remaining_adjudicators1','remaining_adjudicators2','venue']))
        this.allocation = allocation
    }

    check_allocation (allocation) {
        allocation.map(dict => tools.check_keys(dict, ['warnings','teams','chairs','remaining_adjudicators1','remaining_adjudicators2','venue']))
        throw new Error('not done')
    }
    */
}

exports.Allocation = Allocation
