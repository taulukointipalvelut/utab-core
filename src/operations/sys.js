function one_sided (past_sides) {  //FOR  NA//
    return past_sides.filter(side => side === "gov").length - past_sides.filter(side => side === "opp").length
}

function allocation_deepcopy(allocation) {
    new_allocation = []
    for ({teams: teams, chairs: chairs=[], remaining_adjudicators: remaining_adjudicators=[], remaining_adjudicators2: remaining_adjudicators2=[], venue: venue=null, id: id} of allocation) {
        dict = {
            teams: teams, chairs:[].concat(chairs),
            remaining_adjudicators:[].concat(remaining_adjudicators),
            remaining_adjudicators2: [].concat(remaining_adjudicators2),
            venue: venue,
            id: id
        }
        new_allocation.push(dict)
    }
    return new_allocation
}

exports.one_sided = one_sided
exports.allocation_deepcopy = allocation_deepcopy
