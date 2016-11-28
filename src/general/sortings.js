"use strict";

var math = require('../general/math')
var sys = require('../allocations/sys.js')


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

/*

ALLOCATION

 */

function allocation_comparer (compiled_team_results, a, b) {
    var a_win = math.sum(a.teams.map(id => sys.find_one(compiled_team_results, id).win))
    var b_win = math.sum(b.teams.map(id => sys.find_one(compiled_team_results, id).win))
    if (a_win > b_win) {
        return 1
    } else {
        return -1
    }
}

function allocation_slightness_comparer (s1, s2, compiled_team_results) {
	var [win_slightness1, sum_slightness1] = measure_slightness(s1.teams, compiled_team_results)
	var [win_slightness2, sum_slightness2] = measure_slightness(s2.teams, compiled_team_results)
	if (win_slightness1 > win_slightness2) {
		return 1
	} else if (win_slightness1 === win_slightness2) {
		if (sum_slightness1 > sum_slightness2) {
			return 1
		}
	}
	return -1
}

/*

ENTITIES

 */

function debater_simple_comparer(results, id1, id2) {
     return sys.find_one(results, id1).average < sys.find_one(results, id2).average ? 1 : -1
 }

function team_simple_comparer(results, id1, id2) {
     return sys.find_one(results, id1).win < sys.find_one(results, id2).win ? 1 : -1
 }


function adjudicator_simple_comparer(results, id1, id2) {
     return sys.find_one(results, id1).score < sys.find_one(results, id2).score ? 1 : -1
}

function debater_comparer(results, id1, id2) {
     if (sys.find_one(results, id1).sum < sys.find_one(results, id2).sum) {
         return 1
     } else {
         if (sys.find_one(results, id1).average < sys.find_one(results, id2).average) {
             return 1
         }
     }
     return -1
}

function adjudicator_comparer(results, id1, id2) {
     return sys.find_one(results, id1).average < sys.find_one(results, id2).average ? 1 : -1
}

function team_comparer(results, id1, id2) {
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

function sort_teams (teams, compiled_team_results, comparer=team_comparer) {
    var sorted_teams = [].concat(teams)
    sorted_teams.sort((a, b) => comparer(compiled_team_results, a.id, b.id))
    return sorted_teams
}

function sort_adjudicators (adjudicators, compiled_adjudicator_results, comparer=adjudicator_comparer) {
    var sorted_adjudicators = [].concat(adjudicators)
    sorted_adjudicators.sort((a, b) => comparer(compiled_adjudicator_results, a.id, b.id))
    return sorted_adjudicators
}

function sort_venues (venues) {
    var sorted_venues = [].concat(venues)
    sorted_venues.sort((a, b) => a.priority > b.priority ? 1 : -1)
    return sorted_venues
}

function sort_allocation (allocation, compiled_team_results, comparer=allocation_comparer) {
    var sorted_allocation = [].concat(allocation)
    sorted_allocation.sort((a, b) => comparer(compiled_team_results, a, b))
    return sorted_allocation
}
exports.allocation_comparer = allocation_comparer
exports.allocation_slightness_comparer = allocation_slightness_comparer
exports.debater_simple_comparer = debater_simple_comparer
exports.debater_comparer = debater_comparer
exports.adjudicator_simple_comparer = adjudicator_simple_comparer
exports.adjudicator_comparer = adjudicator_comparer
exports.team_simple_comparer = team_simple_comparer
exports.team_comparer = team_comparer

exports.sort_teams = sort_teams
exports.sort_adjudicators = sort_adjudicators
exports.sort_venues = sort_venues
exports.sort_allocation = sort_allocation
exports.sort_decorator = sort_decorator
