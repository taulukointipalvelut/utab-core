var math = require('../general/math')

function sort_decorator(base, filter_functions, dict) {
    function _(a, b) {
        for (var func of filter_functions) {
            //console.log(func)
            var c = func(base, a, b, dict)
            if (c !== 0) {
                return c
            }
        }
        return a.id > b.id ? 1 : -1
    }
    return _
}

function compare_allocation (teams, compiled_team_results, a, b) {
    var a_teams = a.teams.map(id => teams.filter(t => t.id === id)[0])
    var b_teams = b.teams.map(id => teams.filter(t => t.id === id)[0])
    var a_win = math.sum(a_teams.map(t => compiled_team_results[t.id].win))
    var b_win = math.sum(b_teams.map(t => compiled_team_results[t.id].win))
    if (a_win > b_win) {
        return 1
    } else {
        return -1
    }
}

function sort_allocation (allocation, teams, compiled_team_results) {
    var sorted_allocation = [].concat(allocation)
    sorted_allocation.sort((a, b) => compare_allocation(teams, compiled_team_results, a, b))
    return sorted_allocation
}

function sort_teams (teams, compiled_team_results) {
    var sorted_teams = [].concat(teams)
    sorted_teams.sort((a, b) => total_team_result_comparer(compiled_team_results, a.id, b.id))
    return sorted_teams
}

function sort_adjudicators (adjudicators, compiled_adjudicator_results) {
    var sorted_adjudicators = [].concat(adjudicators)
    sorted_adjudicators.sort((a, b) => total_adjudicator_result_comparer(compiled_adjudicator_results, a.id, b.id))
    return sorted_adjudicators
}

function sort_venues (venues) {
    var sorted_venues = [].concat(venues)
    sorted_venues.sort((a, b) => a.priority > b.priority ? 1 : -1)
    return sorted_venues
}


exports.sort_teams = sort_teams
exports.sort_adjudicators = sort_adjudicators
exports.sort_venues = sort_venues
exports.sort_allocation = sort_allocation
exports.sort_decorator = sort_decorator
