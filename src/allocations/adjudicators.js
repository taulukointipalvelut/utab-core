var sys = require('./sys.js')
var sortings = require('../general/sortings.js')
var math = require('../general/math.js')
var adjfilters = require('./adjudicators/adjfilters.js')
var matchings = require('./adjudicators/matchings')


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

function get_adjudicator_allocation_from_matching(team_allocation, matching) {
    var new_allocation = sys.allocation_deepcopy(team_allocation)
    for (var i in matching) {
        var target_allocation = new_allocation.filter(g => g.id  === parseInt(i))[0]
        target_allocation.chairs = matching[i]
    }
    return new_allocation
}

function get_adjudicator_allocation (allocation, adjudicators, {teams: teams, compiled_team_results: compiled_team_results, compiled_adjudicator_results: compiled_adjudicator_results, teams_to_institutions: teams_to_institutions, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts: adjudicators_to_conflicts, filters: afilters}) {//GS ALGORITHM BASED//
    var available_teams = teams.filter(t => t.available)
    var available_adjudicators = adjudicators.filter(a => a.available)

    var filter_functions_adj = filters.map(f => adjfilter_dict1[f])
    var filter_functions_adj2 = filters.map(f => adjfilter_dict2[f])

    const [g_ranks, a_ranks] = get_adjudicator_ranks(allocation, available_teams, available_adjudicators, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)

    var sorted_adjudicators = sortings.sort_adjudicators(available_adjudicators, compiled_adjudicator_results)
    var sorted_allocation = sortings.sort_allocation(allocation, compiled_team_results)

    var matching = matchings.gale_shapley(sorted_allocation.map(a => a.id), available_adjudicators.map(a => a.id), g_ranks, a_ranks)

    var new_allocation = get_adjudicator_allocation_from_matching(allocation, matching)
    return math.shuffle(new_allocation)
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


var standard = {
    get: get_adjudicator_allocation
}
