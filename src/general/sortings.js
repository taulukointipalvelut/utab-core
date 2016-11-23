"use strict";

var math = require('../general/math')
var sys = require('../allocations/sys.js')


function debater_result_comparer(results, id1, id2) {
    return sys.find_one(results, id1).average < sys.find_one(results, id2).average ? 1 : -1
}

function team_result_comparer_simple(results, id1, id2) {
    return sys.find_one(results, id1).win < sys.find_one(results, id2).win ? 1 : -1
}

function team_result_comparer_complex(results, id1, id2) {
    var result1 = sys.find_one(results, id1)
    var result2 = sys.find_one(results, id2)
    if (result1.win < result2.win) {
        return 1
    } else if (result1.win === result2.win) {
        if (result1.sum < result2.sum) {
            return 1
        } else if (result1.sum === result2.sum) {
            if (result1.margin < result2.margin) {
                return 1
            }
        }
    }
    return -1
}

function adjudicator_result_comparer(results, id1, id2) {
    return sys.find_one(results, id1).score < sys.find_one(results, id2).score ? 1 : -1
}

function total_debater_result_comparer(results, id1, id2) {
    if (sys.find_one(results, id1).sum < sys.find_one(results, id2).sum) {
        return 1
    } else {
        if (sys.find_one(results, id1).average < sys.find_one(results, id2).average) {
            return 1
        }
    }
    return -1
}

function total_adjudicator_result_comparer(results, id1, id2) {
    return sys.find_one(results, id1).average < sys.find_one(results, id2).average ? 1 : -1
}

function total_team_result_comparer(results, id1, id2) {
    if (sys.find_one(results, id1).win < sys.find_one(results, id2).win) {
        return 1
    } else if (sys.find_one(results, id1).win === sys.find_one(results, id2).win) {
        if (sys.find_one(results, id1).sum < sys.find_one(results, id2).sum) {
            return 1
        } else if (sys.find_one(results, id1).sum === sys.find_one(results, id2).sum) {
            if (sys.find_one(results, id1).margin < sys.find_one(results, id2).margin) {
                return 1
            }
        }
    }
    return -1
}

function total_team_result_simple_comparer(results, id1, id2) {
    if (sys.find_one(results, id1).win < sys.find_one(results, id2).win) {
        return 1
    } else {
        return -1
    }
}

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
    var a_win = math.sum(a_teams.map(t => sys.find_one(compiled_team_results, t.id).win))
    var b_win = math.sum(b_teams.map(t => sys.find_one(compiled_team_results, t.id).win))
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



exports.debater_result_comparer = debater_result_comparer
exports.adjudicator_result_comparer = adjudicator_result_comparer
exports.team_result_comparer_simple = team_result_comparer_simple
exports.team_result_comparer_complex = team_result_comparer_complex
exports.total_debater_result_comparer = total_debater_result_comparer
exports.total_adjudicator_result_comparer = total_adjudicator_result_comparer
exports.total_team_result_comparer = total_team_result_comparer
exports.total_team_result_simple_comparer = total_team_result_simple_comparer

exports.sort_teams = sort_teams
exports.sort_adjudicators = sort_adjudicators
exports.sort_venues = sort_venues
exports.sort_allocation = sort_allocation
exports.sort_decorator = sort_decorator
