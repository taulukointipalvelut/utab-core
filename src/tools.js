function get_element_by_id (target_list, target_id) {
    for (target of target_list) {
        if (target.id == target_id) {
            return target
        }
    }
    throw new Error("could not find id:" + target_id)
}

function get_ids (target_list) {
    return target_list.map(x => x.id)
}

function allocation_deepcopy(allocation) {
    new_allocation = []
    for ({teams: teams, chairs: chairs=[], remaining_adjudicators: remaining_adjudicators=[], venue: venue=undefined, id: id} of allocation) {
        dict = {
            teams: teams, chairs:[].concat(chairs),
            remaining_adjudicators:[].concat(remaining_adjudicators),
            venue: venue,
            id: id
        }
        new_allocation.push(dict)
    }
    return new_allocation
}

exports.get_element_by_id = get_element_by_id
exports.get_ids = get_ids
exports.allocation_deepcopy = allocation_deepcopy
