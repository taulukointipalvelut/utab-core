function one_sided (past_sides) {  //FOR  NA//
    return past_sides.filter(side => side === "gov").length - past_sides.filter(side => side === "opp").length
}

function allocation_deepcopy(allocation) {
    var new_allocation = []
    //console.log(allocation)
    for (var grid of allocation) {
        var {teams: teams, chairs: chairs=[], remaining_adjudicators: remaining_adjudicators=[], remaining_adjudicators2: remaining_adjudicators2=[], venue: venue=null, id: id} = grid
        var dict = {
            teams: teams,
            chairs:[].concat(chairs),
            remaining_adjudicators: [].concat(remaining_adjudicators),
            remaining_adjudicators2: [].concat(remaining_adjudicators2),
            venue: venue,
            id: id
        }
        new_allocation.push(dict)
    }
    return new_allocation
}

function acess(dict, key, def=[]) {
    if (dict.hasOwnProperty(key)) {
        return dict[key]
    } else {
        return def
    }
}

exports.one_sided = one_sided
exports.allocation_deepcopy = allocation_deepcopy
exports.acess= acess
