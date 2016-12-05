var sys = require('./sys.js')
var sortings = require('../general/sortings.js')
var math = require('../general/math.js')
var adjfilters = require('./adjudicators/adjfilters.js')
var matchings = require('./adjudicators/matchings')
var traditional_matchings = require('./adjudicators/traditional_matchings.js')


function get_adjudicator_ranks (allocation, teams, adjudicators, compiled_adjudicator_results, filter_functions, filter_functions2) {
    var allocation_cp = [].concat(allocation)
    var g_ranks = {}
    var a_ranks = {}
    for (var square of allocation_cp) {
        adjudicators.sort(sortings.sort_decorator(square, filter_functions, {compiled_adjudicator_results: compiled_adjudicator_results}))
        g_ranks[square.id] = adjudicators.map(a => a.id)
    }
    for (var adjudicator of adjudicators) {
        allocation_cp.sort(sortings.sort_decorator(adjudicator, filter_functions2, {compiled_adjudicator_results: compiled_adjudicator_results}))
        a_ranks[adjudicator.id] = allocation_cp.map(ta => ta.id)
    }

    return [g_ranks, a_ranks]
}

function get_adjudicator_allocation_from_matching(team_allocation, matching, f) {
    var new_allocation = sys.allocation_deepcopy(team_allocation)
    for (var i in matching) {
        var target_allocation = new_allocation.filter(g => g.id  === parseInt(i))[0]
        var target = f(target_allocation)
        target = matching[i]
    }
    return new_allocation
}

function get_allocation(allocation, available_adjudicators, compiled_team_results, compiled_adjudicator_results, f, num) {
    var sorted_adjudicators = sortings.sort_adjudicators(available_adjudicators, compiled_adjudicator_results)
    var sorted_allocation = sortings.sort_allocation(allocation, compiled_team_results)

    var chair_matching = matchings.gale_shapley(sorted_allocation.map(a => a.id), available_adjudicators.map(a => a.id), g_ranks, a_ranks, num)
    var new_allocation = get_adjudicator_allocation_from_matching(allocation, chair_matching, f)
    return new_allocation
}

function get_adjudicator_allocation (allocation, adjudicators, teams, compiled_team_results, compiled_adjudicator_results, filters, {chairs: chair, panels: panels, trainees: trainees}) {//GS ALGORITHM BASED//
    var available_teams = teams.filter(t => t.available)
    var available_adjudicators = adjudicators.filter(a => a.available)

    var filter_functions_adj = filters.map(f => adjfilter_dict1[f])
    var filter_functions_adj2 = filters.map(f => adjfilter_dict2[f])

    const [g_ranks, a_ranks] = get_adjudicator_ranks(allocation, available_teams, available_adjudicators, compiled_adjudicator_results, filter_functions_adj, filter_functions_adj2)

    var new_allocation = get_allocation(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, x => x.chairs, chairs)

    var active_adjudicators = Array.prototype.concat.apply([], new_allocation.map(s => s.chairs))
    var remaining_adjudicators = math.set_minus(available_adjudicators.map(a => a.id), active_adjudicators)
    new_allocation = get_allocation(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, x => x.panels, panels)

    var active_adjudicators = Array.prototype.concat.apply([], new_allocation.map(s => s.chairs)).concat(Array.prototype.concat.apply([], new_allocation.map(s => s.panels)))
    var remaining_adjudicators = math.set_minus(available_adjudicators.map(a => a.id), active_adjudicators)
    new_allocation = get_allocation(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, x => x.trainees, trainees)

    return new_allocation
}

function get_adjudicator_allocation_traditional(allocation, adjudicators, teams, compiled_team_results, compiled_adjudicator_results, options, assign, scatter) {

    var available_adjudicators = adjudicators.filter(a => a.available)
    var sorted_adjudicators = sortings.sort_adjudicators(available_adjudicators, compiled_adjudicator_results)
    var sorted_allocation = sortings.sort_allocation(allocation, compiled_team_results)

    if (options.assign === 'high_to_high') {
        var f = traditional_matchings.allocate_high_to_high
    } else if (options.assign === 'high_to_slight') {
        var f = traditional_matchings.allocate_high_to_slight
    } else if (options.assign === 'middle_to_high') {
        var f = traditional_matchings.allocate_middle_to_high
    } else if (options.assign === 'middle_to_slight') {
        var f = traditional_matchings.allocate_middle_to_slight
    }
    var new_allocation = f(allocation, adjudicators, teams, compiled_adjudicator_results, compiled_team_results, options, assign, scatter)
    return new_allocation
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

var traditional = {
    get: get_adjudicator_allocation_traditional
}

exports.standard = standard
exports.traditional = traditional
