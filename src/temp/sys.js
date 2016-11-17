"use strict"

function set_remaining_adjudicators(allocation, adjudicators, maxnum) {
    adjudicators.sort_adjudicators()
    var new_allocation = tools.allocation_deepcopy(allocation)
    var c = 0
    for (adjudicator of adjudicators) {
        if (c < maxnum) {
            c === 0 ? new_allocation.remaining_adjudicators = [] : new_allocation.remaining_adjudicators.push(adjudicator)
            c += 1
        } else {
            c = 0
        }
    }
    return new_allocation
}


function check_teams(teams) {
    if (teams.length % 2 === 1) {
        throw new Error("the number of teams should be odd")
    }

    console.log(teams.length)
    for (var i = 0; i < teams.length; i++) {
        for (var j = i + 1; j < teams.length; j++) {
            if (teams[i].id === teams[j].id) {
                throw new Error("same team exists")
            }
        }
    }
}
//check_teams([{id: 1}, {id: 2}, {id: 3}])
//check_teams([{id: 1}, {id: 1}])


/*

Example

*/
exports.get_team_allocation_from_matching = get_team_allocation_from_matching;
exports.get_ranks = get_ranks;
exports.get_ranks2 = get_ranks2;
exports.get_adjudicator_allocation_from_matching = get_adjudicator_allocation_from_matching;
